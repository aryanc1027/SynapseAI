import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-[#4257B2] to-[#3498db] min-h-screen text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 text-[#FFD700]">Welcome to SynapseAI</h1>
          <p className="text-xl mb-8">Your AI-powered study companion for smarter learning</p>
          <Link 
            to="/dashboard" 
            className="bg-[#FF8C00] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#FFA500] transition duration-300 shadow-md"
          >
            Start Learning
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            title="Personalized Learning" 
            description="AI-tailored study plans adapted to your unique learning style."
            icon="🎯"
          />
          <FeatureCard 
            title="Interactive Flashcards" 
            description="Create and study dynamic flashcards with AI-generated content."
            icon="🃏"
          />
          <FeatureCard 
            title="Smart Quizzes" 
            description="Take adaptive quizzes that evolve with your knowledge level."
            icon="📊"
          />
        </div>
        
        <div className="text-center bg-white text-[#4257B2] py-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-4">Ready to ace your studies?</h2>
          <Link 
            to="/register" 
            className="bg-[#4257B2] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#3498db] transition duration-300 shadow-md inline-block"
          >
            Join SynapseAI Now
          </Link>
        </div>
      </div>
    </div>
  );
};
  const FeatureCard = ({ title, description, icon }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-[#4257B2] flex flex-col items-center text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  };
export default HomePage;