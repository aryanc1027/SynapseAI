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
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };
  return (
    <div className="bg-gradient-to-b from-[#c8ffc9] to-[#e8ffe9] min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-70 p-8 rounded-xl shadow-lg transition-all duration-300 w-full max-w-md">
        <h2 className="text-4xl font-bold text-[#2e7d32] mb-6 text-center">Create your account</h2>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-[#2e7d32] text-sm font-bold mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="border border-[#4caf50] rounded w-full py-2 px-3 text-[#2f9248] leading-tight focus:outline-none focus:border-[#2e7d32]"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[#2e7d32] text-sm font-bold mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="border border-[#4caf50] rounded w-full py-2 px-3 text-[#2f9248] leading-tight focus:outline-none focus:border-[#2e7d32]"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#2e7d32] text-sm font-bold mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="border border-[#4caf50] rounded w-full py-2 px-3 text-[#2f9248] leading-tight focus:outline-none focus:border-[#2e7d32]"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-[#4caf50] text-white px-6 py-2 rounded-full font-bold text-lg hover:bg-[#2f9248] transition duration-300 w-full"
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-center mt-8 text-sm text-[#2e7d32]">
          Already have an account?{' '}
          <a href="/login" className="text-[#4caf50] hover:text-[#2f9248] transition duration-300">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;