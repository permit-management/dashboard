import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CSpinner,
  CFormInput,
  CFormSelect,
  CAlert,
} from "@coreui/react";

const API_BASE = "/api/v1";

const statusColors = {
  "In Progress": "secondary",
  Active: "success",
  Rejected: "danger",
  Expired: "warning",
};

const Permit = () => {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const fetchPermits = async () => {
    try {
      const response = await fetch(`${API_BASE}/permit/permits`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const result = await response.json();
      console.log("API response:", result); // 👈 debug

      if (Array.isArray(result)) {
        setPermits(result);
      } else if (Array.isArray(result.data)) {
        setPermits(result.data);
      } else {
        setError("Format data tidak sesuai");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data dari server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  const filteredPermits = permits.filter((item) => {
    return (
      String(item.permit_number || item.id || "")
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (statusFilter === "" || item.status === statusFilter)
    );
  });

  const renderStatus = (status) => (
    <span className="d-flex align-items-center gap-1">
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          display: "inline-block",
          backgroundColor: `var(--cui-${statusColors[status] || "secondary"
            })`,
        }}
      ></span>
      {status}
    </span>
  );

  return (
    <CContainer fluid>
      <CRow className="mb-3">
        <CCol>
          <h4 className="fw-bold">Permit</h4>
          <p className="text-medium-emphasis">
            Create new approval settings in this section for User (Custodian)
          </p>
        </CCol>
      </CRow>

      {/* Summary Cards */}
      <CRow className="mb-4 text-center">
        {["In Progress", "Active", "Rejected", "Expired"].map((status) => (
          <CCol key={status}>
            <CCard
              className={`border-start-4 border-start-${statusColors[status]
                } bg-light`}
            >
              <CCardBody className="py-3">
                <h4 className="fw-bold mb-1">
                  {permits.filter((p) => p.status === status).length}
                </h4>
                <span>{status}</span>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Filter */}
      <CRow className="mb-3">
        <CCol md={6}></CCol>
        <CCol md={3}>
          <CFormInput
            size="sm"
            placeholder="Permit number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CCol>
        <CCol md={3}>
          <CFormSelect
            size="sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Active">Active</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {/* Table */}
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="fw-semibold">Permit List</CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError("")}>
              {error}
            </CAlert>
          )}

          <Table striped bordered hover responsive style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Permit Number</th>
                <th>Submit Date</th>
                <th>Work Name</th>
                <th>Status</th>
                <th style={{ width: "100px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    <CSpinner size="sm" color="primary" /> Loading...
                  </td>
                </tr>
              ) : filteredPermits.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredPermits.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <a
                        href="#"
                        className="text-primary text-decoration-none"
                      >
                        {item.permit_number || item.id}
                      </a>
                    </td>
                    <td>{item.submit_date || "-"}</td>
                    <td>{item.work_name || "-"}</td>
                    <td>{renderStatus(item.status || "In Progress")}</td>
                    <td>
                      <Link to={`/DetailPermit/${item.id}`}>
                        <button className="btn btn-link text-primary p-0">
                          Detail
                        </button>
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

export default Permit;
