import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'   // ⬅️ untuk redirect
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
} from '@coreui/react'

const TambahUsers = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: '',
    role: '',
    password: '',
  })

  const navigate = useNavigate()                // ⬅️ inisialisasi

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('User baru:', formData)
    // TODO: Kirim data ke backend
  }

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      department: '',
      role: '',
      password: '',
    })
    navigate('/Users')                          // ⬅️ pastikan path sesuai route list User
  }

  return (
    <CContainer className="py-4">
      <h5 className="fw-bold mb-1">Create new user</h5>
      <p className="text-medium-emphasis mb-4">
        On this page, you have the ability to create new user profiles.
      </p>

      <CCard>
        <CCardHeader className="fw-semibold">Form Tambah User</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            {/* ===== Name ===== */}
            <CRow className="mb-3 align-items-center">
              <CCol md={3}>
                <CFormLabel className="text-end d-block">Name :</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormInput
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            {/* ===== Phone ===== */}
            <CRow className="mb-3 align-items-center">
              <CCol md={3}>
                <CFormLabel className="text-end d-block">Phone Number :</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormInput
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            {/* ===== Email ===== */}
            <CRow className="mb-3 align-items-center">
              <CCol md={3}>
                <CFormLabel className="text-end d-block">Email :</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormInput
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            {/* ===== Department ===== */}
            <CRow className="mb-3 align-items-center">
              <CCol md={3}>
                <CFormLabel className="text-end d-block">Department :</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormSelect
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {/* ===== Role ===== */}
            <CRow className="mb-3 align-items-center">
              <CCol md={3}>
                <CFormLabel className="text-end d-block">Role :</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormSelect
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="manaChief Executive Officer">Chief Executive Officer</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {/* ===== Password ===== */}
            <CRow className="mb-4 align-items-center">
              <CCol md={3}>
                <CFormLabel className="text-end d-block">Password :</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormInput
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            {/* ===== Buttons ===== */}
            <CRow className="justify-content-end">
              <CCol md={9} className="text-end">
                <CButton type="submit" color="primary" className="me-2">
                  Save
                </CButton>
                <CButton
                  type="button"
                  color="secondary"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default TambahUsers