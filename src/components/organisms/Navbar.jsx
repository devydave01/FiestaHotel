import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav
      className={cn(
        ' fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg border-b border-gray-100' 
          : 'bg-white/80 backdrop-blur-md border-b border-white/20'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tight text-accent">
              FIESTA
            </span>
            
          </Link>
        </div>

        {/* Desktop Nav - Center */}
        <div className="hidden md:flex items-center justify-center space-x-10 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-semibold text-text-main hover:text-accent transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* CTA - Right */}
        <div className="hidden md:flex items-center justify-end flex-1">
          <Link
            to="/rooms"
            className="bg-accent text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-accent/90 transition-all transform hover:scale-105"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-text-main"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-6 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold py-4 border-b border-gray-50 flex items-center justify-between group"
                >
                  {link.name}
                  <ChevronRight size={18} className="text-accent opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
              <Link
                to="/booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-accent text-white px-6 py-3 rounded-2xl text-center font-semibold"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
