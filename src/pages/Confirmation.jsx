import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import jsPDF from 'jspdf';

const Confirmation = () => {
  const { selectedRoom, userInfo, resetBooking, bookingDetails, getNights } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedRoom) {
      const timer = setTimeout(() => navigate('/'), 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedRoom, navigate]);

  if (!selectedRoom) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-accent" size={40} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Booking Pending!</h2>
          <p className="text-text-secondary mb-2">Your booking request has been received and is awaiting admin approval.</p>
          <p className="text-text-secondary text-sm mb-8">A confirmation email will be sent to you once your payment is verified.</p>
          <Button onClick={() => navigate('/')} variant="ghost">Go back to Home</Button>
        </div>
      </div>
    );
  }

  const bookingId = sessionStorage.getItem('fiesta_booking_id') || ('FSTA-' + Math.floor(100000 + Math.random() * 900000));
  const nights = getNights();
  const handleDownloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text('Fiesta Hotel - Booking Receipt', 20, 20);
  doc.setFontSize(12);
  doc.text(`Booking ID: ${bookingId}`, 20, 40);
  doc.text(`Status: Pending Approval`, 20, 52);
  doc.text(`Guest Name: ${userInfo.fullName}`, 20, 64);
  doc.text(`Email: ${userInfo.email}`, 20, 76);
  doc.text(`Room: ${selectedRoom.name} (${selectedRoom.type} Suite)`, 20, 88);
  doc.text(`Check-in: ${bookingDetails.checkIn}`, 20, 100);
  doc.text(`Check-out: ${bookingDetails.checkOut}`, 20, 112);
  doc.text(`Nights: ${nights}`, 20, 124);
  doc.text(`Guests: ${bookingDetails.guests}`, 20, 136);
  doc.save(`Fiesta-Receipt-${bookingId}.pdf`);
};

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-40 pb-24 px-4 md:px-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="bg-accent/10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
          <CheckCircle className="text-accent" size={40} />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Booking Received!</h1>
        <div className="text-text-secondary text-base md:text-lg mb-10 md:mb-12 px-2">
          Thank you, <span className="font-bold text-text-main">{userInfo.fullName.split(' ')[0]}</span>. Your booking request for Fiesta is now <span className="text-accent font-bold">Pending Approval</span>. 
          <p className="mt-4">Our team is currently verifying your bank transfer. You will receive a confirmation email once approved.</p>
        </div>

        <div className="bg-section p-6 md:p-10 rounded-2xl text-left mb-10 md:mb-12 border border-gray-100 shadow-sm mx-2">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">Booking ID</p>
              <h3 className="text-lg md:text-xl font-mono font-bold">{bookingId}</h3>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">Status</p>
              <Badge variant="pending">Pending Approval</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center text-accent border border-gray-100 flex-shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold uppercase mb-1">Stay Dates</p>
                <p className="text-sm md:text-base font-semibold">{bookingDetails.checkIn} - {bookingDetails.checkOut}</p>
                <p className="text-xs text-text-secondary">{nights} Night(s) • {bookingDetails.guests} Guest(s)</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center text-accent border border-gray-100 flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold uppercase mb-1">Room Type</p>
                <p className="text-sm md:text-base font-semibold">{selectedRoom.name}</p>
                <p className="text-xs text-text-secondary">{selectedRoom.type} Suite</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Button 
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              resetBooking();
              navigate('/');
            }}
          >
            Back to Home
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={handleDownloadPDF}>
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Confirmation;
