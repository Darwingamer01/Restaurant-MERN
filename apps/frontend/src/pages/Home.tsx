import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChefHat, Star, Clock, Users, Award, MapPin, Phone } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 text-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Welcome to Restaurant MERN
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience authentic flavors and exceptional dining in the heart of India. 
            Fresh ingredients, traditional recipes, and modern presentation come together 
            to create unforgettable culinary experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/menu">View Our Menu</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/reservations">Make Reservation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <ChefHat className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Expert Chefs</h3>
              <p className="text-muted-foreground">
                Our experienced chefs bring years of culinary expertise to every dish.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Star className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Only the finest ingredients sourced from trusted local suppliers.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Clock className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Fast Service</h3>
              <p className="text-muted-foreground">
                Quick and efficient service without compromising on quality.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Family Friendly</h3>
              <p className="text-muted-foreground">
                A warm, welcoming atmosphere perfect for families and friends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Dishes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🍛</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Butter Chicken</h3>
                <p className="text-muted-foreground mb-4">
                  Tender chicken in rich, creamy tomato-based sauce with aromatic spices.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">₹420</span>
                  <Button size="sm" asChild>
                    <Link to="/menu">Order Now</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🧀</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Paneer Tikka</h3>
                <p className="text-muted-foreground mb-4">
                  Marinated cottage cheese grilled to perfection with bell peppers.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">₹280</span>
                  <Button size="sm" asChild>
                    <Link to="/menu">Order Now</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🍰</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Gulab Jamun</h3>
                <p className="text-muted-foreground mb-4">
                  Soft milk dumplings soaked in cardamom-flavored sugar syrup.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">₹160</span>
                  <Button size="sm" asChild>
                    <Link to="/menu">Order Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-6">
                Established in 2010, Restaurant MERN has been serving authentic Indian cuisine 
                with a modern twist. Our journey began with a simple mission: to bring the rich 
                flavors of India to food lovers everywhere.
              </p>
              <p className="text-muted-foreground mb-6">
                From our signature butter chicken to innovative fusion dishes, every meal is 
                crafted with passion and the finest ingredients. Our chefs combine traditional 
                cooking techniques with contemporary presentation to create memorable dining experiences.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Dishes</div>
                </div>
              </div>
            </div>
            <div className="h-96 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-6xl">🏪</span>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Chefs */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Chefs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-64 w-64 mx-auto bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-4xl">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Chef Rajesh Kumar</h3>
              <p className="text-muted-foreground mb-2">Head Chef</p>
              <p className="text-sm text-muted-foreground">
                15+ years of experience in North Indian cuisine. 
                Specializes in traditional tandoor cooking.
              </p>
            </div>
            <div className="text-center">
              <div className="h-64 w-64 mx-auto bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-4xl">👩‍🍳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Chef Priya Sharma</h3>
              <p className="text-muted-foreground mb-2">Pastry Chef</p>
              <p className="text-sm text-muted-foreground">
                Master of Indian desserts and fusion sweets. 
                Creates innovative dessert experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="h-64 w-64 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-4xl">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Chef Arjun Singh</h3>
              <p className="text-muted-foreground mb-2">Sous Chef</p>
              <p className="text-sm text-muted-foreground">
                Expert in South Indian cuisine and contemporary 
                fusion cooking techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Awards & Recognition</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <Award className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
              <h3 className="font-semibold mb-2">Best Indian Restaurant</h3>
              <p className="text-sm text-muted-foreground">Delhi Food Awards 2023</p>
            </div>
            <div className="text-center p-6">
              <Star className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
              <h3 className="font-semibold mb-2">5-Star Rating</h3>
              <p className="text-sm text-muted-foreground">Google Reviews & Zomato</p>
            </div>
            <div className="text-center p-6">
              <Users className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
              <h3 className="font-semibold mb-2">Customer Choice</h3>
              <p className="text-sm text-muted-foreground">TripAdvisor 2023</p>
            </div>
            <div className="text-center p-6">
              <ChefHat className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
              <h3 className="font-semibold mb-2">Excellence in Cuisine</h3>
              <p className="text-sm text-muted-foreground">Culinary Institute 2022</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div 
                key={item}
                className="aspect-square bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <span className="text-2xl">📸</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/contact">View More Photos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-muted-foreground">
                      123 Restaurant Street<br />
                      Connaught Place<br />
                      New Delhi, Delhi 110001
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Hours</p>
                    <p className="text-muted-foreground">Daily: 11:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive Map</p>
                <p className="text-sm text-muted-foreground">(Google Maps Integration)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Dine With Us?</h2>
          <p className="text-lg mb-8 opacity-90">
            Book your table now and experience the finest Indian cuisine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/reservations">Book a Table</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-primary-foreground hover:text-primary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
