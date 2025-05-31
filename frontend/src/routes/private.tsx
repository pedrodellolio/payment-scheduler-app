import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/use-auth';

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
