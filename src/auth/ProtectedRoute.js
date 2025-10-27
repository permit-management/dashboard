import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CSpinner } from '@coreui/react';

/**
 * ProtectedRoute component that checks authentication before rendering children
 * @param {React.ReactNode} children - The components to render if authenticated
 * @param {string} redirectTo - The path to redirect to if not authenticated (default: '/LoginForm')
 */
const ProtectedRoute = ({ children, redirectTo = '/LoginForm' }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <CSpinner color="primary" variant="grow" />
                <span className="ms-2">Checking authentication...</span>
            </div>
        );
    }

    // If not authenticated, redirect to login with the current location
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // If authenticated, render the protected content
    return children;
};

export default ProtectedRoute;