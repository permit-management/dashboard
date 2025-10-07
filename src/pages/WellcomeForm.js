import React from 'react'
import logo from './Assets/logo.png'
import { CContainer, CRow, CCol, CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const WelcomePage = () => {
  const navigate = useNavigate()

  return (
    <CContainer 
      fluid 
      className="d-flex align-items-center justify-content-center min-vh-100 bg-white text-center"
    >
      <CRow className="w-100 justify-content-center">
        <CCol xs={12}>
          {/*  Logo */}
          <img
            src={logo}
            alt="Logo"
            style={{ width: '180px', marginBottom: '20px' }}
          />

          {/* Text Welcome */}
          <h2 className="fw-bold mb-3">Selamat Datang</h2>
          <p className="text-muted mb-4 fs-5">
            di <strong>Enterprise Permit Management System</strong> <br />
            <strong>PT Borneo Indobara (BIB)</strong>
          </p>

          {/* Button */}
          <CButton
            color="primary"
            size="lg"
            className="px-4"
            onClick={() => navigate('/Contractor')}
          >
            Submit Permission
          </CButton>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default WelcomePage