import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/use-auth";
import Navbar from "../components/nav-bar";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
