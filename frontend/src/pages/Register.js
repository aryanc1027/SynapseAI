import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Register = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(userData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1a2a] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
      
      </div>
  
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1a2a3a] py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#00fff5] padding 10px">
          Create your account
        </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#a0a7b7]">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-[#4a5d7e] rounded-md shadow-sm placeholder-[#6a7a8a] bg-[#2a3a4a] text-[#e0e7ff] focus:outline-none focus:ring-[#00fff5] focus:border-[#00fff5] sm:text-sm"
                  value={userData.username}
                  onChange={(e) => setUserData({...userData, username: e.target.value})}
                  placeholder="Enter your username"
                />
              </div>
            </div>
  
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a0a7b7]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-[#4a5d7e] rounded-md shadow-sm placeholder-[#6a7a8a] bg-[#2a3a4a] text-[#e0e7ff] focus:outline-none focus:ring-[#00fff5] focus:border-[#00fff5] sm:text-sm"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>
            </div>
  
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a0a7b7]">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-[#4a5d7e] rounded-md shadow-sm placeholder-[#6a7a8a] bg-[#2a3a4a] text-[#e0e7ff] focus:outline-none focus:ring-[#00fff5] focus:border-[#00fff5] sm:text-sm"
                  value={userData.password}
                  onChange={(e) => setUserData({...userData, password: e.target.value})}
                  placeholder="Enter your password"
                />
              </div>
            </div>
  
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#0a1a2a] bg-[#00fff5] hover:bg-[#00cccc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00fff5] transition duration-300"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;