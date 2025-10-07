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

const API_BASE = 'https://60swqrng-8080.asse.devtunnels.ms/api/v1'

const EditApproval = () => {
  const { id } = useParams() // WorkType ID
  const navigate = useNavigate()
  const [workTypeData, setWorkTypeData] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const userValue = (u) => u.id ?? u.user_id
  const userLabel = (u) => u.name ?? u.fullname ?? u.username ?? userValue(u)

  useEffect(() => {
    if (!id) {
      alert('ID WorkType tidak ditemukan di URL')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        console.log('Mengambil WorkType ID:', id)

        // ✅ Fetch users
        const usersRes = await fetch(`${API_BASE}/permit/users`, { headers })
        if (!usersRes.ok) throw new Error('Gagal fetch users')
        const usersJson = await usersRes.json()
        const userList = Array.isArray(usersJson)
          ? usersJson
          : Array.isArray(usersJson.data)
          ? usersJson.data
          : []
        setUsers(userList)

        // ✅ Fetch work type by ID
        const wtRes = await fetch(`${API_BASE}/permit/work-types/${id}`, { headers })
        if (!wtRes.ok) {
          const errText = await wtRes.text()
          throw new Error(`Status ${wtRes.status}: ${errText}`)
        }

        const wtJson = await wtRes.json()
        const wtData = wtJson.data

        setWorkTypeData({
          id: wtData.id,
          work_type: wtData.work_type,
          approval_1: wtData.approval_1,
          approval_2: wtData.approval_2,
          approval_3: wtData.approval_3,
        })

        console.log('Fetched WorkType:', wtData)
      } catch (err) {
        console.error('Fetch error:', err)
        alert('Gagal memuat data WorkType atau Users: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setWorkTypeData((prev) => ({
      ...prev,
      [name]: name.startsWith('approval_') ? Number(value) : value,
    }))
  }

  // ✅ Filter user untuk tiap dropdown supaya tidak dobel
  const getFilteredUsers = (currentApprovalKey) => {
    const excludeSet = new Set(
      Object.entries(workTypeData)
        .filter(([key, value]) => key.startsWith('approval_') && key !== currentApprovalKey && value)
        .map(([_, value]) => Number(value))
    )
    return users.filter((u) => !excludeSet.has(userValue(u)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const { work_type, approval_1, approval_2, approval_3 } = workTypeData

    if (!work_type) {
      alert('Work Type harus diisi')
      setSubmitting(false)
      return
    }

    if (!approval_1 || !approval_2 || !approval_3) {
      alert('Semua approval harus dipilih')
      setSubmitting(false)
      return
    }

    if (approval_1 === approval_2 || approval_1 === approval_3 || approval_2 === approval_3) {
      alert('Approval harus unik')
      setSubmitting(false)
      return
    }

    try {
      const payload = { work_type, approval_1, approval_2, approval_3 }

      const res = await fetch(`${API_BASE}/permit/work-types/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Update gagal')
      }

      alert('WorkType berhasil diupdate')
      navigate('/Approval')
    } catch (err) {
      console.error(err)
      alert('Gagal mengupdate WorkType: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
        <div>Memuat data...</div>
      </div>
    )
  }

  // Not found state
  if (!workTypeData) {
    return (
      <div className="text-center mt-5">
        <p className="text-danger">Data WorkType tidak ditemukan.</p>
        <CButton color="primary" onClick={() => navigate('/Approval')}>
          Kembali
        </CButton>
      </div>
    )
  }

  // Main Form
  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>
          <h5>Edit Approval Setting</h5>
          <small className="text-medium-emphasis">
            Update WorkType dan Approvals
          </small>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Work Type"
                  name="work_type"
                  value={workTypeData.work_type}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            {[1, 2, 3].map((n) => (
              <CRow className="mb-3" key={n}>
                <CCol md={6}>
                  <CFormSelect
                    label={`Approval ${n}`}
                    name={`approval_${n}`}
                    value={workTypeData[`approval_${n}`]}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih User --</option>
                    {getFilteredUsers(`approval_${n}`).map((u) => (
                      <option key={userValue(u)} value={userValue(u)}>
                        {userLabel(u)}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
            ))}

            <div className="d-flex justify-content-end">
              <CButton
                color="primary"
                type="submit"
                className="me-2"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save'}
              </CButton>
              <CButton color="secondary" onClick={() => navigate('/Approval')}>
                Cancel
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default EditApproval