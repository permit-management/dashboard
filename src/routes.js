import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

// Custom Pages
const LoginForm = React.lazy(() => import('./pages/LoginForm'))
const RegisterForm = React.lazy(() => import('./pages/RegisterForm'))
const Users = React.lazy(() => import('./pages/Users/Users'))
const Department = React.lazy(() => import('./pages/Department/Department'))
const Role = React.lazy(() => import('./pages/Role/Role'))
const Approval = React.lazy(() => import('./pages/Approval'))
const Permit = React.lazy(() => import ('./pages/Permit'))
const TambahUsers = React.lazy(() => import ('./pages/Users/TambahUsers'))
const TambahDepartment = React.lazy(() => import ('./pages/Department/TambahDepartment'))
const TambahRole = React.lazy(() => import ('./pages/Role/TambahRole'))
const EditDepartment = React.lazy(() => import ('./pages/Department/EditDepartment'))
const DetailDepartment = React.lazy(() => import ('./pages/Department/DetailDepartment'))

const routes = [
 { path: '/', exact: true, name: 'Home' },
 { path: '/dashboard', name: 'Dashboard', element: Dashboard },
 { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
 { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
 { path: '/notifications/badges', name: 'Badges', element: Badges }, 
 { path: '/notifications/modals', name: 'Modals', element: Modals },
 { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
 { path: '/pages/LoginForm', name:'LoginForm', element: LoginForm },
 { path: '/pages/RegisterForm', name:'RegisterForm', element: RegisterForm },
 { path: '/Users', name:'Users', element: Users },
 { path: '/Department', name:'Department', element: Department},
 { path: '/Role', name:'Role', element: Role},
 { path: '/Approval', name:'Approval', element: Approval},
 { path: '/Permit', name:'Permit', element: Permit},
 { path: '/TambahUsers', name:'TambahUsers', element: TambahUsers},
 { path: '/TambahDepartment', name:'TambahDepartment', element: TambahDepartment},
 { path: '/TambahRole', name:'TambahRole', element: TambahRole},
 { path: '/EditDepartment/:id', name:'EditDepartment', element: EditDepartment},
 { path: '/DetailDepartment/:id', name:'DetailDepartment', element: DetailDepartment},
  
]

export default routes