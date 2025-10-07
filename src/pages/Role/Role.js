import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CButton,
} from '@coreui/react';

const Role = () => {
  const [roles, setRole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const url = 'https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/roles';

  const getDataRole = async () => {
    try {
      let token= localStorage.getItem('token')
      const response = await fetch(url,{
        headers:{
          'Authorization':'Bearer '+ token
        }
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      console.log('Data dari API:', result);

      if (Array.isArray(result)) {
        setRole(result);
      } else if (Array.isArray(result.data)) {
        setRole(result.data);
      } else {
        setError('Format data tidak sesuai.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Gagal mengambil data dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataRole();
  }, []);

  return (
    <CContainer fluid>
      <CRow className="mb-3">
        <CCol>
          <h4 className="fw-bold">Role</h4>
          <p className="text-medium-emphasis">
            This page provides master data for role 
          </p>
        </CCol>
        <CCol className="text-end">
        <Link to='/TambahRole'>
          <CButton color="primary">+ Create new Role</CButton>
        </Link>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader className='fw-semibold'>Daftar Role</CCardHeader>
        <CCardBody>
          <Table striped bordered hover responsive style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Role ID</th>
                <th>Role Name</th>
                <th>Action</th>
              </tr>
            </thead>
<tbody>
 {!loading && roles.length === 0 ? (
  <tr>
   <td colSpan="7" className="text-center">
    Tidak ada data.
   </td>
  </tr>
 ) : (
  roles.map((role) => (
   <tr key={role.role_id}>
    <td>{role.role_id}</td>
    <td>{role.role_name}</td>
    <td>
     <Link to={`/DetailRole/${role.id}`}>
      <button className="btn btn-link text-primary p-0 me-2">Detail</button>
     </Link>
     <Link to={`/EditRole/${role.id}`}>
      <button className="btn btn-link text-primary p-0">Edit</button>
     </Link>
    </td>
   </tr>
  )) 
 )}
 {error && (
  <tr>
   <td colSpan="7" className="text-center text-danger">
    {error}
   </td>
  </tr>
 )}
</tbody>
          </Table>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default Role;