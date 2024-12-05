import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/index';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
  
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: email,  
          password: password,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.detail || 'Invalid email or password'}`);
      }
  
      const data = await response.json();
      const { access_token } = data;
  
     
      localStorage.setItem('authToken', access_token);
  
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };  

  return (
    <div className="bg-gradient-to-b from-[#c8ffc9] to-[#e8ffe9] min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-70 p-8 rounded-xl shadow-lg transition-all duration-300 w-full max-w-md">
        <h2 className="text-4xl font-bold text-[#2e7d32] mb-6 text-center">Login to SynapseAI</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#2e7d32] text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="border border-[#4caf50] rounded w-full py-2 px-3 text-[#2f9248] leading-tight focus:outline-none focus:border-[#2e7d32]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-[#2e7d32] text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="border border-[#4caf50] rounded w-full py-2 px-3 text-[#2f9248] leading-tight focus:outline-none focus:border-[#2e7d32]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#4caf50] text-white px-6 py-2 rounded-full font-bold text-lg hover:bg-[#2f9248] transition duration-300 w-full"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center mt-8 text-sm text-[#2e7d32]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#4caf50] hover:text-[#2f9248] transition duration-300">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;