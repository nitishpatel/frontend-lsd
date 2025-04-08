import useAuthStore from '../../store/useAuthStore';
import { Navigate } from 'react-router-dom';

/**
 * A route that redirects to the login page if the user is not authenticated.
 *
 * If the user is authenticated, the children component is rendered.
 *
 * @param children The component to render if the user is authenticated.
 * @returns A component that conditionally renders the children component or redirects to the login page.
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoggedIn } = useAuthStore();
  if (isLoggedIn === undefined) {
    return <Navigate to="/login" />;
  }
  if (!user && isLoggedIn === false) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};

/**
 * A route that redirects to the home page if the user is authenticated.
 *
 * If the user is not authenticated, the children component is rendered.
 *
 * @param children The component to render if the user is not authenticated.
 * @returns A component that conditionally renders the children component or redirects to the home page.
 */
export const UnProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoggedIn } = useAuthStore();

  if (user && isLoggedIn === true) {
    // user is  authenticated
    return <Navigate to="/admin" />;
  }
  return children;
};
