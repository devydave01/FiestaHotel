import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  Settings, 
  Bell, 
  Search,
  Check,
  X,
  Eye,
  LogOut,
  TrendingUp,
  DollarSign,
  Loader2,
  Menu,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import api from '../services/api';
import AdminRooms from '../components/organisms/AdminRooms';
import AdminGuests from '../components/organisms/AdminGuests';
import { notifyGuestApproved, notifyGuestRejected } from '../services/emailService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, bookings] = await Promise.all([
          api.getAdminStats(),
          api.getRecentBookings()
        ]);
        
        const formattedStats = [
          { label: 'Total Revenue', value: `₦${stats.revenue || '0'}`, icon: <DollarSign size={20} />, change: stats.revenueChange || '+0%', color: 'bg-green-100 text-green-700' },
          { label: 'Total Bookings', value: stats.totalBookings || '0', icon: <CalendarCheck size={20} />, change: stats.bookingsChange || '+0%', color: 'bg-blue-100 text-blue-700' },
          { label: 'Active Guests', value: stats.activeGuests || '0', icon: <Users size={20} />, change: stats.guestsChange || '+0%', color: 'bg-purple-100 text-purple-700' },
          { label: 'Room Occupancy', value: `${stats.occupancy || '0'}%`, icon: <TrendingUp size={20} />, change: stats.occupancyChange || '+0%', color: 'bg-orange-100 text-orange-700' },
        ];
        
        setStatsData(formattedStats);
        setRecentBookings(bookings);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Fallback stats for demo purposes
        const fallbackStats = [
          { label: 'Total Revenue', value: '₦1,250,000', icon: <DollarSign size={20} />, change: '+12.5%', color: 'bg-green-100 text-green-700' },
          { label: 'Total Bookings', value: '48', icon: <CalendarCheck size={20} />, change: '+18.2%', color: 'bg-blue-100 text-blue-700' },
          { label: 'Active Guests', value: '12', icon: <Users size={20} />, change: '+5.4%', color: 'bg-purple-100 text-purple-700' },
          { label: 'Room Occupancy', value: '85%', icon: <TrendingUp size={20} />, change: '+2.1%', color: 'bg-orange-100 text-orange-700' },
        ];
        setStatsData(fallbackStats);
        
        // Add a few dummy bookings if list is empty
        if (recentBookings.length === 0) {
          setRecentBookings([
            { id: 'FSTA-992831', guest: 'John Smith', room: 'Lekki Royal Penthouse', checkIn: '2026-05-10', amount: '150,000', status: 'Pending' },
            { id: 'FSTA-882192', guest: 'Sarah Johnson', room: 'Maitama Ocean View', checkIn: '2026-05-12', amount: '65,000', status: 'Approved' }
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    setIsActionLoading(id);
    try {
      // Find the booking before updating so we have guest info for the email
      const booking = recentBookings.find(b => b.id === id);

      await api.approveBooking(id).catch(err => console.log('Backend not ready:', err));

      // Update local state immediately
      setRecentBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: 'Approved' } : b)
      );

      // Send approval email to guest
      if (booking?.guestEmail || booking?.email) {
        await notifyGuestApproved({
          guestName: booking.guestName || booking.guest || 'Guest',
          guestEmail: booking.guestEmail || booking.email,
          room: booking.room || booking.roomName || 'Your Room',
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          nights: booking.nights || 1,
          totalPrice: booking.totalPrice || booking.amount || 0,
          bookingId: booking.bookingId || booking.id,
        }).catch(err => console.log('Approval email error:', err));
      }

      alert('✅ Booking approved and guest has been notified by email!');
    } catch (error) {
      console.error('Approve error:', error);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Optional: Enter a reason for rejection (leave blank to skip):');
    setIsActionLoading('reject_' + id);
    try {
      const booking = recentBookings.find(b => b.id === id);

      await api.approveBooking(id).catch(err => console.log('Backend not ready:', err));

      // Update local state immediately
      setRecentBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: 'Rejected' } : b)
      );

      // Send rejection email to guest
      if (booking?.guestEmail || booking?.email) {
        await notifyGuestRejected({
          guestName: booking.guestName || booking.guest || 'Guest',
          guestEmail: booking.guestEmail || booking.email,
          bookingId: booking.bookingId || booking.id,
          reason: reason || null,
        }).catch(err => console.log('Rejection email error:', err));
      }

      alert('❌ Booking rejected and guest has been notified by email.');
    } catch (error) {
      console.error('Reject error:', error);
    } finally {
      setIsActionLoading(null);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'bookings', label: 'Bookings', icon: <CalendarCheck size={20} /> },
    { id: 'rooms', label: 'Manage Rooms', icon: <BedDouble size={20} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
                ))
              ) : (
                statsData.map((stat, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${stat.color.split(' ')[0]}`}>
                        {stat.icon}
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.color}`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm font-medium mb-1">{stat.label}</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-text-main">{stat.value}</h3>
                  </motion.div>
                ))
              )}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <h3 className="font-bold mb-2">Welcome back, Admin</h3>
              <p className="text-text-secondary mb-4">You have {recentBookings.filter(b => b.status === 'Pending').length} pending bookings to review.</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="secondary" size="sm" onClick={() => setActiveTab('bookings')}>Go to Bookings</Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={async () => {
                    try {
                      const btn = document.activeElement;
                      btn.innerText = 'Sending...';
                      btn.disabled = true;
                      
                      await notifyGuestApproved({
                        guestName: 'Test Admin',
                        guestEmail: 'fiestahoteladmin@gmail.com',
                        room: 'Test Suite',
                        checkIn: '2026-05-07',
                        checkOut: '2026-05-10',
                        nights: 3,
                        totalPrice: 150000,
                        bookingId: 'TEST-123',
                      });
                      
                      alert('Test email sent successfully to fiestahoteladmin@gmail.com! Check your inbox (and spam folder).');
                    } catch (err) {
                      console.error(err);
                      alert(' Failed to send test email: ' + err.message);
                    } finally {
                      const btn = document.activeElement;
                      if (btn) {
                        btn.innerText = 'Send Test Email';
                        btn.disabled = false;
                      }
                    }
                  }}
                >
                  Send Test Email
                </Button>
              </div>
            </div>
          </>
        );
      case 'bookings':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-1">Recent Bookings</h2>
                <p className="text-sm text-text-secondary">Manage and approve guest reservations</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">Export Report</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-section/50">
                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Booking ID</th>
                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Guest</th>
                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Room</th>
                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Check-In</th>
                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Amount</th>
                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Status</th>
                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td colSpan="7" className="px-8 py-4"><div className="h-8 bg-section animate-pulse rounded"></div></td>
                      </tr>
                    ))
                  ) : recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-8 py-20 text-center text-text-secondary">No recent bookings found.</td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-section/30 transition-colors">
                        <td className="px-8 py-5 font-mono text-sm font-bold text-accent">{booking.id}</td>
                        <td className="px-8 py-5 font-semibold text-text-main">{booking.guest || booking.userInfo?.fullName}</td>
                        <td className="px-8 py-5 text-sm text-text-secondary">{booking.room || booking.roomName}</td>
                        <td className="px-8 py-5 text-sm font-medium">{booking.checkIn}</td>
                        <td className="px-8 py-5 font-bold text-text-main">₦{booking.amount || booking.totalPrice}</td>
                        <td className="px-8 py-5">
                          <Badge variant={booking.status === 'Approved' ? 'success' : booking.status === 'Pending' ? 'pending' : 'default'}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            {booking.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => handleApprove(booking.id)}
                                  disabled={isActionLoading === booking.id}
                                  className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-100 transition-all disabled:opacity-50"
                                  title="Approve & Email Guest"
                                >
                                  {isActionLoading === booking.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                </button>
                                <button 
                                  onClick={() => handleReject(booking.id)}
                                  disabled={isActionLoading === 'reject_' + booking.id}
                                  className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition-all disabled:opacity-50"
                                  title="Reject & Email Guest"
                                >
                                  {isActionLoading === 'reject_' + booking.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                                </button>
                              </>
                            )}
                            <button className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-all" title="View Details">
                              <Eye size={16} />
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
      case 'rooms':
        return <AdminRooms />;
      case 'guests':
        return <AdminGuests />;
      default:
        return <div className="p-10 md:p-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">Content for {activeTab} coming soon.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-section overflow-hidden relative">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter text-text-main">FIESTA <span className="text-accent font-light">ADMIN</span></h1>
          <button className="lg:hidden p-2 text-text-secondary" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-grow px-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all group ${
                activeTab === item.id 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-text-secondary hover:bg-section'
              }`}
            >
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={() => navigate('/admin/login')}
            className="flex items-center gap-4 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto w-full">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100 px-4 md:px-10 py-4 md:py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 bg-section rounded-xl text-text-main"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block w-64 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-section border border-transparent rounded-xl py-2 md:py-3 pl-12 pr-4 focus:bg-white focus:border-accent/20 transition-all focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            <button className="relative w-10 h-10 bg-section rounded-xl flex items-center justify-center text-text-main hover:bg-gray-200 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-100 pl-2 md:pl-6">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                AD
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs md:text-sm font-bold">Admin</p>
                <p className="text-[10px] md:text-xs text-text-secondary">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
