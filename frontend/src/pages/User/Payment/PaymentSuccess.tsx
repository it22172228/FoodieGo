<<<<<<< Updated upstream
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="text-success">Payment Successful!</h1>
        <p className="lead mt-3">Thank you for your order. Your food is on the way!</p>
        <Link to="/" className="btn btn-success mt-4">
          Go to Home
        </Link>
=======
import React, { useEffect,useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Clock, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext'; // <-- Import useCart
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const { clearCart } = useCart(); // <-- Get clearCart from context
  const cleared = useRef(false);

 useEffect(() => {
    if (!cleared.current) {
      clearCart();
      toast.success("Cart cleared after payment!", { id: "cart-cleared" });
      cleared.current = true;
    }
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-400 to-green-500 px-6 py-8 text-center">
          <div className="animate-bounce mb-4 inline-flex">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-green-100">Your order has been placed</p>
        </div>

        {/* Order Details */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              Order #FD-{Math.floor(10000 + Math.random() * 90000)}
            </span>
          </div>

          <div className="mb-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="flex items-center text-amber-700 mb-2">
              <Clock className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Estimated Delivery</h3>
            </div>
            <p className="text-amber-800 font-medium text-xl">30-45 minutes</p>
          </div>

          <div className="text-gray-600 mb-6">
            <p>Thank you for your order! Your delicious food is being prepared and will be on its way soon.</p>
          </div>

          <div className="border-t border-gray-200 pt-4 flex flex-col items-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-transform duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Home
            </Link>
            
            <Link 
              to="/orders" 
              className="mt-4 inline-flex items-center justify-center text-gray-600 hover:text-green-600"
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              View My Orders
            </Link>
          </div>
        </div>
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default PaymentSuccess;
