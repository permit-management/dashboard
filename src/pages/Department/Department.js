import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import {
  CCard, CCardBody, CCardHeader,
  CContainer, CRow, CCol, CButton,
} from '@coreui/react';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const url = 'https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/departements';

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem('token');
        const res = await fetch(url, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.data ?? [];
        setDepartments(list);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <CContainer fluid>
      <CRow className="mb-3">
        <CCol>
          <h4 className="fw-bold">Department</h4>
          <p className="text-medium-emphasis">
            This page provides master data for department
          </p>
        </CCol>
        <CCol className="text-end">
          <Link to="/TambahDepartment">
            <CButton color="primary">+ Create new department</CButton>
          </Link>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader className="fw-semibold">Daftar Department</CCardHeader>
        <CCardBody>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Department ID</th>
                <th>Department Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && departments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                departments.map((departments) => (
                  <tr key={departments.id}>
                    <td>{departments.departements_id}</td>
                    <td>{departments.departements_name}</td>
                    <td>
                    <Link to={`/DetailDepartment/${departments.id}`}>
                      <button className="btn btn-link p-0 me-2">Detail</button>
                    </Link>
                    <Link to={`/EditDepartment/${departments.id}`}>
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
  );
};

export default Department;