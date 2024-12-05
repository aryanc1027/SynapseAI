import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBrain, FaRoute, FaChartLine } from 'react-icons/fa';

const HomePage = () => {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      setUserIsLoggedIn(!token);  
    };

    checkAuthStatus();
  }, []);

  return (
    <div className="bg-[#0a260c] min-h-screen text-white overflow-hidden">
      <div className="absolute inset-0 bg-[#217e38] opacity-5">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-grid-8"></div>
      </div>
      
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <h1 className="text-3xl font-bold text-[#aff195]">SynapseAI</h1>
        <Link 
          to={userIsLoggedIn ? "/dashboard" : "/register"}
          className="bg-[#59a742] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#aff195] hover:text-[#0a260c] transition duration-300"
        >
          {userIsLoggedIn ? "Dashboard" : "Sign Up"}
        </Link>
      </nav>

      <main className="container mx-auto px-6 pt-20 pb-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#59a742] to-[#aff195]">
              AI-Powered Learning
            </span>
            <br />
            <span className="text-white">for the Digital Age</span>
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-[#aff195]">
            Revolutionize your study habits with SynapseAI's cutting-edge AI technology.
          </p>
          <Link 
            to={userIsLoggedIn ? "/dashboard" : "/register"}
            className="bg-gradient-to-r from-[#217e38] to-[#59a742] text-white px-10 py-4 rounded-full font-bold text-lg hover:from-[#59a742] hover:to-[#aff195] hover:text-[#0a260c] transition duration-300 shadow-lg inline-flex items-center"
          >
            <span>{userIsLoggedIn ? "Go to Dashboard" : "Start Learning Now"}</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard 
            title="AI-Powered Flashcards" 
            description="Generate intelligent flashcards that evolve with your knowledge."
            icon={<FaBrain className="w-12 h-12" />}
          />
          <FeatureCard 
            title="Personalized Study Plans" 
            description="Get tailored learning paths crafted by our advanced AI."
            icon={<FaRoute className="w-12 h-12" />}
          />
          <FeatureCard 
            title="Progress Tracking" 
            description="Visualize your learning journey with detailed analytics."
            icon={<FaChartLine className="w-12 h-12" />}
          />
        </div>
        
        {!userIsLoggedIn && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-br from-[#206027] to-[#59a742] p-12 rounded-3xl shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-6 text-center text-white">Ready to transform your learning experience?</h2>
            <div className="flex justify-center">
              <Link 
                to="/register" 
                className="bg-white text-[#0a260c] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#aff195] transition duration-300 shadow-md inline-block"
              >
                Join SynapseAI Today
              </Link>
            </div>
          </motion.div>
        )}
      </main>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a260c] to-transparent"></div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-[#206027] bg-opacity-50 p-8 rounded-xl backdrop-filter backdrop-blur-lg transition-all duration-300 flex flex-col items-center text-center group"
    >
      <div className="text-[#aff195] mb-6 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-[#aff195] group-hover:text-white transition-colors duration-300">{title}</h3>
      <p className="text-[#59a742] group-hover:text-[#aff195] transition-colors duration-300">{description}</p>
    </motion.div>
  );
};

export default HomePage;