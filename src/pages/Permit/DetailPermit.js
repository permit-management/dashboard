import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CFormInput,
  CButton,
  CSpinner,
  CAlert,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";

const API_BASE = "/api/v1";

const DetailPermit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permit, setPermit] = useState(null);
  const [custodians, setCustodians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch detail permit
  const fetchPermitDetail = async () => {
    try {
      const response = await fetch(`${API_BASE}/permit/permits/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Gagal fetch data permit");
      const result = await response.json();
      setPermit(result.data);

      // 🔹 Ambil data custodian berdasarkan approval di work_type
      const { approval_1, approval_2, approval_3 } = result.data.work_type || {};
      const custodianIds = [approval_1, approval_2, approval_3].filter(Boolean);

      if (custodianIds.length > 0) {
        const custodianPromises = custodianIds.map((cid) =>
          fetch(`${API_BASE}permit/users/${cid}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => data?.data || null)
            .catch(() => null)
        );
        const custodianData = await Promise.all(custodianPromises);
        setCustodians(custodianData.filter((c) => c !== null));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermitDetail();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" /> Loading...
      </div>
    );

  if (error)
    return (
      <CAlert color="danger" className="mt-3">
        {error}
      </CAlert>
    );

  if (!permit) return null;

  return (
    <CContainer fluid>
      <CRow className="mb-3">
        <CCol>
          <h4 className="fw-bold">Detail Permit</h4>
          <p className="text-medium-emphasis">
            On this page, you can view comprehensive details of permit.
          </p>
        </CCol>
      </CRow>

      {/* Permit Data */}
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="fw-semibold">Permit Data</CCardHeader>
        <CCardBody>
          <CRow className="mb-2">
            <CCol md={6}>
              <CFormInput
                label="Permit Number"
                value={permit.permit_number}
                readOnly
              />
            </CCol>
            <CCol md={6}>
              <CFormInput label="Work Name" value={permit.work_name} readOnly />
            </CCol>
          </CRow>

          <CRow className="mb-2">
            <CCol md={6}>
              <CFormInput
                label="Work Type"
                value={permit.work_type?.work_type || "-"}
                readOnly
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label="Custodian 1"
                value={custodians[0]?.name || "-"}
                readOnly
              />
            </CCol>
          </CRow>

          <CRow className="mb-2">
            <CCol md={6}>
              <CFormInput
                label="Custodian 2"
                value={custodians[1]?.name || "-"}
                readOnly
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label="Custodian 3"
                value={custodians[2]?.name || "-"}
                readOnly
              />
            </CCol>
          </CRow>

          <CRow className="mb-2">
            <CCol md={6}>
              <CFormInput
                label="Work Start"
                value={new Date(permit.working_start).toLocaleDateString()}
                readOnly
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label="Work End"
                value={new Date(permit.working_end).toLocaleDateString()}
                readOnly
              />
            </CCol>
          </CRow>

          <CRow className="mb-2">
            <CCol md={8}>
              <CFormInput
                label="Work Area"
                value={permit.working_area || "-"}
                readOnly
              />
            </CCol>
            <CCol md={4}>
              <CFormInput label="Risk" value={permit.risk} readOnly />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Activities */}
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="fw-semibold">Activities</CCardHeader>
        <CCardBody>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Description</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {permit.activities?.length > 0 ? (
                permit.activities.map((act) => (
                  <CTableRow key={act.id}>
                    <CTableDataCell>
                      {new Date(act.date).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell>{act.description}</CTableDataCell>
                    <CTableDataCell>{act.status}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="3" className="text-center text-muted">
                    No activities data
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Workers */}
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="fw-semibold">List of Workers</CCardHeader>
        <CCardBody>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>NIK</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {permit.workers?.length > 0 ? (
                permit.workers.map((worker, idx) => (
                  <CTableRow key={idx}>
                    <CTableDataCell>{worker.name}</CTableDataCell>
                    <CTableDataCell>{worker.nik}</CTableDataCell>
                    <CTableDataCell>{worker.phone || "-"}</CTableDataCell>
                    <CTableDataCell>{worker.email}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="4" className="text-center text-muted">
                    No worker data
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Approval */}
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="fw-semibold">Approval</CCardHeader>
        <CCardBody>
          {custodians.length > 0 ? (
            custodians.map((c, i) => (
              <CRow key={i} className="mb-3">
                <CCol md={8}>
                  <CFormInput
                    label={`Custodian ${i + 1}`}
                    readOnly
                    value={`${c.name} (${c.email})`}
                  />
                </CCol>
                <CCol md={4} className="d-flex align-items-end gap-2">
                  <CButton color="success">Approve</CButton>
                  <CButton color="danger">Reject</CButton>
                </CCol>
              </CRow>
            ))
          ) : (
            <p className="text-muted">No custodian data</p>
          )}
        </CCardBody>
      </CCard>

      {/* Daily Check-In */}
      <CCard className="mb-5 shadow-sm">
        <CCardHeader className="fw-semibold">Daily Check-In</CCardHeader>
        <CCardBody>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Worker Name</CTableHeaderCell>
                <CTableHeaderCell>10/02/25</CTableHeaderCell>
                <CTableHeaderCell>11/02/25</CTableHeaderCell>
                <CTableHeaderCell>12/02/25</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {permit.workers?.map((worker, idx) => (
                <CTableRow key={idx}>
                  <CTableDataCell>{worker.name}</CTableDataCell>
                  <CTableDataCell>
                    <a href="#" className="text-primary">
                      check
                    </a>
                  </CTableDataCell>
                  <CTableDataCell>
                    <a href="#" className="text-primary">
                      check
                    </a>
                  </CTableDataCell>
                  <CTableDataCell>
                    <a href="#" className="text-primary">
                      check
                    </a>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <div className="d-flex justify-content-end mt-3">
            <CButton color="secondary" onClick={() => navigate(-1)}>
              Back
            </CButton>
            <CButton color="danger" className="ms-2">
              Close Permit
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default DetailPermit;