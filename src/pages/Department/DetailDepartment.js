import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
 CCard, CCardBody, CCardHeader,
 CContainer, CRow, CCol,
 CFormLabel, CFormInput, CButton,
} from '@coreui/react';

const DetailDepartment = () => {
 const { id } = useParams();
 const navigate = useNavigate();
 const [data, setData] = useState(null);
 const [error, setError] = useState(null);

 useEffect(() => {
  const fetchDetail = async () => {
   try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/departements/${id}`, {
     headers: {
      'Authorization': `Bearer ${token}`,
     },
    });

    if (!response.ok) throw new Error('Gagal mengambil data detail department');

    const result = await response.json();
    setData(result);
   } catch (err) {
    setError(err.message);
   }
  };

  fetchDetail();
 }, [id]);

 const handleEdit = () => {
  navigate(`/EditDepartment/${id}`);
 };

 const handleBack = () => {
  navigate('/Department');
 };

 const handleDelete = async () => {
 const confirm = window.confirm('Yakin ingin menghapus department ini?');
  if (!confirm) return;

  try {
   const token = localStorage.getItem('token');
   const res = await fetch(`https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/departements/${id}`, {
    method: 'DELETE',
    headers: {
     'Authorization': `Bearer ${token}`,
    },
   });

   if (!res.ok) throw new Error('Gagal menghapus department');
   alert('Department berhasil dihapus');
   navigate('/Department');
  } catch (error) {
   alert(error.message);
  }
 };

 return (
  <CContainer className="py-4">
   <h5 className="fw-bold mb-1">Detail department</h5>
   <p className="text-medium-emphasis mb-4">
    On this page, you can view comprehensive details of department.
   </p>

   <CCard>
    <CCardHeader className="fw-semibold">Detail Department</CCardHeader>
    <CCardBody>
     {error && (
      <p className="text-danger">{error}</p>
     )}

     {data && (
      <>
       <CRow className="mb-3 align-items-center">
       <CCol md={3}>
       <CFormLabel>Department ID :</CFormLabel>
        </CCol>
        <CCol md={9}>
         <CFormInput value={data.departements_id} disabled />
        </CCol>
       </CRow>

       <CRow className="mb-3 align-items-center">
        <CCol md={3}>
         <CFormLabel>Department Name :</CFormLabel>
       </CCol>
        <CCol md={9}>
         <CFormInput value={data.departements_name} disabled />
        </CCol>
       </CRow>

       <div className="d-flex justify-content-end gap-2">
       <CButton color="secondary" onClick={handleBack}>Back</CButton>
        <CButton color="danger" onClick={handleDelete}>Delete</CButton>
        <CButton color="primary" onClick={handleEdit}>Edit</CButton>
      </div>
      </>
     )}
    </CCardBody>
   </CCard>
  </CContainer>
 );
};

export default DetailDepartment;