import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center pt-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1551882547-ff43c61f3c33?auto=format&fit=crop&q=80&w=2000" 
            alt="About Hero" 
            className="w-full h-full object-cover scale-110 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            Our Story
          </motion.h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            A premium hotel booking platform developed by Group 1 at BUCODEL.
          </p>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">School Project 2026</span>
            <h2 className="text-5xl font-bold mb-8 leading-tight">Group 1 BUCODEL Project</h2>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              Fiesta was developed as a flagship project for the Babcock University Center of Distance Learning (BUCODEL). 
              Our team focused on creating a seamless, high-performance booking experience that adheres to modern web standards and "Liquid Minimalism" design principles.
            </p>
            <p className="text-lg text-text-secondary mb-10 leading-relaxed">
              This project demonstrates our commitment to excellence in frontend architecture, state management, and user experience design.
            </p>
            <div className="flex gap-12">
              <div>
                <p className="text-4xl font-bold text-accent mb-1">Group 1</p>
                <p className="text-xs uppercase tracking-widest font-bold text-text-secondary">Project Team</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent mb-1">100%</p>
                <p className="text-xs uppercase tracking-widest font-bold text-text-secondary">Commitment</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-gray-100 rotate-3 hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1000" 
                alt="Architecture" 
                className="w-full h-[600px] object-cover"
              />
            </div>
            {/* Overlay Glass Card */}
            <div className="absolute -bottom-10 -left-10 glass p-8 rounded-xl border-white/40 max-w-xs hidden md:block">
              <p className="italic text-text-main font-medium">
                "Luxury is not about having many things, it's about having the right things."
              </p>
              <p className="text-xs text-text-secondary mt-4 font-bold uppercase tracking-widest">— Julian V., Lead Architect</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-section py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Fiesta Experience</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Beyond just a room, we offer a curated lifestyle for the discerning traveler.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ExperienceCard 
              image="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600"
              title="Zen Wellness"
              desc="Full-service spa and meditation rooms designed for ultimate recovery."
            />
            <ExperienceCard 
              image="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600"
              title="Mixology Bar"
              desc="Artisanal cocktails inspired by local botanicals and premium spirits."
            />
            <ExperienceCard 
              image="https://images.unsplash.com/photo-1574936145840-28808d77a0b6?auto=format&fit=crop&q=80&w=600"
              title="Infinity Pool"
              desc="Seamless views of the horizon in our temperature-controlled pool."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const ExperienceCard = ({ image, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white rounded-xl overflow-hidden border border-gray-100 group"
  >
    <div className="h-64 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    </div>
    <div className="p-8">
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

export default About;
