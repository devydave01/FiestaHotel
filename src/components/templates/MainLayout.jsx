import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../organisms/Navbar';
import { motion } from 'framer-motion';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="bg-section py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">FIESTA</h2>
            <p className="text-text-secondary max-w-xs">
              A premium school project by Group 1 at BUCODEL. Experience luxury and comfort through modern web engineering.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-text-secondary">
              <li><Link to="/" className="hover:text-accent">Home</Link></li>
              <li><Link to="/rooms" className="hover:text-accent">Rooms</Link></li>
              <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-text-secondary">
              <li>hello@fiesta.com.ng</li>
              <li>+234 901 234 5678</li>
              <li>Plot 15, Adetokunbo Ademola St, Victoria Island, Lagos</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-200 mt-12 pt-8 text-center text-sm text-text-secondary">
          © 2026 Fiesta Hotel. Developed by Group 1 BUCODEL. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
