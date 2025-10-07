import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard, CCardBody, CCardHeader,
  CContainer, CRow, CCol,
  CForm, CFormLabel, CFormInput, CButton,
} from '@coreui/react'

const TambahDepartment = () => {
  const [deptId, setDeptId] = useState('')
  const [deptName, setDeptName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Sesuaikan dengan field di backend (bukan 'id' atau 'code')
    const payload = {
      departements_id: deptId.trim(),
      departements_name: deptName.trim()
    }

    console.log('Data yang dikirim:', payload)

    try {
      const token = localStorage.getItem('token')

      const response = await fetch('https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/departements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errMsg = await response.text()
        throw new Error(errMsg || 'Gagal menambahkan department')
      }

      const result = await response.json()
      console.log('Berhasil:', result)
      alert('Department berhasil ditambahkan!')
      navigate('/Department')
    } catch (error) {
      console.error('Error saat mengirim:', error)
      alert('Gagal mengirim data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setDeptId('')
    setDeptName('')
    navigate('/Department')
  }

  return (
     <CContainer className="py-4">
     <h5 className="fw-bold mb-1">Create new department</h5>
      <p className="text-medium-emphasis mb-4">
        On this page, you have the ability to create new department
      </p>

      <CCard>
        <CCardHeader className="fw-semibold">Form Tambah Department</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-4 align-items-center">
              <CCol md={3}>
                <CFormLabel className="text-end d-block">Department ID :</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormInput
                  placeholder="Enter department id"
                  value={deptId}
                  onChange={(e) => setDeptId(e.target.value)}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-4 align-items-center">
              <CCol md={3}>
                <CFormLabel className="text-end d-block">Department Name :</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormInput
                  placeholder="Enter department name"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="justify-content-end">
              <CCol md={9} className="text-end">
                <CButton type="submit" color="primary" className="me-2" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </CButton>
                <CButton type="button" color="secondary" variant="outline" onClick={handleCancel}>
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

export default TambahDepartment