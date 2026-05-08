import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Wifi, Bath } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';

const RoomCard = ({ room }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-accent/30 transition-all group shadow-sm hover:shadow-md"
    >
      <Link to={`/rooms/${room.id}`} className="block">
        <div className="relative h-[300px] md:h-[350px] overflow-hidden">
          <img 
            src={room.image} 
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-6 left-6">
            <Badge>{room.type}</Badge>
          </div>
          <div className="absolute bottom-6 left-6">
            <span className="bg-accent text-white text-xl font-bold px-5 py-2 rounded-xl">
              ₦{room.price} <span className="text-sm font-normal text-white/80">/ night</span>
            </span>
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-1 group-hover:text-accent transition-colors">{room.name}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-6 pt-6 border-t border-gray-50 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-section flex items-center justify-center text-accent">
                <Users size={16} />
              </div>
              <span className="text-sm font-medium">{room.beds} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-section flex items-center justify-center text-accent">
                <Bath size={16} />
              </div>
              <span className="text-sm font-medium">{room.baths} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-section flex items-center justify-center text-accent">
                <Wifi size={16} />
              </div>
              <span className="text-sm font-medium">Free Wi-Fi</span>
            </div>
          </div>

          <Button className="w-full" size="md">
            Reserve Room
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};

export default RoomCard;
