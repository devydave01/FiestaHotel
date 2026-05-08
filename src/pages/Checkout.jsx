import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import useStore from '../store/useStore';
import Button from '../components/atoms/Button';
import { notifyAdminNewBooking } from '../services/emailService';

const Checkout = () => {
  const navigate = useNavigate();
  const { selectedRoom, userInfo, bookingDetails, resetBooking, getNights } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentInfo, setPaymentInfo] = useState({
    senderName: '',
    senderAccount: ''
  });

  if (!selectedRoom || !userInfo.email) {
    return (
      <div className="pt-40 text-center px-6">
        <h2 className="text-2xl font-bold mb-4">Incomplete booking information</h2>
        <Button onClick={() => navigate('/booking')} variant="ghost">Back to booking form</Button>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!paymentInfo.senderName || !paymentInfo.senderAccount) {
      setError('Please provide your transfer details (Name and Account Number) for verification.');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      const nights = getNights();
      const totalPrice = (parseInt(selectedRoom.price.replace(/,/g, '')) * nights) + 5000;
      const bookingId = 'FSTA-' + Math.floor(100000 + Math.random() * 900000);

      // Save booking ID so confirmation page can use the same one
      sessionStorage.setItem('fiesta_booking_id', bookingId);

      // Attempt to notify backend, but don't block if it's not ready yet
      await api.createBooking({
        roomId: selectedRoom.id,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        guests: bookingDetails.guests,
        userInfo,
        paymentInfo,
        totalPrice,
        bookingId,
        status: 'Pending'
      }).catch(err => console.log('Backend not ready, proceeding in demo mode:', err));

      // Send email alert to admin
      await notifyAdminNewBooking({
        guestName: userInfo.fullName,
        guestEmail: userInfo.email,
        guestPhone: userInfo.phone,
        room: selectedRoom.name,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        nights,
        totalPrice,
        bookingId,
        senderName: paymentInfo.senderName,
        senderAccount: paymentInfo.senderAccount,
      }).catch(err => console.log('Email notification error:', err));

      navigate('/confirmation');
    } catch (err) {
      // Direct navigation as fallback
      navigate('/confirmation');
    } finally {
      setIsProcessing(false);
    }
  };

  const nights = getNights();

  return (
    <div className="bg-section min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-text-secondary hover:text-accent transition-colors mb-8 md:mb-12"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Summary & Payment */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center text-accent">
                <ShieldCheck className="mr-3 flex-shrink-0" size={24} />
                Payment: Bank Transfer
              </h2>
              
              <div className="p-5 md:p-8 bg-section rounded-xl border border-gray-100">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-3 gap-1">
                    <span className="text-[10px] md:text-xs text-text-secondary uppercase font-bold tracking-wider">Bank</span>
                    <span className="font-bold text-base md:text-lg">Zenith Bank</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-3 gap-1">
                    <span className="text-[10px] md:text-xs text-text-secondary uppercase font-bold tracking-wider">Account Name</span>
                    <span className="font-bold">Fiesta Hotel & Suites</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-3 gap-1">
                    <span className="text-[10px] md:text-xs text-text-secondary uppercase font-bold tracking-wider">Account Number</span>
                    <span className="font-bold tracking-widest text-xl md:text-2xl text-accent">1234567890</span>
                  </div>
                </div>

                <div className="mt-6 md:mt-8 p-4 bg-accent/5 rounded-lg border border-accent/10">
                  <p className="text-[10px] md:text-xs text-text-secondary leading-relaxed">
                    <strong>Note:</strong> Please transfer the total amount to the account above, then fill in your transfer details below for verification.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment Verification Form */}
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg md:text-xl font-bold mb-6">Payment Verification</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Sender's Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Name on your bank account"
                    className="w-full bg-section border border-transparent rounded-xl py-3 px-4 focus:bg-white focus:border-accent/20 transition-all focus:outline-none"
                    value={paymentInfo.senderName}
                    onChange={(e) => setPaymentInfo({...paymentInfo, senderName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Sender's Account Number</label>
                  <input 
                    type="text" 
                    placeholder="Enter your 10-digit account number"
                    className="w-full bg-section border border-transparent rounded-xl py-3 px-4 focus:bg-white focus:border-accent/20 transition-all focus:outline-none"
                    value={paymentInfo.senderAccount}
                    onChange={(e) => setPaymentInfo({...paymentInfo, senderAccount: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center gap-4 p-5 md:p-6 bg-accent/5 rounded-2xl border border-accent/10">
              <Lock className="text-accent flex-shrink-0" size={20} />
              <p className="text-xs md:text-sm text-text-secondary">
                Your booking is safe and secure. Our team manually verifies every bank transfer to ensure your reservation is confirmed promptly.
              </p>
            </div>
          </div>

          {/* Final Totals */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 lg:sticky lg:top-32 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Final Review</h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Room</span>
                  <span className="font-medium text-right ml-4">{selectedRoom.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Guest</span>
                  <span className="font-medium">{userInfo.fullName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Nights</span>
                  <span className="font-medium">{nights} Night(s)</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center text-lg md:text-xl font-bold">
                  <span>Total Amount</span>
                  <span className="text-accent">₦{ (parseInt(selectedRoom.price.replace(/,/g, '')) * nights) + 5000 }</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <Button 
                isLoading={isProcessing}
                onClick={handleConfirm}
                className="w-full"
                size="xl"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
