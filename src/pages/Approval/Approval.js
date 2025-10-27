import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'
import Table from 'react-bootstrap/Table'

const API_BASE = '/api/v1'

export default function ApprovalList() {
  const [data, setData] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch daftar work types
  const getWorkTypes = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/permit/work-types`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const result = await res.json()
      if (Array.isArray(result.data)) {
        setData(result.data)
      } else {
        setError('Format data tidak sesuai backend')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Gagal mengambil data work types dari server')
    }
  }

  // Fetch daftar users untuk mapping ID -> nama
  const getUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/permit/users`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const result = await res.json()
      // langsung array
      if (Array.isArray(result)) {
        const map = {}
        result.forEach((u) => {
          map[u.id] = u.name || u.username // fallback kalau field nya username
        })
        setUsers(map)
      } else if (Array.isArray(result.data)) {
        const map = {}
        result.data.forEach((u) => {
          map[u.id] = u.name || u.username
        })
        setUsers(map)
      } else if (Array.isArray(result.users)) {
        const map = {}
        result.users.forEach((u) => {
          map[u.id] = u.name || u.username
        })
        setUsers(map)
      } else {
        setError('Format data users tidak sesuai backend')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Gagal mengambil data users dari server')
    }
  }

  // Ambil data sekaligus
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      await Promise.all([getWorkTypes(), getUsers()])
      setLoading(false)
    }
    fetchAll()
  }, [])

  return (
    <CContainer fluid>
      <CRow className="mb-3 align-items-center">
        <CCol>
          <h4 className="fw-bold">Approval</h4>
          <p className="text-medium-emphasis">
            Daftar work type beserta approver (nama user)
          </p>
        </CCol>
        <CCol className="text-end">
          <Link to="/TambahApproval">
            <CButton color="primary">+ Create new approval</CButton>
          </Link>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader className="fw-semibold">Approval List</CCardHeader>
        <CCardBody>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Work Type</th>
                <th>Approval 1</th>
                <th>Approval 2</th>
                <th>Approval 3</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-center text-danger">{error}</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">Tidak ada data</td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.work_type}</td>
                    <td>{users[item.approval_1] || item.approval_1}</td>
                    <td>{users[item.approval_2] || item.approval_2}</td>
                    <td>{users[item.approval_3] || item.approval_3}</td>
                    <td>
                      <Link to={`/DetailApproval/${item.id}`}>
                        <button className="btn btn-link p-0 me-2">Detail</button>
                      </Link>
                      <Link to={`/EditApproval/${item.id}`}>
                        <button className="btn btn-link p-0">Edit</button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}