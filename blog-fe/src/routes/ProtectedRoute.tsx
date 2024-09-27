import React from 'react';
import {  Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  element: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null; // Optionally, you can show a loading spinner here
  }

  const { isAuthenticated, isLoading } = authContext;

  // If the auth state is loading, return null or a loading spinner
  if (isLoading) {
    return null; // Or <LoadingSpinner />
  }

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
