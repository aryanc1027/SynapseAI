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
      setError('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        value={userData.username} // Update here
        onChange={(e) => setUserData({...userData, username: e.target.value})} // Update here
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={userData.email}
        onChange={(e) => setUserData({...userData, email: e.target.value})}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={userData.password}
        onChange={(e) => setUserData({...userData, password: e.target.value})}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;