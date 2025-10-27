import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { isTokenExpired } from '../utils/auth';

/**
 * AuthGuard component that acts as middleware to check authentication
 * Can be used to wrap components that need authentication checks
 */
const AuthGuard = ({ children, requireAuth = true, redirectTo = '/LoginForm' }) => {
    const { isAuthenticated, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Don't check if still loading
        if (loading) return;

        if (requireAuth) {
            // Check if user should be authenticated
            if (!isAuthenticated || isTokenExpired()) {
                // If token is expired, logout user
                if (isTokenExpired()) {
                    logout();
                }

                // Redirect to login with current location
                navigate(redirectTo, {
                    replace: true,
                    state: { from: location }
                });
            }
        } else {
            // For public routes, redirect authenticated users
            if (isAuthenticated) {
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            }
        }
    }, [isAuthenticated, requireAuth, loading, navigate, location, logout, redirectTo]);

    // Show loading or nothing while checking
    if (loading) {
        return null;
    }

    // Render children based on authentication requirements
    if (requireAuth && !isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    if (!requireAuth && isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    return children;
};

export default AuthGuard;