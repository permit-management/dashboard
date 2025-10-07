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
const Approval = React.lazy(() => import('./pages/Approval/Approval'))
const TambahApproval = React.lazy(() => import('./pages/Approval/TambahApproval'))
const EditApproval = React.lazy(() => import ('./pages/Approval/EditApproval'))
const DetailApproval = React.lazy(() => import ('./pages/Approval/DetailApproval'))
const Permit = React.lazy(() => import ('./pages/Permit/Permit'))
const DetailPermit = React.lazy (() => import ('./pages/Permit/DetailPermit'))
const TambahUsers = React.lazy(() => import ('./pages/Users/TambahUsers'))
const TambahDepartment = React.lazy(() => import ('./pages/Department/TambahDepartment'))
const TambahRole = React.lazy(() => import ('./pages/Role/TambahRole'))
const EditDepartment = React.lazy(() => import ('./pages/Department/EditDepartment'))
const DetailDepartment = React.lazy(() => import ('./pages/Department/DetailDepartment'))
const EditRole = React.lazy(() => import ('./pages/Role/EditRole'))
const Detailrole = React.lazy(() => import ('./pages/Role/DetailRole'))
const EditUsers = React.lazy(() => import ('./pages/Users/EditUsers'))
const DetailUsers = React.lazy(() => import ('./pages/Users/DetailUsers'))
const WellcomeForm = React.lazy(() => import ('./pages/WellcomeForm'))
const Contractor = React.lazy (() => import ('./pages/Contractor'))


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
 { path: '/TambahApproval', name:'TambahApproval', element: TambahApproval},
 { path: '/EditApproval/:id', name:'EditApproval', element: EditApproval},
 { path: '/DetailApproval/:id', name:'DetailApproval', element: DetailApproval},
 { path: '/Permit', name:'Permit', element: Permit},
 { path: '/DetailPermit/:id', name:'DetailPermit', element: DetailPermit},
 { path: '/TambahUsers', name:'TambahUsers', element: TambahUsers},
 { path: '/TambahDepartment', name:'TambahDepartment', element: TambahDepartment},
 { path: '/TambahRole', name:'TambahRole', element: TambahRole},
 { path: '/EditDepartment/:id', name:'EditDepartment', element: EditDepartment},
 { path: '/DetailDepartment/:id', name:'DetailDepartment', element: DetailDepartment},
 { path: '/EditRole/:id', name:'EditRole', element:EditRole},
 { path: '/DetailRole/:id', name:'DetailRole', element:Detailrole},
 { path: '/EditUsers/:id', name:'EditUsers', element:EditUsers},
 { path: '/DetailUsers/:id', name:'DetailUsers', element:DetailUsers},
 { path: '/WellcomeForm/', name:'WellcomeForm', element:WellcomeForm},
 { path: '/Contractor/', name:'Contractor', element:Contractor}, 
]

export default routes