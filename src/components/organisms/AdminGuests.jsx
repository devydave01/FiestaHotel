import React, { useState, useEffect } from 'react';
import { Mail, Phone, Loader2, User } from 'lucide-react';
import api from '../../services/api';

const AdminGuests = () => {
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await api.getGuests();
        setGuests(data);
      } catch (error) {
        console.error('Failed to fetch guests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuests();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Guest Management</h2>
        <p className="text-sm text-text-secondary">View and manage your hotel guests</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="bg-section/50">
              <th className="px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Guest Name</th>
              <th className="px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Contact Information</th>
              <th className="px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Total Bookings</th>
              <th className="px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <tr key={i}>
                  <td colSpan="4" className="px-8 py-8"><div className="h-12 bg-section animate-pulse rounded-xl"></div></td>
                </tr>
              ))
            ) : guests.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center text-text-secondary">No guests found.</td>
              </tr>
            ) : (
              guests.map((guest, idx) => (
                <tr key={guest.id || idx} className="hover:bg-section/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <User size={20} />
                      </div>
                      <span className="font-bold text-text-main">{guest.fullName || guest.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Mail size={14} className="text-accent" />
                        {guest.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Phone size={14} className="text-accent" />
                        {guest.phone || 'No phone'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-medium">{guest.totalBookings || 0} Bookings</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-accent hover:underline text-sm font-bold">View History</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGuests;
