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
      console.log(data);
      const { access_token } = data;
  
     
      localStorage.setItem('authToken', access_token);
  
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };  

  return (
    <div className="bg-[#0a1a2a] min-h-screen flex items-center justify-center">
      <div className="bg-[#1a2a3a] p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#00fff5] mb-6 text-center">Login to SynapseAI</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#a0a7b7] text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="bg-[#2a3a4a] appearance-none border border-[#4a5d7e] rounded w-full py-2 px-3 text-[#e0e7ff] leading-tight focus:outline-none focus:border-[#00fff5]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-[#a0a7b7] text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="bg-[#2a3a4a] appearance-none border border-[#4a5d7e] rounded w-full py-2 px-3 text-[#e0e7ff] mb-3 leading-tight focus:outline-none focus:border-[#00fff5]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#00fff5] hover:bg-[#00cccc] text-[#0a1a2a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center mt-8 text-sm text-[#a0a7b7]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00fff5] hover:text-white transition duration-300">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
