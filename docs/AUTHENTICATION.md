# Authentication Guard & Middleware Documentation

This document explains the authentication system implemented in the dashboard application, including guards, middleware, and context management.

## Overview

The authentication system provides:

- **Token-based authentication** using localStorage
- **Automatic route protection** for authenticated and public routes
- **Context-based state management** for authentication state
- **Automatic token expiration handling**
- **API request authentication** with automatic token injection
- **Logout functionality** with proper cleanup

## Components

### 1. AuthContext (`src/contexts/AuthContext.js`)

The main authentication context that manages:
- User authentication state
- Token management
- Login/logout functionality
- Loading states

```javascript
import { useAuth } from '../contexts/AuthContext';

const { isAuthenticated, user, login, logout, loading } = useAuth();
```

### 2. ProtectedRoute (`src/components/ProtectedRoute.js`)

Component that protects routes requiring authentication:

```javascript
<ProtectedRoute redirectTo="/LoginForm">
  <Dashboard />
</ProtectedRoute>
```

### 3. PublicRoute (`src/components/PublicRoute.js`)

Component for public routes that redirects authenticated users:

```javascript
<PublicRoute redirectTo="/dashboard">
  <LoginForm />
</PublicRoute>
```

### 4. AuthGuard (`src/components/AuthGuard.js`)

Middleware component for more granular authentication control:

```javascript
<AuthGuard requireAuth={true} redirectTo="/LoginForm">
  <SomeComponent />
</AuthGuard>
```

### 5. Higher-Order Components (`src/hoc/withAuth.js`)

HOCs for wrapping components with authentication:

```javascript
import { withAuthRequired, withPublicOnly } from '../hoc/withAuth';

// Require authentication
const ProtectedComponent = withAuthRequired(MyComponent);

// Public only (redirect if authenticated)
const PublicComponent = withPublicOnly(LoginComponent);
```

## Utilities

### Authentication Utilities (`src/utils/auth.js`)

Helper functions for token and user management:

```javascript
import { 
  getToken, 
  setToken, 
  getUser, 
  setUser, 
  logout, 
  isAuthenticated,
  isTokenExpired,
  getAuthHeaders 
} from '../utils/auth';
```

### Axios Instance (`src/api/axiosInstance.js`)

Pre-configured axios instance with:
- Automatic token injection
- Token expiration handling
- Authentication error handling

```javascript
import axiosInstance from '../api/axiosInstance';

// Automatically includes Authorization header
const response = await axiosInstance.get('/users');
```

### API Hooks (`src/hooks/useApi.js`)

Custom hooks for authenticated API calls:

```javascript
import { useGet, usePost, usePut, useDelete } from '../hooks/useApi';

// GET request
const { response, error, loading } = useGet('/api/users');

// POST request
const { execute: createUser } = usePost('/api/users');
await createUser({ name: 'John', email: 'john@example.com' });
```

## Usage Examples

### 1. Setting up the App with Authentication

```javascript
// App.js
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}
```

### 2. Using Authentication in Components

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 3. Making Authenticated API Calls

```javascript
import { useGet } from '../hooks/useApi';

function UserProfile() {
  const { response: user, loading, error } = useGet('/api/user/profile');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Hello, {user?.name}</div>;
}
```

### 4. Login Implementation

```javascript
import { useAuth } from '../contexts/AuthContext';
import { setToken, setUser } from '../utils/auth';

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store in localStorage
        setToken(data.token);
        setUser(data.user);

        // Update context
        login(data.token, data.user);

        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
}
```

## Route Configuration

Routes are automatically protected based on the configuration in `src/config/routes.js`:

```javascript
// Public routes (no authentication required)
export const publicRoutes = [
  '/LoginForm',
  '/RegisterForm',
  '/500'
];

// Protected routes (authentication required)
export const protectedRoutes = [
  '/dashboard',
  '/users',
  '/admin/*'
];
```

## Security Features

1. **Token Expiration**: Automatically checks JWT token expiration
2. **Auto Logout**: Logs out users when tokens expire
3. **API Error Handling**: Handles 401/403 responses automatically
4. **Route Protection**: Prevents access to protected routes without authentication
5. **Redirect Handling**: Remembers intended destination after login

## Error Handling

The system handles various authentication errors:

- **Expired tokens**: Automatic logout and redirect to login
- **API authentication errors**: Automatic logout on 401/403 responses
- **Invalid tokens**: Cleared from localStorage
- **Network errors**: Proper error messaging

## Best Practices

1. **Always use the AuthContext** for authentication state
2. **Use ProtectedRoute/PublicRoute** for route-level protection
3. **Use custom API hooks** for authenticated requests
4. **Handle loading states** appropriately
5. **Provide user feedback** for authentication actions
6. **Clear sensitive data** on logout

## Testing Authentication

To test the authentication system:

1. **Login with valid credentials** - should store token and redirect
2. **Access protected routes without login** - should redirect to login
3. **Logout** - should clear data and redirect to login
4. **Token expiration** - should automatically logout
5. **API calls** - should include authentication headers
6. **Refresh page** - should maintain authentication state

## Troubleshooting

Common issues and solutions:

1. **"useAuth must be used within AuthProvider"** - Wrap your app with AuthProvider
2. **Infinite redirects** - Check route configuration and authentication logic
3. **Token not included in API calls** - Use the configured axios instance
4. **Authentication state not persisting** - Check localStorage functionality
5. **Routes not protected** - Ensure routes are wrapped with ProtectedRoute