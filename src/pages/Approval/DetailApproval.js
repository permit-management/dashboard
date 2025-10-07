import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CContainer,
  CButton,
  CSpinner,
} from '@coreui/react'

const API_BASE = 'https://60swqrng-8080.asse.devtunnels.ms/api/v1'

const DetailApproval = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workTypeData, setWorkTypeData] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const token = localStorage.getItem('token')
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const findUserName = (userId) => {
    if (!userId || users.length === 0) return '-'
    const user = users.find(
      (u) =>
        Number(u.user_id) === Number(userId) || Number(u.id) === Number(userId)
    )
    return user
      ? (user.name ?? user.fullname ?? user.username ?? `User ${userId}`)
      : '-'
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch(`${API_BASE}/permit/users`, { headers })
        const usersJson = await usersRes.json()
        const userList = Array.isArray(usersJson)
          ? usersJson
          : Array.isArray(usersJson.data)
          ? usersJson.data
          : []
        setUsers(userList)

        const wtRes = await fetch(`${API_BASE}/permit/work-types/${id}`, {
          headers,
        })
        const wtJson = await wtRes.json()
        setWorkTypeData(wtJson.data)
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

 const handleDelete = async () => {
  if (!window.confirm('Yakin ingin menghapus WorkType ini?')) return;

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/permit/work-types/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    let result = {};
    try {
      result = await res.json(); // coba parse JSON
    } catch {
      result = { error: await res.text() }; // fallback kalau bukan JSON
    }

    if (!res.ok) {
      // khusus FK error
      if (String(result.error).includes("foreign key constraint fails")) {
        alert("❌ WorkType ini masih dipakai di Permit, jadi tidak bisa dihapus.");
      } else {
        alert("❌ Gagal menghapus WorkType: " + (result.error || res.statusText));
      }
      return;
    }

    alert("✅ WorkType berhasil dihapus.");
    navigate("/Approval");
  } catch (err) {
    console.error("Delete error:", err);
    alert("⚠️ Terjadi kesalahan: " + err.message);
  }finally {
    setDeleting(false)
  }
}


  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
        <div>Memuat data...</div>
      </div>
    )
  }

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

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>
          <h5>Detail Approval</h5>
          <small className="text-medium-emphasis">
            Informasi lengkap WorkType dan approver
          </small>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="WorkType ID"
                  value={workTypeData.id}
                  disabled
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Work Type"
                  value={workTypeData.work_type}
                  disabled
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Approval 1"
                  value={findUserName(workTypeData.approval_1)}
                  disabled
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Approval 2"
                  value={findUserName(workTypeData.approval_2)}
                  disabled
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Approval 3"
                  value={findUserName(workTypeData.approval_3)}
                  disabled
                />
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end gap-2">
              <CButton
                color="secondary"
                onClick={() => navigate('/Approval')}
                disabled={deleting}
              >
                Back
              </CButton>
              <CButton
                color="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </CButton>
              <CButton
                color="primary"
                onClick={() => navigate(`/EditApproval/${workTypeData.id}`)}
                disabled={deleting}
              >
                Edit
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default DetailApproval
