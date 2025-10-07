import { useEffect, useState } from 'react'
import {
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
} from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import bcrypt from 'bcryptjs'

const MyForm = () => {
  const navigate = useNavigate()
  const [roles, setRoles] = useState([])
  const [departments, setDepartments] = useState([])

  const [form, setForm] = useState({
    user_id: '', // ✅ tambahkan user_id manual
    name: '',
    username: '',
    number_phone: '',
    email: '',
    password: '',
    role_id: '',
    departement_id: '',
  })

  const token = localStorage.getItem('token')
  const config = { headers: { Authorization: `Bearer ${token}` } }

  useEffect(() => {
    if (!token) {
      console.error('Token not found.')
      return
    }

    axios.get('https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/roles', config)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || []
        setRoles(data)
      })
      .catch((err) => console.error('Error fetching roles:', err))

    axios.get('https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/departements', config)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || []
        setDepartments(data)
      })
      .catch((err) => console.error('Error fetching departments:', err))
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.user_id || !form.department || !form.role) {
      alert('User ID, Department, dan Role wajib diisi!')
      return
    }

    try {
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(form.password, salt)

      const payload = {
        user_id: form.user_id,
        name: form.name,
        username: form.username,
        number_phone: form.number_phone,
        email: form.email,
        password: hashedPassword,
        role_id: form.role,
        departement_id: form.department,
      }

      console.log('Payload:', payload)

      await axios.post(
        'https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/users',
        payload,
        config
      )

      alert('User berhasil ditambahkan!')
      navigate('/Users')
    } catch (err) {
      console.error('Gagal tambah user:', err.response?.data || err.message)
      alert('Gagal menambahkan user.')
    }
  }

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>
          <h5>Create New User</h5>
          <small>On this page, you can create new user profiles.</small>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={3}><CFormLabel>User ID:</CFormLabel></CCol>
              <CCol md={9}>
                <CFormInput name="user_id" value={form.user_id} onChange={handleChange} required />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={3}><CFormLabel>Name:</CFormLabel></CCol>
              <CCol md={9}>
                <CFormInput name="name" value={form.name} onChange={handleChange} required />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={3}><CFormLabel>Username:</CFormLabel></CCol>
              <CCol md={9}>
                <CFormInput name="username" value={form.username} onChange={handleChange} required />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={3}><CFormLabel>Phone Number:</CFormLabel></CCol>
              <CCol md={9}>
                <CFormInput name="number_phone" value={form.number_phone} onChange={handleChange} required />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={3}><CFormLabel>Email:</CFormLabel></CCol>
              <CCol md={9}>
                <CFormInput type="email" name="email" value={form.email} onChange={handleChange} required />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={3}><CFormLabel>Department:</CFormLabel></CCol>
              <CCol md={9}>
                <CFormSelect name="department" value={form.department} onChange={handleChange} required>
                  <option value="">Pilih Department</option>
                  {departments.map((d) => (
                    <option key={d.departements_id} value={d.departements_id}>
                      {d.departements_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={3}><CFormLabel>Role:</CFormLabel></CCol>
              <CCol md={9}>
                <CFormSelect name="role" value={form.role} onChange={handleChange} required>
                  <option value="">Pilih Role</option>
                  {roles.map((r) => (
                    <option key={r.role_id} value={r.role_id}>
                      {r.role_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={3}><CFormLabel>Password:</CFormLabel></CCol>
              <CCol md={9}>
                <CFormInput type="password" name="password" value={form.password} onChange={handleChange} required />
              </CCol>
            </CRow>

            <CRow>
              <CCol md={{ span: 9, offset: 10 }} className="d-flex gap-2">
                <CButton type="submit" color="primary">Save</CButton>
                <CButton type="button" color="secondary" onClick={() => navigate('/Users')}>
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

export default MyForm