import React, { useState } from 'react';
import {
 CCard,
 CCardBody,
 CCardHeader,
 CRow,
 CCol,
 CForm,
 CFormLabel,
 CFormInput,
 CFormCheck,
 CButton,
 CContainer,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TambahRole = () => {
 const [roleId, setRoleId] = useState('');
 const [roleName, setRoleName] = useState('');
 const navigate = useNavigate();

 const token = localStorage.getItem('token');

 const [permissions, setPermissions] = useState([
  { permission_id: 1, permission_name: 'Master Data User', allow_read: false, allow_create: false, allow_update: false, allow_delete: false, fullAccess: true },
  { permission_id: 2, permission_name: 'Master Data Approval Workflow', allow_read: false, allow_create: false, allow_update: false, allow_delete: false, fullAccess: true },
  { permission_id: 3, permission_name: 'Permit Submissions', allow_read: false, fullAccess: false },
  { permission_id: 4, permission_name: 'Monitoring Dashboard', allow_read: false, fullAccess: false },
 ]);

 const handleCheckboxChange = (index, field) => {
  const updated = [...permissions];
  updated[index][field] = !updated[index][field];
  setPermissions(updated);
 };

 const handleSubmit = async () => {
  const formattedPermissions = permissions.map(p => {
   const obj = { permission_id: p.permission_id };
   if (p.allow_read) obj.allow_read = true;
   if (p.fullAccess) {
    if (p.allow_create) obj.allow_create = true;
    if (p.allow_update) obj.allow_update = true;
    if (p.allow_delete) obj.allow_delete = true;
   }
   return obj;
  });

  const payload = {
   role_id: roleId,
   role_name: roleName,
   permissions: formattedPermissions,
  };

  try {
   await axios.post(
    'https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/roles',
    payload,
    {
     headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
     },
    }
   );
   alert('Role berhasil ditambahkan!');
   navigate('/Role');
  } catch (error) {
   console.error(error);
   alert('Gagal menambahkan role.');
  }
 };

 return (
  <CContainer className="mt-4">
   <CCard>
    <CCardHeader>
     <strong>Tambah Role</strong>
    </CCardHeader>
    <CCardBody>
     <CForm>
      <CRow className="mb-3">
       <CCol md={6}>
        <CFormLabel htmlFor="roleId">Role ID</CFormLabel>
        <CFormInput
         id="roleId"
         value={roleId}
         onChange={(e) => setRoleId(e.target.value)}
        />
       </CCol>
       <CCol md={6}>
        <CFormLabel htmlFor="roleName">Role Name</CFormLabel>
        <CFormInput
         id="roleName"
         value={roleName}
         onChange={(e) => setRoleName(e.target.value)}
        />
       </CCol>
     </CRow>

      <hr />
      <h5>Permissions</h5>

      {permissions.map((perm, index) => (
       <div key={perm.permission_id} className="mb-3 ps-2">
        <CFormCheck
         type="checkbox"
         label={perm.permission_name}
         checked={perm.allow_read}
         onChange={() => handleCheckboxChange(index, 'allow_read')}
        />
        {perm.fullAccess && perm.allow_read && (
         <CRow className="ps-4">
          <CCol xs="auto">
          <CFormCheck
            label="Create"
           checked={perm.allow_create}
            onChange={() => handleCheckboxChange(index, 'allow_create')}
           />
          </CCol>
          <CCol xs="auto">
           <CFormCheck
            label="Update"
            checked={perm.allow_update}
            onChange={() => handleCheckboxChange(index, 'allow_update')}
           />
          </CCol>
          <CCol xs="auto">
       <CFormCheck
            label="Delete"
            checked={perm.allow_delete}
            onChange={() => handleCheckboxChange(index, 'allow_delete')}
           />
          </CCol>
         </CRow>
        )}
       </div>
      ))}

      <div className="text-end mt-4">
       <CButton color="primary" onClick={handleSubmit}>
        Simpan
       </CButton>
      </div>
     </CForm>
    </CCardBody>
   </CCard>
  </CContainer>
 );
};

export default TambahRole;