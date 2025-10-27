import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard, CCardBody, CCardHeader,
  CContainer, CRow, CCol,
  CForm, CFormLabel, CFormInput, CFormSelect, CButton,
} from '@coreui/react'

const API_BASE = '/api/v1' // sesuaikan kalau perlu

export default function CreateApprovalSetting() {
  const navigate = useNavigate()

  const [workType, setWorkType] = useState('')
  const [approval1, setApproval1] = useState('')
  const [approval2, setApproval2] = useState('')
  const [approval3, setApproval3] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API_BASE}/permit/users`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: 'Bearer ' + token }),
          },
        })
        if (!res.ok) throw new Error('GET users failed: ' + res.status)
        const d = await res.json()
        setUsers(Array.isArray(d) ? d : Array.isArray(d.data) ? d.data : [])
      } catch (err) {
        console.error('fetchUsers error:', err)
        alert('Gagal memuat daftar user: ' + err.message)
      }
    }
    fetchUsers()
  }, [])

  // pakai ID user (angka) untuk value
  const userValue = (u) => Number(u.id ?? u.user_id) // fallback kalau field id beda
  const userLabel = (u) => String(u.fullname ?? u.username ?? u.name ?? userValue(u))

  const getFilteredUsers = (excludeValues = []) => {
    const excludeSet = new Set(excludeValues.filter(Boolean).map(Number))
    return users.filter((u) => !excludeSet.has(userValue(u)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!workType.trim()) { alert('Work type harus diisi'); setLoading(false); return }
    if (!approval1 || !approval2 || !approval3) { alert('Pilih semua approval'); setLoading(false); return }
    if (approval1 === approval2 || approval1 === approval3 || approval2 === approval3) {
      alert('Approval harus unik (tidak boleh sama)')
      setLoading(false)
      return
    }

    // kirim ID user (angka)
    const payload = {
      work_type: workType.trim(),
      approval_1: Number(approval1),
      approval_2: Number(approval2),
      approval_3: Number(approval3),
    }

    console.log('POST ->', `${API_BASE}/work-types`, 'payload:', payload)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE}/permit/work-types`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token }),
        },
        body: JSON.stringify(payload),
      })

      console.log('raw response:', response)

      if (!response.ok) {
        let text = await response.text()
        try { const j = JSON.parse(text); text = j.error || j.message || JSON.stringify(j) } catch (_) { }
        throw new Error(`HTTP ${response.status} - ${text}`)
      }

      const result = await response.json()
      console.log('success result:', result)
      alert('Approval setting berhasil ditambahkan!')
      navigate('/Approval')
    } catch (err) {
      console.error('submit error:', err)
      alert('Gagal mengirim data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CContainer className="py-4">
      <CCard>
        <CCardHeader>Create new approval setting</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={3}><CFormLabel>Work Type</CFormLabel></CCol>
              <CCol md={9}>
                <CFormInput
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  placeholder="Enter work type"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={3}><CFormLabel>Approval 1</CFormLabel></CCol>
              <CCol md={9}>
                <CFormSelect value={approval1} onChange={(e) => setApproval1(Number(e.target.value))}>
                  <option value="">-- Select --</option>
                  {getFilteredUsers([approval2, approval3]).map((u) => (
                    <option key={userValue(u)} value={userValue(u)}>{userLabel(u)}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={3}><CFormLabel>Approval 2</CFormLabel></CCol>
              <CCol md={9}>
                <CFormSelect value={approval2} onChange={(e) => setApproval2(Number(e.target.value))}>
                  <option value="">-- Select --</option>
                  {getFilteredUsers([approval1, approval3]).map((u) => (
                    <option key={userValue(u)} value={userValue(u)}>{userLabel(u)}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={3}><CFormLabel>Approval 3</CFormLabel></CCol>
              <CCol md={9}>
                <CFormSelect value={approval3} onChange={(e) => setApproval3(Number(e.target.value))}>
                  <option value="">-- Select --</option>
                  {getFilteredUsers([approval1, approval2]).map((u) => (
                    <option key={userValue(u)} value={userValue(u)}>{userLabel(u)}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <div className="text-end">
              <CButton color="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}