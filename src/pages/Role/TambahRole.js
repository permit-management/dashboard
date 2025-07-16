import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CRow, CCol, CFormLabel, CFormInput, CFormCheck, CButton, CForm
} from '@coreui/react';

const TambahRole = () => {
  const [roleId, setRoleId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // Pastikan token login disimpan di sini

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await axios.get('https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/roles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ambil dari response permission list-nya
        const allPermissions = res.data?.permissions || []; // tergantung struktur API kamu

        const formattedPermissions = allPermissions.map((perm) => ({
          permission_id: perm.permission_id,
          permission_code: perm.permission_code,
          permission_name: perm.permission_name,
          allow_read: false,
          allow_create: false,
          allow_update: false,
          allow_delete: false,
        }));

        setPermissions(formattedPermissions);
      } catch (err) {
        console.error('Gagal fetch roles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const handleChange = (index, field) => {
    const updated = [...permissions];
    updated[index][field] = !updated[index][field];
    setPermissions(updated);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/roles', {
        role_id: roleId,
        role_name: roleName,
        permissions: permissions.map(p => ({
          permission_id: p.permission_id,
          allow_read: p.allow_read,
          allow_create: p.allow_create,
          allow_update: p.allow_update,
          allow_delete: p.allow_delete,
        })),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Role berhasil dibuat!');
    } catch (error) {
      console.error('Gagal submit:', error);
    }
  };

  return (
    <div>
      <h4>Create New Role</h4>
      <CForm className="mt-3">
        <CRow className="mb-3">
          <CCol md={3}><CFormLabel>Role ID:</CFormLabel></CCol>
          <CCol md={9}>
            <CFormInput value={roleId} onChange={(e) => setRoleId(e.target.value)} />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={3}><CFormLabel>Role Name:</CFormLabel></CCol>
          <CCol md={9}>
            <CFormInput value={roleName} onChange={(e) => setRoleName(e.target.value)} />
          </CCol>
        </CRow>

        <CRow>
          <CCol md={3}><CFormLabel>Role Access:</CFormLabel></CCol>
          <CCol md={9}>
            {loading ? (
              <p>Loading permissions...</p>
            ) : (
              permissions.map((perm, index) => (
                <div key={perm.permission_id} className="mb-3">
                  <CFormCheck
                    label={`${perm.permission_name} (${perm.permission_code}) - Read`}
                    checked={perm.allow_read}
                    onChange={() => handleChange(index, 'allow_read')}
                  />
                  {perm.allow_read && (
                    <div className="ms-4">
                      <CFormCheck
                        label="Create"
                        checked={perm.allow_create}
                        onChange={() => handleChange(index, 'allow_create')}
                      />
                      <CFormCheck
                        label="Update"
                        checked={perm.allow_update}
                        onChange={() => handleChange(index, 'allow_update')}
                      />
                      <CFormCheck
                        label="Delete"
                        checked={perm.allow_delete}
                        onChange={() => handleChange(index, 'allow_delete')}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </CCol>
        </CRow>

        <CRow>
          <CCol className="d-flex justify-content-end">
            <CButton onClick={handleSubmit}>Save</CButton>
          </CCol>
        </CRow>
      </CForm>
    </div>
  );
};

export default TambahRole;