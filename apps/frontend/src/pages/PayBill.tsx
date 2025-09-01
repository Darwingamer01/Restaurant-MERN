import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Receipt, Tag, CreditCard } from 'lucide-react';

const CouponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters')
});

type CouponFormData = z.infer<typeof CouponSchema>;

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const PayBill: React.FC = () => {
  const { user } = useAuth();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: '1', name: 'Butter Chicken', price: 420, quantity: 1 },
    { id: '2', name: 'Paneer Tikka', price: 280, quantity: 2 },
    { id: '3', name: 'Garlic Naan', price: 80, quantity: 3 },
    { id: '4', name: 'Gulab Jamun', price: 160, quantity: 1 }
  ]);

  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CouponFormData>({
    resolver: zodResolver(CouponSchema)
  });

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const discountAmount = appliedCoupon ? calculateDiscount(subtotal, appliedCoupon) : 0;
  const total = subtotal + tax - discountAmount;

  function calculateDiscount(amount: number, coupon: any): number {
    if (!coupon) return 0;
    
    if (coupon.type === 'percentage') {
      let discount = (amount * coupon.value) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
      return Math.round(discount);
    } else {
      return Math.min(coupon.value, amount);
    }
  }

  const applyCoupon = async (data: CouponFormData) => {
    try {
      setIsApplyingCoupon(true);
      const response = await api.post('/coupons/apply', {
        code: data.code,
        orderAmount: subtotal
      });
      
      setAppliedCoupon(response.data.data);
      toast.success('Coupon applied successfully!');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setOrderItems(items => items.filter(item => item.id !== id));
    } else {
      setOrderItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
    // Remove coupon if order changes
    if (appliedCoupon) {
      setAppliedCoupon(null);
      toast.info('Coupon removed due to order change');
    }
  };

  const processPayment = () => {
    toast.success('Payment processed successfully!');
    // Here you would integrate with actual payment gateway
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-muted-foreground">You need to be logged in to view your bill.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Pay Bill</h1>
        <p className="text-lg text-muted-foreground">
          Review your order and complete payment
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Receipt className="mr-2 h-6 w-6" />
          Order Summary
        </h2>
        
        <div className="space-y-4">
          {orderItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-4">
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">₹{item.price} each</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
              
              <div className="w-20 text-right">
                <span className="font-semibold">₹{item.price * item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coupon Section */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Tag className="mr-2 h-5 w-5" />
          Apply Coupon
        </h2>

        {appliedCoupon ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-green-800">{appliedCoupon.code}</p>
              <p className="text-sm text-green-600">{appliedCoupon.description}</p>
              <p className="text-sm text-green-600">
                Discount: ₹{discountAmount}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={removeCoupon}>
              Remove
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(applyCoupon)} className="flex space-x-2">
            <input
              {...register('code')}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" disabled={isApplyingCoupon}>
              {isApplyingCoupon ? 'Applying...' : 'Apply'}
            </Button>
          </form>
        )}

        {errors.code && (
          <p className="text-red-500 text-sm mt-2">{errors.code.message}</p>
        )}

        {/* Available Coupons */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Available Coupons:</p>
          <div className="grid gap-2 text-xs">
            <div className="flex justify-between">
              <code className="bg-background px-2 py-1 rounded">WELCOME10</code>
              <span>10% off on orders above ₹500</span>
            </div>
            <div className="flex justify-between">
              <code className="bg-background px-2 py-1 rounded">FLAT100</code>
              <span>₹100 off on orders above ₹800</span>
            </div>
            <div className="flex justify-between">
              <code className="bg-background px-2 py-1 rounded">DESSERT20</code>
              <span>20% off on desserts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Summary */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Bill Details</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>₹{tax}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({appliedCoupon.code})</span>
              <span>-₹{discountAmount}</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Payment Method
        </h2>
        
        <div className="space-y-3 mb-6">
          <label className="flex items-center space-x-3">
            <input type="radio" name="payment" value="card" defaultChecked />
            <span>Credit/Debit Card</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="radio" name="payment" value="upi" />
            <span>UPI</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="radio" name="payment" value="cash" />
            <span>Cash on Delivery</span>
          </label>
        </div>

        <Button onClick={processPayment} className="w-full" size="lg">
          Pay ₹{total}
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>By proceeding with payment, you agree to our terms and conditions.</p>
      </div>
    </div>
  );
};

export default PayBill;
