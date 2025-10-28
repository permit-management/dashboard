import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilFile,
  cilLayers,
  cilList,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  {
    component: CNavTitle,
    name: 'Master',
  },
  {
    component: CNavGroup,
    name: 'Master Data',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Users',
        to: '/Users',
      },
      {
        component: CNavItem,
        name: 'Department',
        to: '/Department',
      },
      {
        component: CNavItem,
        name: 'Role',
        to: '/Role',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Approval',
    to: '/Approval',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Permit',
    to: '/Permit',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'LoginForm',
  //       to: '/LoginForm',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'RegisterForm',
  //       to: '/RegisterForm',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'WellcomeForm',
  //       to: '/WellcomeForm',
  //     },

  //   ],
  // },
]

export default _nav
