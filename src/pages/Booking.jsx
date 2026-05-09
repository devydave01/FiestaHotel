import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, MessageSquare } from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';

const Booking = () => {
  const navigate = useNavigate();
  const { selectedRoom, userInfo, setUserInfo, bookingDetails, getNights } = useStore();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(userInfo);

  if (!selectedRoom) {
    return (
      <div className="pt-40 text-center px-6">
        <h2 className="text-2xl font-bold mb-4">No room selected</h2>
        <Button onClick={() => navigate('/')} variant="ghost">Back to home</Button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!bookingDetails.checkIn || !bookingDetails.checkOut) {
      setError('Please select check-in and check-out dates before proceeding.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      await api.createBooking({
        room_id: selectedRoom.id,
        guest_name: formData.fullName,
        guest_email: formData.email,
        phone: formData.phone,
        special_requests: formData.specialRequests,
        check_in: bookingDetails.checkIn,
        check_out: bookingDetails.checkOut,
        guests: bookingDetails.guests,
      });

      setUserInfo(formData);
      navigate('/checkout');
    } catch (err) {
      setError('Booking failed. Please try again.');
    }
  };
  const nights = getNights();

  return (
    <div className="bg-section min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-text-secondary hover:text-accent transition-colors mb-8 md:mb-12"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Side: Summary */}
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Booking Summary</h2>
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="space-y-4 mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-text-secondary text-[10px] uppercase font-bold tracking-widest">Dates</span>
                  <span className="font-semibold text-sm md:text-base">{bookingDetails.checkIn} - {bookingDetails.checkOut}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-text-secondary text-[10px] uppercase font-bold tracking-widest">Guests</span>
                  <span className="font-semibold text-sm md:text-base">{bookingDetails.guests} Guest(s)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6 mb-8 pb-8 border-b border-gray-100">
                <img src={selectedRoom.image} alt={selectedRoom.name} className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl object-cover" />
                <div>
                  <h3 className="text-lg md:text-xl font-bold">{selectedRoom.name}</h3>
                  <p className="text-text-secondary text-xs md:text-sm">{selectedRoom.type} Suite</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-8 border-t border-gray-100">
                <div className="flex justify-between items-center text-text-secondary text-sm md:text-base">
                  <span>{selectedRoom.price} x {nights} nights</span>
                  <span className="font-bold text-text-main">₦{parseInt(selectedRoom.price.replace(/,/g, '')) * nights}</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary text-sm md:text-base">
                  <span>Service Fee</span>
                  <span className="font-bold text-text-main">₦5,000</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-lg md:text-xl font-bold">Total Amount</span>
                  <span className="text-xl md:text-2xl font-bold text-accent">₦{(parseInt(selectedRoom.price.replace(/,/g, '')) * nights) + 5000}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Personal Details</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              <Input 
                label="Full Name" 
                icon={User} 
                placeholder="John Doe" 
                required 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
              <Input 
                label="Email Address" 
                icon={Mail} 
                type="email"
                placeholder="john@example.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <Input 
                label="Phone Number" 
                icon={Phone} 
                type="tel"
                placeholder="+234 ..." 
                required 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-text-secondary ml-1 tracking-widest">Special Requests (Optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-text-secondary" size={18} />
                  <textarea 
                    rows="4"
                    placeholder="Any specific requirements?"
                    className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="xl">
                Continue to Payment
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
