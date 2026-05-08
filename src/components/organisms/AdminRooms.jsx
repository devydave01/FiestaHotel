import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import api from '../../services/api';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await api.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    
    setIsActionLoading(id);
    try {
      await api.deleteRoom(id);
      setRooms(rooms.filter(room => room.id !== id));
    } catch (error) {
      alert('Failed to delete room: ' + error.message);
    } finally {
      setIsActionLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">Manage Rooms</h2>
          <p className="text-sm text-text-secondary">Add, edit, or remove hotel rooms</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus size={18} className="mr-2" />
          Add New Room
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="bg-section/50">
              <th className="px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Room</th>
              <th className="px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Type</th>
              <th className="px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Price</th>
              <th className="px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <tr key={i}>
                  <td colSpan="5" className="px-8 py-8"><div className="h-12 bg-section animate-pulse rounded-xl"></div></td>
                </tr>
              ))
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center text-text-secondary">No rooms found. Add your first room!</td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="hover:bg-section/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {room.image ? (
                          <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-text-main">{room.name}</p>
                        <p className="text-xs text-text-secondary">ID: {room.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <Badge variant="default">{room.type || 'Standard'}</Badge>
                  </td>
                  <td className="px-8 py-5 font-bold text-text-main">₦{room.price}</td>
                  <td className="px-8 py-5">
                    <Badge variant={room.status === 'Available' ? 'success' : 'pending'}>
                      {room.status || 'Available'}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-all" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(room.id)}
                        disabled={isActionLoading === room.id}
                        className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition-all disabled:opacity-50" 
                        title="Delete"
                      >
                        {isActionLoading === room.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
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

export default AdminRooms;
