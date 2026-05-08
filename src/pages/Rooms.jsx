import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { rooms as initialRooms } from '../utils/dummyData';
import api from '../services/api';
import useStore from '../store/useStore';
import RoomCard from '../components/molecules/RoomCard';
import Button from '../components/atoms/Button';

const Rooms = () => {
  const { bookingDetails } = useStore();
  const [rooms, setRooms] = useState(initialRooms);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await api.getRooms();
        setRooms(data);
      } catch (error) {
        console.error('Failed to fetch rooms, using dummy data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);
  
  return (
    <div className="pt-24 md:pt-32 pb-24 px-4 md:px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-12">
          <div className="bg-section p-4 md:p-5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar w-full sm:w-auto">
              <div className="flex flex-col flex-shrink-0">
                <span className="text-[10px] uppercase font-bold text-text-secondary mb-1 tracking-wider">Check-in</span>
                <span className="font-bold text-xs md:text-sm">{bookingDetails.checkIn || 'Add Date'}</span>
              </div>
              <div className="flex flex-col flex-shrink-0">
                <span className="text-[10px] uppercase font-bold text-text-secondary mb-1 tracking-wider">Check-out</span>
                <span className="font-bold text-xs md:text-sm">{bookingDetails.checkOut || 'Add Date'}</span>
              </div>
              <div className="flex flex-col flex-shrink-0">
                <span className="text-[10px] uppercase font-bold text-text-secondary mb-1 tracking-wider">Guests</span>
                <span className="font-bold text-xs md:text-sm">{bookingDetails.guests} Guest(s)</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">Change Search</Button>
          </div>
        </div>

        <div className="mb-12 md:mb-16 text-center px-2">
          <span className="text-accent font-bold tracking-widest uppercase text-[10px] md:text-sm">Our Collection</span>
          <h1 className="text-3xl md:text-5xl font-bold mt-4 leading-tight">Premium Rooms & Suites</h1>
          <p className="text-sm md:text-base text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
            Choose from our curated selection of high-end rooms across Nigeria's most prestigious locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {isLoading ? (
            <div className="col-span-full py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-text-secondary">Loading premium rooms...</p>
            </div>
          ) : (
            rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
