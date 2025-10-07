import React, { useEffect, useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
} from "@coreui/react"

const API_BASE = "https://60swqrng-8080.asse.devtunnels.ms/api/v1"

const PermitForm = () => {
  const token = localStorage.getItem("token")
  const [workTypes, setWorkTypes] = useState([])
  const [custodians, setCustodians] = useState({
    approval_1_name: "",
    approval_2_name: "",
    approval_3_name: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    permit_number: "",
    work_name: "",
    work_type_id: null,
    working_start: "",
    working_end: "",
    working_area: "",
    risk: "High",
    submit_date: "",
    jsa_text: "",
    activities: [{ date: "", description: "", status: "Pending" }],
    workers: [{ name: "", nik: "", phone_number: "", email: "" }], // ✅ ubah phone → phone_number
    approval_1: null,
    approval_2: null,
    approval_3: null,
  })

  const updateForm = (patch) => setFormData((prev) => ({ ...prev, ...patch }))

  // fetch work types
  useEffect(() => {
    const fetchWorkTypes = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/permit/work-types`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error(`Failed fetching work types (${res.status})`)
        const payload = await res.json()
        const list = payload?.data ?? payload
        setWorkTypes(Array.isArray(list) ? list : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchWorkTypes()
  }, [token])

  // handle work type change
  const handleWorkTypeChange = async (e) => {
    const id = e.target.value || null
    updateForm({ work_type_id: id })
    if (!id) return

    try {
      const res = await fetch(`${API_BASE}/permit/work-types/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`Failed fetching work type detail (${res.status})`)
      const payload = await res.json()
      console.log("Work type detail response:", payload) // 👈 debug

      const detail = payload?.data ?? payload

      updateForm({
        approval_1: detail.approval_1,
        approval_2: detail.approval_2,
        approval_3: detail.approval_3,
      })

      setCustodians({
        approval_1_name: detail.approval_1_name ?? String(detail.approval_1 ?? ""),
        approval_2_name: detail.approval_2_name ?? String(detail.approval_2 ?? ""),
        approval_3_name: detail.approval_3_name ?? String(detail.approval_3 ?? ""),
      })
    } catch (err) {
      console.error(err)
    }
  }

  // activities
  const updateActivity = (i, patch) => {
    setFormData((prev) => {
      const updated = [...prev.activities]
      updated[i] = { ...updated[i], ...patch }
      return { ...prev, activities: updated }
    })
  }
  const addActivity = () => {
    setFormData((prev) => ({
      ...prev,
      activities: [...prev.activities, { date: "", description: "", status: "Pending" }],
    }))
  }

  // workers
  const updateWorker = (i, patch) => {
    setFormData((prev) => {
      const updated = [...prev.workers]
      updated[i] = { ...updated[i], ...patch }
      return { ...prev, workers: updated }
    })
  }
  const addWorker = () => {
    setFormData((prev) => ({
      ...prev,
      workers: [...prev.workers, { name: "", nik: "", phone_number: "", email: "" }], // ✅ phone_number
    }))
  }

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // ✅ kirim sesuai field backend
    const workersFixed = formData.workers.map((w) => ({
      name: w.name,
      nik: w.nik,
      phone_number: w.phone_number, // ✅ ubah jadi phone_number
      email: w.email,
    }))

    try {
      const response = await fetch(`${API_BASE}/permit/permits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          work_type_id: parseInt(formData.work_type_id),
          submit_date: new Date().toISOString(),
          working_start: new Date(formData.working_start).toISOString(),
          working_end: new Date(formData.working_end).toISOString(),
          activities: formData.activities.map((a) => ({
            ...a,
            date: new Date(a.date).toISOString(),
          })),
          workers: workersFixed, // ✅ pakai versi yang sudah disesuaikan
        }),
      })

      if (!response.ok) {
        const txt = await response.text()
        throw new Error(`Error ${response.status}: ${txt}`)
      }

      const data = await response.json()
      console.log("Permit created:", data)
      alert("Permit berhasil dibuat!")

      // reset form
      setFormData({
        permit_number: "",
        work_name: "",
        work_type_id: null,
        working_start: "",
        working_end: "",
        working_area: "",
        risk: "High",
        submit_date: "",
        jsa_text: "",
        activities: [{ date: "", description: "", status: "Pending" }],
        workers: [{ name: "", nik: "", phone_number: "", email: "" }], // ✅ reset juga
        approval_1: null,
        approval_2: null,
        approval_3: null,
      })
      setCustodians({
        approval_1_name: "",
        approval_2_name: "",
        approval_3_name: "",
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <CContainer>
      <CCard>
        <CCardHeader>Create Permit</CCardHeader>
        <CCardBody>
          {loading && <CSpinner size="sm" />}
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlert>
          )}

          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Permit Number</CFormLabel>
                <CFormInput
                  value={formData.permit_number}
                  onChange={(e) => updateForm({ permit_number: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Work Name</CFormLabel>
                <CFormInput
                  value={formData.work_name}
                  onChange={(e) => updateForm({ work_name: e.target.value })}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Work Type</CFormLabel>
                <CFormSelect value={formData.work_type_id} onChange={handleWorkTypeChange}>
                  <option value="">-- Select work type --</option>
                  {workTypes.map((wt) => (
                    <option key={wt.id} value={wt.id}>
                      {wt.work_type}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol>
                <CFormLabel>Custodian 1</CFormLabel>
                <CFormInput value={custodians.approval_1_name} disabled />
              </CCol>
              <CCol>
                <CFormLabel>Custodian 2</CFormLabel>
                <CFormInput value={custodians.approval_2_name} disabled />
              </CCol>
              <CCol>
                <CFormLabel>Custodian 3</CFormLabel>
                <CFormInput value={custodians.approval_3_name} disabled />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Working Start</CFormLabel>
                <CFormInput
                  type="datetime-local"
                  value={formData.working_start}
                  onChange={(e) => updateForm({ working_start: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Working End</CFormLabel>
                <CFormInput
                  type="datetime-local"
                  value={formData.working_end}
                  onChange={(e) => updateForm({ working_end: e.target.value })}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Working Area</CFormLabel>
                <CFormInput
                  value={formData.working_area}
                  onChange={(e) => updateForm({ working_area: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Risk</CFormLabel>
                <div>
                  {["High", "Mid", "Low"].map((r) => (
                    <CFormCheck
                      key={r}
                      type="radio"
                      name="risk"
                      label={r}
                      value={r}
                      checked={formData.risk === r}
                      onChange={(e) => updateForm({ risk: e.target.value })}
                      inline
                    />
                  ))}
                </div>
              </CCol>
            </CRow>

            {/* Activities */}
            <h6>Activities</h6>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {formData.activities.map((a, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>
                      <CFormInput
                        type="date"
                        value={a.date}
                        onChange={(e) => updateActivity(i, { date: e.target.value })}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        value={a.description}
                        onChange={(e) => updateActivity(i, { description: e.target.value })}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CButton
              color="secondary"
              size="sm"
              className="mt-2 mb-3"
              onClick={addActivity}
            >
              + Add activity
            </CButton>

            {/* Workers */}
            <h6>Workers</h6>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>NIK</CTableHeaderCell>
                  <CTableHeaderCell>Phone Number</CTableHeaderCell> {/* ✅ label disesuaikan */}
                  <CTableHeaderCell>Email</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {formData.workers.map((w, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell>
                      <CFormInput
                        value={w.name}
                        onChange={(e) => updateWorker(i, { name: e.target.value })}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        value={w.nik}
                        onChange={(e) => updateWorker(i, { nik: e.target.value })}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        value={w.phone_number}
                        onChange={(e) => updateWorker(i, { phone_number: e.target.value })} // ✅ disesuaikan
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        value={w.email}
                        onChange={(e) => updateWorker(i, { email: e.target.value })}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CButton
              color="secondary"
              size="sm"
              className="mt-2 mb-3"
              onClick={addWorker}
            >
              + Add worker
            </CButton>

            <div>
              <CButton color="primary" type="submit">
                Submit
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default PermitForm