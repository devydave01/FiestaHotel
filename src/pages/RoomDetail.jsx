import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Wifi, Coffee, Wind, Tv, Shield, ArrowLeft, Calendar, Users } from 'lucide-react';
import { rooms as fallbackRooms } from '../utils/dummyData';
import useStore from '../store/useStore';
import Button from '../components/atoms/Button';
import api from '../services/api';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const setSelectedRoom = useStore(state => state.setSelectedRoom);
  const { bookingDetails, setBookingDetails } = useStore();
  
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await api.getRoomById(id);
// Convert images string to array if needed
if (data.images && typeof data.images === 'string') {
  data.images = [data.images];
}
setRoom(data);
        setRoom(data);
      } catch (error) {
        console.error('Failed to fetch room:', error);
        // Fallback to dummy data for development
        const fallback = fallbackRooms.find(r => r.id === parseInt(id));
        setRoom(fallback);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (isLoading) return (
    <div className="pt-40 text-center flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-text-secondary font-medium">Loading room details...</p>
    </div>
  );

  if (!room) return <div className="pt-40 text-center text-red-500 font-bold">Room not found</div>;

  const amenities = [
    { icon: <Wifi size={20} />, name: 'Free High-Speed Wi-Fi' },
    { icon: <Coffee size={20} />, name: 'Premium Coffee Machine' },
    { icon: <Wind size={20} />, name: 'Climate Control' },
    { icon: <Tv size={20} />, name: '65" Smart TV with Netflix' },
    { icon: <Shield size={20} />, name: 'In-Room Safe' },
    { icon: <Check size={20} />, name: 'Complimentary Mini Bar' },
  ];

  const handleReserve = () => {
    setSelectedRoom(room);
    navigate('/booking');
  };

  const nights = useStore.getState().getNights();

  return (
    <div className="bg-white min-h-screen">
      {/* Back Button */}
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-text-secondary hover:text-accent transition-colors group mb-8"
        >
          <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Rooms
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 pb-24">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="space-y-4 mb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl overflow-hidden aspect-[16/9] shadow-lg shadow-black/5"
            >
              <img 
                src={room.images ? room.images[activeImageIndex] : room.image} 
                alt={room.name} 
                className="w-full h-full object-cover transition-all duration-500" 
              />
            </motion.div>
            
            {room.images && room.images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {room.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                      activeImageIndex === idx ? 'border-accent ring-2 ring-accent/20' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${room.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">{room.type} Suite</span>
              <h1 className="text-5xl font-bold">{room.name}</h1>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-accent">₦{room.price}</span>
              <p className="text-text-secondary text-sm">per night</p>
            </div>
          </div>

          <p className="text-lg text-text-secondary leading-relaxed mb-12 border-b border-gray-100 pb-12">
            {room.description}
          </p>

          <h3 className="text-2xl font-bold mb-8 text-text-main">Premium Amenities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {amenities.map((item, index) => (
              <div key={index} className="flex items-center p-4 bg-section rounded-xl border border-gray-100">
                <div className="text-accent mr-4">{item.icon}</div>
                <span className="font-medium text-text-main">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Booking Card (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 glass p-8 rounded-xl border-white/40 shadow-xl shadow-black/5">
            <h4 className="text-xl font-bold mb-6">Reservation</h4>
            
            <div className="space-y-6 mb-8">
              <div className="p-4 bg-white/50 rounded-xl border border-white/20">
                <label className="text-[10px] uppercase font-bold text-text-secondary mb-1 block tracking-wider">Check-in</label>
                <div className="flex items-center text-sm font-medium relative">
                  <Calendar size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-accent" />
                  <input 
                    type="date" 
                    className="bg-transparent border-0 text-text-main font-medium pl-6 focus:outline-none w-full"
                    value={bookingDetails.checkIn || ''}
                    onChange={(e) => setBookingDetails({ checkIn: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4 bg-white/50 rounded-xl border border-white/20">
                <label className="text-[10px] uppercase font-bold text-text-secondary mb-1 block tracking-wider">Check-out</label>
                <div className="flex items-center text-sm font-medium relative">
                  <Calendar size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-accent" />
                  <input 
                    type="date" 
                    className="bg-transparent border-0 text-text-main font-medium pl-6 focus:outline-none w-full"
                    value={bookingDetails.checkOut || ''}
                    onChange={(e) => setBookingDetails({ checkOut: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4 bg-white/50 rounded-xl border border-white/20">
                <label className="text-[10px] uppercase font-bold text-text-secondary mb-1 block tracking-wider">Guests</label>
                <div className="flex items-center text-sm font-medium">
                  <Users size={16} className="mr-2 text-accent" />
                  <select 
                    className="bg-transparent border-0 text-text-main focus:outline-none w-full"
                    value={bookingDetails.guests}
                    onChange={(e) => setBookingDetails({ guests: parseInt(e.target.value) })}
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-white/30 pt-6 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-secondary text-sm">₦{room.price} x {nights} night(s)</span>
                <span className="font-bold">₦{parseInt(room.price.replace(/,/g, '')) * nights}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-secondary text-sm">Service Fee</span>
                <span className="font-bold">₦5,000</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-accent">₦{ (parseInt(room.price.replace(/,/g, '')) * nights) + 5000 }</span>
              </div>
            </div>

            <Button onClick={handleReserve} className="w-full" size="xl">
              Reserve Now
            </Button>
            <p className="text-center text-xs text-text-secondary mt-4">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
