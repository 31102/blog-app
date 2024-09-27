import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/public/authentication/LoginPage';
import SignUpPage from '../pages/public/authentication/SignUpPage';
import BlogLayout from '../pages/BlogLayout';
import HomePage from '../pages/public/HomePage';
import Profile from '../pages/protected/Profile';
import NoPageFound from '../pages/public/404page/NoPageFound';
import ProtectedRoute from './ProtectedRoute'; // Import your ProtectedRoute component

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<BlogLayout />}>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} /> 
          <Route path="*" element={<NoPageFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
