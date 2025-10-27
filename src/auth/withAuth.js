import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

/**
 * Higher-order component to wrap routes with authentication protection
 * @param {React.Component} WrappedComponent - The component to wrap
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - Whether authentication is required (default: true)
 * @param {string} options.redirectTo - Where to redirect unauthenticated users
 */
export const withAuth = (WrappedComponent, options = {}) => {
    const { requireAuth = true, redirectTo } = options;

    const AuthenticatedComponent = (props) => {
        if (requireAuth) {
            return (
                <ProtectedRoute redirectTo={redirectTo}>
                    <WrappedComponent {...props} />
                </ProtectedRoute>
            );
        } else {
            return (
                <PublicRoute redirectTo={redirectTo}>
                    <WrappedComponent {...props} />
                </PublicRoute>
            );
        }
    };

    // Set display name for debugging
    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

    return AuthenticatedComponent;
};

/**
 * HOC for components that require authentication
 */
export const withAuthRequired = (WrappedComponent, redirectTo) =>
    withAuth(WrappedComponent, { requireAuth: true, redirectTo });

/**
 * HOC for public components (login, register) that should redirect authenticated users
 */
export const withPublicOnly = (WrappedComponent, redirectTo) =>
    withAuth(WrappedComponent, { requireAuth: false, redirectTo });

export default withAuth;