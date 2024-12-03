import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};