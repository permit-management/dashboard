import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CContainer,
  CButton,
  CSpinner,
} from '@coreui/react'
import axios from 'axios'
import bcrypt from 'bcryptjs'

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const config = { headers: { Authorization: `Bearer ${token}` } }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, rolesRes, deptRes] = await Promise.all([
          axios.get(`/api/v1/permit/users/${id}`, config),
          axios.get(`/api/v1/permit/roles`, config),
          axios.get(`/api/v1/permit/departements`, config),
        ])

        const userData = userRes.data
        setUser({
          id: userData.user_id,
          name: userData.name,
          email: userData.email,
          number_phone: userData.number_phone,
          role_id: userData.role_id,
          departement_id: userData.departement_id,
          password: '', // Kosong, bisa diganti
        })

        setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : rolesRes.data.data || [])
        setDepartments(Array.isArray(deptRes.data) ? deptRes.data : deptRes.data.data || [])

      } catch (error) {
        console.error('Error:', error)
        alert('Gagal mengambil data user.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        user_id: user.id,
        name: user.name,
        email: user.email,
        number_phone: user.number_phone,
        role_id: user.role_id,
        departement_id: user.departement_id,
      }

      if (user.password) {
        const salt = bcrypt.genSaltSync(10)
        payload.password = bcrypt.hashSync(user.password, salt)
      }

      await axios.put(
        `/api/v1/permit/users/${id}`,
        payload,
        config
      )

      alert('User berhasil diupdate!')
      navigate('/Users')
    } catch (err) {
      console.error('Update error:', err)
      alert('Gagal mengupdate user.')
    }
  }

  if (loading || !user) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
        <div>Memuat data pengguna...</div>
      </div>
    )
  }

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>
          <h5>Edit User</h5>
          <small className="text-medium-emphasis">Update data pengguna di form ini.</small>
        </CCardHeader>

        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput label="User ID" value={user.id} readOnly />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Phone Number"
                  name="number_phone"
                  value={user.number_phone}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="email"
                  label="Email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect
                  label="Department"
                  name="departement_id"
                  value={user.departement_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Departemen</option>
                  {departments.map((dept) => (
                    <option key={dept.departements_id} value={dept.departements_id}>
                      {dept.departements_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  label="Role"
                  name="role_id"
                  value={user.role_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Role</option>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={6}>
                <CFormInput
                  type="password"
                  label="Password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Kosongkan jika tidak diganti"
                />
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end">
              <CButton color="primary" type="submit" className="me-2">
                Save
              </CButton>
              <CButton color="secondary" onClick={() => navigate('/Users')}>
                Cancel
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default EditUser