import React, { useEffect, useState } from 'react';
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

const Approval = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const url = '';

  const getDataUsers = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      console.log('Data dari API:', result);

      if (Array.isArray(result)) {
        setUsers(result);
      } else if (Array.isArray(result.data)) {
        setUsers(result.data);
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
    getDataUsers();
  }, []);

  return (
    <CContainer fluid>
      <CRow className="mb-3">
        <CCol>
          <h4 className="fw-bold">Approval</h4>
          <p className="text-medium-emphasis">
            This page provides Approval
          </p>
        </CCol>
        <CCol className="text-end">
          <CButton color="primary">+ Create new user</CButton>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader className='fw-semibold'>Approval</CCardHeader>
        <CCardBody>
          <Table striped bordered hover responsive style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Work Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.number_phone}</td>
                    <td>{user.email}</td>
                    <td>{user.departement_id}</td>
                    <td>{user.role_id}</td>
                    <td>
                      <button className="btn btn-link text-primary p-0 me-2">Detail</button>
                      <button className="btn btn-link text-primary p-0">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default Approval;