import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getToken, getUser, logout, isTokenExpired } from '../utils/auth';

// Initial state
const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
};

// Action types
const ActionTypes = {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    LOADING: 'LOADING',
    CHECK_AUTH: 'CHECK_AUTH',
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
            };
        case ActionTypes.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
            };
        case ActionTypes.LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case ActionTypes.CHECK_AUTH:
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
            };
        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = () => {
            dispatch({ type: ActionTypes.LOADING, payload: true });

            const token = getToken();
            const user = getUser();

            if (token && !isTokenExpired()) {
                dispatch({
                    type: ActionTypes.CHECK_AUTH,
                    payload: {
                        isAuthenticated: true,
                        user,
                        token,
                    },
                });
            } else {
                // Token is expired or doesn't exist
                if (token) {
                    logout(); // Clean up localStorage
                }
                dispatch({
                    type: ActionTypes.CHECK_AUTH,
                    payload: {
                        isAuthenticated: false,
                        user: null,
                        token: null,
                    },
                });
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = (token, user) => {
        dispatch({
            type: ActionTypes.LOGIN_SUCCESS,
            payload: { token, user },
        });
    };

    // Logout function
    const logoutUser = () => {
        logout(); // Clear localStorage
        dispatch({ type: ActionTypes.LOGOUT });
    };

    // Set loading state
    const setLoading = (loading) => {
        dispatch({ type: ActionTypes.LOADING, payload: loading });
    };

    const value = {
        ...state,
        login,
        logout: logoutUser,
        setLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;