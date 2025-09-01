import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof ContactSchema>;

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      await api.post('/contact', data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          We'd love to hear from you. Get in touch with us!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-muted-foreground">
                    123 Restaurant Street<br />
                    Connaught Place<br />
                    New Delhi, Delhi 110001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-muted-foreground">+91 98765 43210</p>
                  <p className="text-muted-foreground">+91 11 2345 6789</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-muted-foreground">info@restaurant.com</p>
                  <p className="text-muted-foreground">reservations@restaurant.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <div className="text-muted-foreground">
                    <p>Monday - Thursday: 11:00 AM - 10:00 PM</p>
                    <p>Friday - Sunday: 11:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Find Us</h3>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive map would go here</p>
                <p className="text-sm text-muted-foreground">
                  (Google Maps integration required)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Send className="mr-2 h-6 w-6" />
            Send us a Message
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  {...register('name')}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="9876543210"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                {...register('email')}
                type="email"
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject *</label>
              <input
                {...register('subject')}
                placeholder="What is this regarding?"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message *</label>
              <textarea
                {...register('message')}
                rows={5}
                placeholder="Your message..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              We typically respond within 2-4 hours during business hours.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Do you take reservations?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Yes! You can book a table through our website or by calling us directly.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Do you offer delivery?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Yes, we deliver within 5km radius. Minimum order value is ₹300.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Are you open on holidays?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We're open on most holidays. Check our website or call for holiday hours.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Do you cater events?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Yes! Contact us for catering services for events, parties, and corporate functions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
