import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

// Component to protect routes based on user role
const ProtectedRoute = ({ children, requiredRole }) => {
    const { auth, userRole } = useAuth();

    // If the user is not authenticated
    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    // If a required role is specified and it doesn't match the user's role
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

