import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard, CCardBody, CCardHeader,
  CContainer, CRow, CCol,
  CForm, CFormLabel, CFormInput, CButton,
} from '@coreui/react';

const EditDepartment = () => {
  const { id } = useParams();
  const [deptId, setDeptId] = useState('');
  const [deptName, setDeptName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      alert('ID department tidak ditemukan di URL.');
      navigate('/Department');
      return;
    }

    const fetchDepartment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/v1/permit/departements/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data department');
        }

        const data = await response.json();

        // Cek struktur data yang benar (mungkin data.data)
        const item = data;

        setDeptId(item.departements_id || '');
        setDeptName(item.departements_name || '');
      } catch (error) {
        console.error(error);
        alert('Gagal mengambil data: ' + error.message);
      }
    };

    fetchDepartment();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      departements_id: deptId.trim(),
      departements_name: deptName.trim()
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/permit/departements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || 'Gagal mengupdate department');
      }

      alert('Department berhasil diperbarui!');
      navigate('/Department');
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal mengupdate data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CContainer className="py-4">
      <h5 className="fw-bold mb-1">Detail department</h5>
      <p className="text-medium-emphasis mb-4">
        On this page, you can view comprehensive details of department.
      </p>

      <CCard>
        <CCardHeader className="fw-semibold">Edit Department</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-4 align-items-center">
              <CCol md={3}>
                <CFormLabel className="text-end d-block">Department ID :</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormInput value={deptId} disabled readOnly />
              </CCol>
            </CRow>

            <CRow className="mb-4 align-items-center">
              <CCol md={3}>
                <CFormLabel className="text-end d-block">Department Name :</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormInput
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
                <CButton type="button" color="secondary" variant="outline" onClick={() => navigate('/Department')}>
                  Cancel
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default EditDepartment;