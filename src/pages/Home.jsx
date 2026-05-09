import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users } from 'lucide-react';
import { rooms as fallbackRooms } from '../utils/dummyData';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';
import RoomCard from '../components/molecules/RoomCard';
import Button from '../components/atoms/Button';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const { bookingDetails, setBookingDetails } = useStore();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await api.getRooms();
        setRooms(data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        setRooms(fallbackRooms); // Use fallback if API fails
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSearch = () => {
    navigate('/rooms');
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 md:px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight"
          >
            Your Home Away <br className="hidden md:block" /> From Home
          </motion.h1>
          
          {/* Floating Hero Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 md:mt-12 max-w-4xl mx-auto glass rounded-2xl md:rounded-3xl p-6 border-white/30"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 items-center">
              <div className="flex flex-col items-start px-2 md:px-4 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 last:border-0">
                <span className="text-[10px] uppercase tracking-wider text-white/70 mb-2 font-bold">Check-in</span>
                <div className="relative w-full text-left">
                  <Calendar size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-accent" />
                  <input 
                    type="date" 
                    className="bg-transparent border-0 text-white font-medium pl-6 focus:outline-none w-full [color-scheme:dark]"
                    value={bookingDetails.checkIn || ''}
                    onChange={(e) => setBookingDetails({ checkIn: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col items-start px-2 md:px-4 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 last:border-0">
                <span className="text-[10px] uppercase tracking-wider text-white/70 mb-2 font-bold">Check-out</span>
                <div className="relative w-full text-left">
                  <Calendar size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-accent" />
                  <input 
                    type="date" 
                    className="bg-transparent border-0 text-white font-medium pl-6 focus:outline-none w-full [color-scheme:dark]"
                    value={bookingDetails.checkOut || ''}
                    onChange={(e) => setBookingDetails({ checkOut: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col items-start px-2 md:px-4 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 last:border-0">
                <span className="text-[10px] uppercase tracking-wider text-white/70 mb-2 font-bold">Guests</span>
                <div className="flex items-center text-white font-medium w-full">
                  <Users size={16} className="mr-2 text-accent" />
                  <select 
                    className="bg-transparent border-0 text-white focus:outline-none w-full"
                    value={bookingDetails.guests}
                    onChange={(e) => setBookingDetails({ guests: parseInt(e.target.value) })}
                  >
                    <option value="1" className="text-black">1 Guest</option>
                    <option value="2" className="text-black">2 Guests</option>
                    <option value="3" className="text-black">3 Guests</option>
                    <option value="4" className="text-black">4+ Guests</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleSearch} className="h-full py-4 md:py-3 shadow-xl shadow-accent/20">
                <Search size={20} className="mr-2" />
                Book Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section id="rooms" className="py-20 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-12 gap-4">
          <div>
            <span className="text-accent font-semibold tracking-widest uppercase text-xs md:text-sm">Experience</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Featured Rooms</h2>
          </div>
          <Link to="/rooms" className="text-text-secondary hover:text-accent font-medium transition-colors underline underline-offset-8 text-sm md:text-base">
            View All Rooms
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {isLoading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="h-[300px] md:h-[400px] bg-section animate-pulse rounded-2xl"></div>
            ))
          ) : (
            rooms.slice(0, 4).map((room) => (
              <RoomCard key={room.id} room={room} />
            ))
          )}
        </div>
      </section>

      {/* About Preview Section */}
      <section className="bg-section py-20 md:py-24 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-black/5">
              <img 
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000" 
                alt="About Fiesta" 
                className="w-full h-[400px] md:h-[600px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 hidden sm:block glass p-6 md:p-10 rounded-2xl max-w-[200px] md:max-w-xs border-white/40">
              <h4 className="text-lg md:text-xl font-bold mb-2">School Project</h4>
              <p className="text-text-secondary text-xs md:text-sm">
                Developed by Group 1 at BUCODEL (Babcock University Center of Distance Learning).
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent font-semibold tracking-widest uppercase text-xs md:text-sm">Our Project</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 md:mb-8 leading-tight">Engineering Luxury with Purpose</h2>
            <p className="text-base md:text-lg text-text-secondary mb-8 md:mb-10 leading-relaxed">
              Fiesta is a high-fidelity hotel booking platform developed as a comprehensive school project by Group 1 in BUCODEL (Babcock University Center of Distance Learning).
              Our vision was to combine modern architectural aesthetics with robust web engineering.
            </p>
            <div className="grid grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-accent">150+</h4>
                <p className="text-[10px] md:text-sm text-text-secondary uppercase tracking-wider font-semibold">Premium Rooms</p>
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-accent">24/7</h4>
                <p className="text-[10px] md:text-sm text-text-secondary uppercase tracking-wider font-semibold">Concierge Service</p>
              </div>
            </div>
            <Link to="/about">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">Learn More</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
