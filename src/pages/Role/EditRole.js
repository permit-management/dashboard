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

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roleData, setRoleData] = useState({
    role_id: '',
    role_name: '',
    permissions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const permissionMap = {
    1: 'User View',
    2: 'User Edit',
    3: 'Department View',
    4: 'Department Edit',
    5: 'Report Access',
    // Tambahkan sesuai jumlah ID yang ada
  };

  // Fetch data role by ID
  useEffect(() => {
    axios
      .get(`/roles/${id}`)
      .then((res) => {
        const data = res.data?.data || res.data; // handle if backend wraps with { data: {...} }
        console.log('DATA API:', data);

        // Pastikan permissions selalu berupa array
        if (!Array.isArray(data.permissions)) {
          data.permissions = [];
        }

        setRoleData({
          role_id: data.role_id || '',
          role_name: data.role_name || '',
          permissions: data.permissions.map((perm) => ({
            permission_id: perm.permission_id || null,
            allow_read: perm.allow_read || false,
            allow_create: perm.allow_create || false,
            allow_update: perm.allow_update || false,
            allow_delete: perm.allow_delete || false,
          })),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching role:', err);
        setError('Gagal mengambil data role.');
        setLoading(false);
      });
  }, [id]);

  // Handler untuk toggle checkbox permission
  const handlePermissionChange = (index, field) => {
    const updatedPermissions = [...roleData.permissions];
    updatedPermissions[index][field] = !updatedPermissions[index][field];
    setRoleData({ ...roleData, permissions: updatedPermissions });
  };

  // Submit update role
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    axios
      .put(`/roles/${id}`, roleData)
      .then(() => navigate('/Role'))
      .catch((err) => {
        console.error('Error updating role:', err);
        setError('Gagal memperbarui role.');
      });
  };

  if (loading) return <CSpinner color="primary" />;

  return (
    <CCard>
      <CCardHeader className="fw-bold fs-5">Edit Role</CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}

        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                label="Role ID"
                value={roleData.role_id}
                readOnly
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label="Role Name"
                value={roleData.role_name}
                onChange={(e) =>
                  setRoleData({ ...roleData, role_name: e.target.value })
                }
              />
            </CCol>
          </CRow>

          <h6 className="mt-4 mb-3 fw-semibold">Permissions</h6>

          {roleData.permissions.length > 0 ? (
            roleData.permissions.map((perm, index) => (
              <CCard key={perm.permission_id || index} className="mb-3">
                <CCardBody>
                  <div className="mb-2">
                    <strong>
                      {permissionMap[perm.permission_id] || `Permission ${perm.permission_id}`}
                    </strong>
                  </div>
                  <CRow>
                    <CCol xs={3}>
                      <CFormCheck
                        label="Read"
                        checked={perm.allow_read}
                        onChange={() =>
                          handlePermissionChange(index, 'allow_read')
                        }
                      />
                    </CCol>
                    <CCol xs={3}>
                      <CFormCheck
                        label="Create"
                        checked={perm.allow_create}
                        onChange={() =>
                          handlePermissionChange(index, 'allow_create')
                        }
                      />
                    </CCol>
                    <CCol xs={3}>
                      <CFormCheck
                        label="Update"
                        checked={perm.allow_update}
                        onChange={() =>
                          handlePermissionChange(index, 'allow_update')
                        }
                      />
                    </CCol>
                    <CCol xs={3}>
                      <CFormCheck
                        label="Delete"
                        checked={perm.allow_delete}
                        onChange={() =>
                          handlePermissionChange(index, 'allow_delete')
                        }
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            ))
          ) : (
            <CAlert color="warning">
              Tidak ada permission tersedia. Periksa apakah role memiliki permission.
            </CAlert>
          )}

          <CButton type="submit" color="primary" className="mt-3">
            Update Role
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default EditRole;