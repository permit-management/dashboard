import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CSpinner } from '@coreui/react';

/**
 * PublicRoute component for pages that should only be accessible to non-authenticated users
 * (like login, register pages). Redirects authenticated users to dashboard.
 * @param {React.ReactNode} children - The components to render if not authenticated
 * @param {string} redirectTo - The path to redirect to if authenticated (default: '/dashboard')
 */
const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <CSpinner color="primary" variant="grow" />
                <span className="ms-2">Loading...</span>
            </div>
        );
    }

    // If authenticated, redirect to dashboard or the intended location
    if (isAuthenticated) {
        // Check if there's a stored location from where user was redirected
        const from = location.state?.from?.pathname || redirectTo;
        return <Navigate to={from} replace />;
    }

    // If not authenticated, render the public content (login/register)
    return children;
};

export default PublicRoute;