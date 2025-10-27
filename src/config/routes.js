// Route configuration with authentication requirements

export const publicRoutes = [
    '/LoginForm',
    '/RegisterForm',
    '/login',
    '/register',
    '/500',
    '/404'
];

export const protectedRoutes = [
    '/',
    '/dashboard',
    '/Users',
    '/Department',
    '/Role',
    '/Approval',
    '/TambahApproval',
    '/EditApproval',
    '/DetailApproval',
    '/Permit',
    '/DetailPermit',
    '/TambahUsers',
    '/TambahDepartment',
    '/TambahRole',
    '/EditDepartment',
    '/DetailDepartment',
    '/EditRole',
    '/DetailRole',
    '/EditUsers',
    '/DetailUsers',
    '/WellcomeForm',
    '/Contractor',
    '/notifications'
];

/**
 * Check if a route requires authentication
 * @param {string} pathname - The route pathname
 * @returns {boolean} True if route requires authentication
 */
export const isProtectedRoute = (pathname) => {
    // Check exact matches first
    if (publicRoutes.includes(pathname)) {
        return false;
    }

    if (protectedRoutes.includes(pathname)) {
        return true;
    }

    // Check for dynamic routes (with parameters)
    const isDynamicProtectedRoute = protectedRoutes.some(route => {
        if (route.includes(':')) {
            const routePattern = route.replace(/:[\w]+/g, '[^/]+');
            const regex = new RegExp(`^${routePattern}$`);
            return regex.test(pathname);
        }
        return false;
    });

    if (isDynamicProtectedRoute) {
        return true;
    }

    // Default: protect all routes that aren't explicitly public
    return !publicRoutes.some(route => pathname.startsWith(route));
};

/**
 * Check if a route is public (doesn't require authentication)
 * @param {string} pathname - The route pathname
 * @returns {boolean} True if route is public
 */
export const isPublicRoute = (pathname) => {
    return !isProtectedRoute(pathname);
};

export default {
    publicRoutes,
    protectedRoutes,
    isProtectedRoute,
    isPublicRoute,
};