import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormCheck,
  CButton,
  CRow,
  CCol,
  CSpinner,
  CAlert,
} from '@coreui/react';

const DetailRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`/roles/${id}`)
      .then((res) => {
        setRoleData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Gagal mengambil data role.');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus role ini?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/roles/${id}`);
      alert('Role berhasil dihapus');
      navigate('/R                                                                                                                                                                                                                                                                                                                                  ole');
    } catch (error) {
      alert('Gagal menghapus role.');
    }
  };

  if (loading) return <CSpinner color="primary" />;
  if (error) return <CAlert color="danger">{error}</CAlert>;
  if (!roleData) return null;

  return (
    <CCard>
      <CCardHeader className="fw-bold fs-5">Detail Role</CCardHeader>
      <CCardBody>
        <CForm>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput label="Role ID" value={roleData.role_id} readOnly />
            </CCol>
            <CCol md={6}>
              <CFormInput label="Role Name" value={roleData.role_name} readOnly />
            </CCol>
          </CRow>

          <h6 className="fw-bold mb-3">Role Access</h6>

          {roleData.permissions && roleData.permissions.length > 0 ? (
            roleData.permissions.map((perm) => (
              <CCard className="mb-3" key={perm.permission_id}>
                <CCardBody>
                  <div className="mb-2 fw-semibold">{perm.permission_id.replace(/_/g, ' ')}</div>
                  <CRow>
                    <CCol xs={3}>
                      <CFormCheck
                        label="Create"
                        checked={perm.allow_create}
                        readOnly
                        disabled
                      />
                    </CCol>
                    <CCol xs={3}>
                      <CFormCheck
                        label="Update"
                        checked={perm.allow_update}
                        readOnly
                        disabled
                      />
                    </CCol>
                    <CCol xs={3}>
                      <CFormCheck
                        label="Delete"
                        checked={perm.allow_delete}
                        readOnly
                        disabled
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            ))
          ) : (
            <CAlert color="warning">Tidak ada permission yang ditampilkan.</CAlert>
          )}

          <CRow className="mt-4">
            <CCol xs="auto">
              <CButton color="secondary" onClick={() => navigate('/Role')}>Back</CButton>
            </CCol>
            <CCol xs="auto">
              <CButton color="danger" onClick={handleDelete}>Delete</CButton>
            </CCol>
            <CCol xs="auto">
              <CButton color="primary" onClick={() => navigate(`/EditRole/${id}`)}>Edit</CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default DetailRole;