import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard, CCardBody, CCardHeader,
  CContainer, CRow, CCol,
  CFormLabel, CFormInput, CButton, CSpinner
} from '@coreui/react';

const DetailUsers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/v1/permit/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Gagal mengambil data: ${res.status}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan saat memuat data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  const handleEdit = () => {
    navigate(`/EditUsers/${id}`);
  };

  const handleBack = () => {
    navigate('/Users');
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Yakin ingin menghapus user ini?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/v1/permit/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Gagal menghapus user');
      alert('User berhasil dihapus');
      navigate('/Users');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <CContainer className="py-4 text-center">
        <CSpinner color="primary" />
        <div>Memuat data pengguna...</div>
      </CContainer>
    );
  }

  if (error) {
    return (
      <CContainer className="py-4 text-center">
        <p className="text-danger">{error}</p>
        <CButton onClick={handleBack}>Kembali</CButton>
      </CContainer>
    );
  }

  return (
    <CContainer className="py-4">
      <h5 className="fw-bold mb-1">Detail Pengguna</h5>
      <p className="text-medium-emphasis mb-4">
        Halaman ini menampilkan detail lengkap pengguna.
      </p>

      <CCard>
        <CCardHeader className="fw-semibold">Informasi Pengguna</CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={3}><CFormLabel>User ID:</CFormLabel></CCol>
            <CCol md={9}><CFormInput value={user.user_id || '-'} disabled /></CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={3}><CFormLabel>Nama:</CFormLabel></CCol>
            <CCol md={9}><CFormInput value={user.name || '-'} disabled /></CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={3}><CFormLabel>Email:</CFormLabel></CCol>
            <CCol md={9}><CFormInput value={user.email || '-'} disabled /></CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={3}><CFormLabel>Nomor Telepon:</CFormLabel></CCol>
            <CCol md={9}><CFormInput value={user.number_phone || '-'} disabled /></CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={3}><CFormLabel>Departemen:</CFormLabel></CCol>
            <CCol md={9}>
              <CFormInput
                value={
                  user.departement?.departement_id ||
                  user.departement_id ||
                  user.departement ||
                  '-'
                }
                disabled
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={3}><CFormLabel>Role:</CFormLabel></CCol>
            <CCol md={9}>
              <CFormInput
                value={
                  user.role?.role_id ||
                  user.role_id ||
                  user.role ||
                  '-'
                }
                disabled
              />
            </CCol>
          </CRow>

          <div className="d-flex justify-content-end gap-2">
            <CButton color="secondary" onClick={handleBack}>Back</CButton>
            <CButton color="danger" onClick={handleDelete}>Delete</CButton>
            <CButton color="primary" onClick={handleEdit}>Edit</CButton>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default DetailUsers;