import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-purple-100 min-h-screen text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-indigo-800">Welcome to SynapseAI</h1>
          <p className="text-xl mb-8 text-gray-600">Your AI-powered study companion for smarter learning</p>
          <Link 
            to="/dashboard" 
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Get Started
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            title="Personalized Learning" 
            description="AI-tailored study plans and materials adapted to your unique learning style."
          />
          <FeatureCard 
            title="Interactive Flashcards" 
            description="Create and study dynamic flashcards with AI-generated content and explanations."
          />
          <FeatureCard 
            title="Smart Quizzes" 
            description="Take AI-generated quizzes that adapt to your knowledge level and learning progress."
          />
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4 text-indigo-800">Ready to revolutionize your study habits?</h2>
          <Link 
            to="/register" 
            className="bg-transparent border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-600 hover:text-white transition duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2 text-indigo-700">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HomePage;