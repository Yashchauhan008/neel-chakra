// src/components/LandingPage.js

import React from 'react';
import { motion } from 'framer-motion';
import { Map, Camera, HeartHandshake, Sprout, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Animation variants for Framer Motion
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};// Reusable Feature Card Component
const FeatureCard = ({ icon, title, children }) => (
  <motion.div variants={fadeIn} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/10 text-center">
    <div className="flex justify-center mb-4">
      <div className="bg-teal-500/20 p-3 rounded-full">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{children}</p>
  </motion.div>
);

// Main Landing Page Component
export default function LandingPage() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/map");
  };

  return (
    <div className="bg-gray-900 text-white font-sans">
      {/* --- Header --- */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Sprout className="w-7 h-7 mr-2 text-teal-400" />
            Neel Chakra
          </h1>
          <nav>
            <a href="#features" className="mx-2 hover:text-teal-400 transition-colors">Features</a>
            <a href="#how-it-works" className="mx-2 hover:text-teal-400 transition-colors">How It Works</a>
            <button className="ml-4 bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105">
              Launch App <ArrowRight className="inline w-4 h-4 ml-1" />
            </button>
          </nav>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative h-screen flex items-center justify-center text-center overflow-hidden"
      >
        {/* Background Image/Video Placeholder */}
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590622329589-42637963534f?q=80&w=2070&auto=format&fit=crop' )", filter: 'brightness(0.4)' }}></div>
        
        <div className="relative z-10 p-4">
          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-7xl font-extrabold mb-4 text-shadow-lg"
          >
            Protect Our Blue Carbon Sinks
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200 mb-8"
          >
            A community-powered platform using satellite data to monitor, report, and restore vital mangrove ecosystems across the globe.
          </motion.p>
          <motion.button
            onClick={handleNavigate}
            variants={fadeIn}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-110 shadow-lg"
          >
            Start Exploring
          </motion.button>
        </div>
      </motion.section>

      {/* --- Features Section --- */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
            <motion.h2 variants={fadeIn} className="text-4xl font-bold text-center mb-12">
              Key Features
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard icon={<Map size={32} className="text-teal-300" />} title="Live Monitoring">
                Visualize mangrove health on an interactive map powered by real-time Sentinel-2 satellite data.
              </FeatureCard>
              <FeatureCard icon={<Camera size={32} className="text-teal-300" />} title="Community Reporting">
                Empower local communities to report degradation by uploading photos and GPS data directly from the field.
              </FeatureCard>
              <FeatureCard icon={<HeartHandshake size={32} className="text-teal-300" />} title="Adopt & Restore">
                Sponsor the restoration of a degraded patch and receive a digital certificate for your climate contribution.
              </FeatureCard>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
            <motion.h2 variants={fadeIn} className="text-4xl font-bold text-center mb-16">
              How It Works
            </motion.h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 h-full w-0.5 bg-teal-500/30 -translate-x-1/2"></div>
              
              {/* Step 1 */}
              <motion.div variants={fadeIn} className="flex items-center mb-16">
                <div className="w-1/2 pr-8 text-right">
                  <h3 className="text-2xl font-bold text-teal-400">1. Explore the Map</h3>
                  <p className="text-gray-400">Browse mangrove forests and identify areas that are healthy, degraded, or under restoration.</p>
                </div>
                <div className="w-1/2 pl-8"></div>
              </motion.div>

              {/* Step 2 */}
              <motion.div variants={fadeIn} className="flex items-center mb-16">
                <div className="w-1/2 pr-8"></div>
                <div className="w-1/2 pl-8 text-left">
                  <h3 className="text-2xl font-bold text-teal-400">2. Take Action</h3>
                  <p className="text-gray-400">Report damage you witness on the ground, or choose a degraded patch to adopt and fund its recovery.</p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div variants={fadeIn} className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <h3 className="text-2xl font-bold text-teal-400">3. Track the Impact</h3>
                  <p className="text-gray-400">Watch your adopted patch recover over time with updated satellite imagery and see your contribution grow.</p>
                </div>
                <div className="w-1/2 pl-8"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Community CTA Section --- */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeIn}>
            <Users size={48} className="mx-auto text-teal-400 mb-4" />
            <h2 className="text-4xl font-bold mb-4">Join a Global Community of Guardians</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Become part of a movement. Earn badges for your reports, climb the leaderboards, and connect with others passionate about conservation.
            </p>
            <button className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-110 hover:bg-teal-300">
              Sign Up and Make a Difference
            </button>
          </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} MangroveWatch. An Open-Source Project.</p>
          <p className="mt-2">Protecting Blue Carbon for a Healthier Planet.</p>
        </div>
      </footer>
    </div>
  );
}
