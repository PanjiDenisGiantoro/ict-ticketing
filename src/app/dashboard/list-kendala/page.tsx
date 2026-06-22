"use client"

import { useState, useEffect, useCallback } from "react"
import { FilePlus, Search, ChevronDown, MoreVertical, Download, Eye, Pencil, Trash2, X, ChevronLeft, ChevronRight, Loader2, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

type Kendala = {
  id: number
  ticket_id: string
  tanggal: string
  jam: string
  nama_pelapor: string
  departemen: string
  aplikasi: string
  tipe: string
  kategori: string
  prioritas: string
  judul: string
  deskripsi: string
  langkah: string
  status: string
}

type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

const statusColor: Record<string, { bg: string; color: string; border: string }> = {
  OPEN: { bg: "#f0f9ff", color: "#0369a1", border: "#bae6fd" },
  "IN PROGRESS": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  RESOLVED: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
  ESCALATED: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
  CLOSED: { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" },
}
const priorityColor: Record<string, { bg: string; color: string; border: string }> = {
  HIGH: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
  MEDIUM: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  LOW: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
}

const aplikasiOptions = ["LST_CASE", "HRIS", "E-CLAIM", "EMAIL", "VPN", "Portal Internal", "SAP"]
const departemenList = ["ICT Ticketing", "Finance", "Operational", "Marketing", "IT Support", "HRD", "Accounting", "Procurement"]
const kategoriList = ["Login / Autentikasi", "Tampilan / UI Error", "Upload / Download File", "Koneksi / Jaringan", "Data Tidak Tampil", "Email Tidak Terkirim", "Performa Lambat", "Bug / Error Sistem", "Lainnya"]
const statusOptions = ["OPEN", "IN PROGRESS", "RESOLVED", "ESCALATED", "CLOSED"]
const prioritasOptions = ["HIGH", "MEDIUM", "LOW"]

function Badge({ label, style: s }: { label: string; style: { bg: string; color: string; border: string } }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {label}
    </span>
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function formatTime(timeStr: string) {
  const parts = timeStr.split(":")
  const h = parseInt(parts[0])
  const m = parts[1]
  const ampm = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  return `${h12}:${m} ${ampm}`
}

export default function ListKendalaPage() {
  const [data, setData] = useState<Kendala[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [aplikasiFilter, setAplikasiFilter] = useState("")
  const [prioritasFilter, setPrioritasFilter] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [openMenu, setOpenMenu] = useState<number | null>(null)

  // Modal states
  const [detailModal, setDetailModal] = useState<Kendala | null>(null)
  const [editModal, setEditModal] = useState<Kendala | null>(null)
  const [deleteModal, setDeleteModal] = useState<Kendala | null>(null)
  const [saving, setSaving] = useState(false)
  const [importModal, setImportModal] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ total: number; inserted: number; updated: number; skipped: number; errors: string[] } | null>(null)
  const [dragging, setDragging] = useState(false)

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", "10")
    if (search) params.set("search", search)
    if (statusFilter) params.set("status", statusFilter)
    if (aplikasiFilter) params.set("aplikasi", aplikasiFilter)
    if (prioritasFilter) params.set("prioritas", prioritasFilter)
    if (startDate) params.set("startDate", startDate)
    if (endDate) params.set("endDate", endDate)

    try {
      const res = await fetch(`/api/kendala?${params.toString()}`)
      const json = await res.json()
      setData(json.data)
      setPagination(json.pagination)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, aplikasiFilter, prioritasFilter, startDate, endDate])

  useEffect(() => {
    const timer = setTimeout(() => fetchData(1), 300)
    return () => clearTimeout(timer)
  }, [fetchData])

  // Close menu when clicking outside
  useEffect(() => {
    const handler = () => setOpenMenu(null)
    if (openMenu !== null) {
      document.addEventListener("click", handler)
      return () => document.removeEventListener("click", handler)
    }
  }, [openMenu])

  const handleDelete = async () => {
    if (!deleteModal) return
    setSaving(true)
    try {
      await fetch(`/api/kendala/${deleteModal.id}`, { method: "DELETE" })
      setDeleteModal(null)
      fetchData(pagination.page)
    } catch { /* ignore */ } finally {
      setSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!editModal) return
    setSaving(true)
    try {
      await fetch(`/api/kendala/${editModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editModal),
      })
      setEditModal(null)
      fetchData(pagination.page)
    } catch { /* ignore */ } finally {
      setSaving(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) return
    setImporting(true)
    setImportResult(null)
    try {
      const formData = new FormData()
      formData.append("file", importFile)
      const res = await fetch("/api/kendala/import", { method: "POST", body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal import")
      setImportResult(json)
      fetchData(1)
    } catch (err) {
      setImportResult({ total: 0, inserted: 0, updated: 0, skipped: 0, errors: [err instanceof Error ? err.message : "Terjadi kesalahan"] })
    } finally {
      setImporting(false)
    }
  }

  const closeImportModal = () => {
    setImportModal(false)
    setImportFile(null)
    setImportResult(null)
    setDragging(false)
  }

  const pageNumbers = () => {
    const pages: (number | string)[] = []
    const tp = pagination.totalPages
    const cp = pagination.page
    if (tp <= 7) {
      for (let i = 1; i <= tp; i++) pages.push(i)
    } else {
      pages.push(1)
      if (cp > 3) pages.push("...")
      for (let i = Math.max(2, cp - 1); i <= Math.min(tp - 1, cp + 1); i++) pages.push(i)
      if (cp < tp - 2) pages.push("...")
      pages.push(tp)
    }
    return pages
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>List Kendala</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Daftar seluruh kendala yang masuk pada sistem ICT</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/api/kendala/template" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#065f46", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 8, padding: "7px 14px", cursor: "pointer", textDecoration: "none", fontWeight: 600 }}>
            <FileSpreadsheet style={{ width: 14, height: 14 }} />
            Template
          </a>
          <button onClick={() => setImportModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#92400e", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}>
            <Upload style={{ width: 14, height: 14 }} />
            Import Excel
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
            <Download style={{ width: 14, height: 14 }} />
            Export
          </button>
          <Link href="/dashboard/input-kendala" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", textDecoration: "none", fontWeight: 600 }}>
            <FilePlus style={{ width: 14, height: 14 }} />
            Input Kendala
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ backgroundColor: "white", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ appearance: "none", fontSize: 12, color: "#475569", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 30px 6px 10px", cursor: "pointer", outline: "none" }}>
              <option value="">Semua Status</option>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: "#94a3b8", pointerEvents: "none" }} />
          </div>

          <div style={{ position: "relative" }}>
            <select value={aplikasiFilter} onChange={(e) => setAplikasiFilter(e.target.value)} style={{ appearance: "none", fontSize: 12, color: "#475569", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 30px 6px 10px", cursor: "pointer", outline: "none" }}>
              <option value="">Semua Aplikasi</option>
              {aplikasiOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: "#94a3b8", pointerEvents: "none" }} />
          </div>

          <div style={{ position: "relative" }}>
            <select value={prioritasFilter} onChange={(e) => setPrioritasFilter(e.target.value)} style={{ appearance: "none", fontSize: 12, color: "#475569", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 30px 6px 10px", cursor: "pointer", outline: "none" }}>
              <option value="">Semua Prioritas</option>
              {prioritasOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: "#94a3b8", pointerEvents: "none" }} />
          </div>

          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ fontSize: 12, color: "#475569", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", outline: "none" }} />
          <span style={{ fontSize: 12, color: "#94a3b8" }}>s/d</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ fontSize: 12, color: "#475569", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", outline: "none" }} />

          <div style={{ position: "relative", marginLeft: "auto" }}>
            <Search style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Cari ticket / user / kendala..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 28, paddingRight: 12, paddingTop: 6, paddingBottom: 6, fontSize: 11, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, color: "#475569", outline: "none", width: 220 }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                {["ID Ticket", "Tanggal", "User", "Aplikasi", "Kendala", "Status", "Prioritas", "Aksi"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: 40, textAlign: "center" }}>
                    <Loader2 style={{ width: 24, height: 24, color: "#94a3b8", animation: "spin 1s linear infinite", margin: "0 auto" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                data.map((t, i) => (
                  <tr key={t.id} style={{ borderBottom: i < data.length - 1 ? "1px solid #f8fafc" : "none" }}>
                    <td style={{ padding: "10px 14px", color: "#2563eb", fontWeight: 600, whiteSpace: "nowrap" }}>{t.ticket_id}</td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <div style={{ color: "#374151", fontWeight: 500 }}>{formatDate(t.tanggal)}</div>
                      <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>{formatTime(t.jam)}</div>
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <div style={{ color: "#374151", fontWeight: 500 }}>{t.nama_pelapor}</div>
                      <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>{t.departemen}</div>
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <div style={{ color: "#374151", fontWeight: 500 }}>{t.aplikasi}</div>
                      <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>{t.tipe}</div>
                    </td>
                    <td style={{ padding: "10px 14px", maxWidth: 200 }}>
                      <span style={{ color: "#475569", lineHeight: 1.4 }}>{t.judul}</span>
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <Badge label={t.status} style={statusColor[t.status] ?? { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" }} />
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <Badge label={t.prioritas} style={priorityColor[t.prioritas] ?? { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" }} />
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ position: "relative" }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === t.id ? null : t.id) }}
                          style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "#94a3b8", borderRadius: 4 }}
                        >
                          <MoreVertical style={{ width: 15, height: 15 }} />
                        </button>
                        {openMenu === t.id && (
                          <div style={{ position: "absolute", right: 0, top: "100%", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: 130 }}>
                            <button onClick={() => { setDetailModal(t); setOpenMenu(null) }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", fontSize: 11, color: "#2563eb", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                              <Eye style={{ width: 13, height: 13 }} /> Lihat Detail
                            </button>
                            <button onClick={() => { setEditModal({ ...t }); setOpenMenu(null) }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", fontSize: 11, color: "#475569", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                              <Pencil style={{ width: 13, height: 13 }} /> Edit
                            </button>
                            <button onClick={() => { setDeleteModal(t); setOpenMenu(null) }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                              <Trash2 style={{ width: 13, height: 13 }} /> Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
            Menampilkan {data.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} data
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchData(pagination.page - 1)}
              style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: 6, cursor: pagination.page <= 1 ? "default" : "pointer", backgroundColor: "transparent", color: pagination.page <= 1 ? "#cbd5e1" : "#64748b" }}
            >
              <ChevronLeft style={{ width: 14, height: 14 }} />
            </button>
            {pageNumbers().map((p, i) =>
              typeof p === "string" ? (
                <span key={`dots-${i}`} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8" }}>...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => fetchData(p)}
                  style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, border: "none", borderRadius: 6, cursor: "pointer", backgroundColor: p === pagination.page ? "#2563eb" : "transparent", color: p === pagination.page ? "white" : "#64748b", fontWeight: p === pagination.page ? 600 : 400 }}
                >
                  {p}
                </button>
              )
            )}
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchData(pagination.page + 1)}
              style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: 6, cursor: pagination.page >= pagination.totalPages ? "default" : "pointer", backgroundColor: "transparent", color: pagination.page >= pagination.totalPages ? "#cbd5e1" : "#64748b" }}
            >
              <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setDetailModal(null)}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Detail Kendala</h2>
                <p style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, margin: "4px 0 0" }}>{detailModal.ticket_id}</p>
              </div>
              <button onClick={() => setDetailModal(null)} style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Nama Pelapor", value: detailModal.nama_pelapor },
                { label: "Departemen", value: detailModal.departemen },
                { label: "Tanggal", value: formatDate(detailModal.tanggal) },
                { label: "Jam", value: formatTime(detailModal.jam) },
                { label: "Aplikasi", value: detailModal.aplikasi },
                { label: "Tipe", value: detailModal.tipe },
                { label: "Kategori", value: detailModal.kategori },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{item.value || "-"}</div>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Status & Prioritas</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Badge label={detailModal.status} style={statusColor[detailModal.status] ?? { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" }} />
                  <Badge label={detailModal.prioritas} style={priorityColor[detailModal.prioritas] ?? { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" }} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Judul</div>
              <div style={{ fontSize: 13, color: "#374151", fontWeight: 600, marginBottom: 12 }}>{detailModal.judul}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Deskripsi</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>{detailModal.deskripsi}</div>
              {detailModal.langkah && (
                <>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Langkah Reproduksi</div>
                  <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{detailModal.langkah}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setEditModal(null)}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Edit Kendala</h2>
                <p style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, margin: "4px 0 0" }}>{editModal.ticket_id}</p>
              </div>
              <button onClick={() => setEditModal(null)} style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FieldInput label="Nama Pelapor" value={editModal.nama_pelapor} onChange={(v) => setEditModal({ ...editModal, nama_pelapor: v })} />
                <FieldSelect label="Departemen" value={editModal.departemen} options={departemenList} onChange={(v) => setEditModal({ ...editModal, departemen: v })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FieldSelect label="Aplikasi" value={editModal.aplikasi} options={aplikasiOptions} onChange={(v) => setEditModal({ ...editModal, aplikasi: v })} />
                <FieldSelect label="Kategori" value={editModal.kategori} options={kategoriList} onChange={(v) => setEditModal({ ...editModal, kategori: v })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FieldSelect label="Status" value={editModal.status} options={statusOptions} onChange={(v) => setEditModal({ ...editModal, status: v })} />
                <FieldSelect label="Prioritas" value={editModal.prioritas} options={prioritasOptions} onChange={(v) => setEditModal({ ...editModal, prioritas: v })} />
              </div>
              <FieldInput label="Judul" value={editModal.judul} onChange={(v) => setEditModal({ ...editModal, judul: v })} />
              <FieldTextarea label="Deskripsi" value={editModal.deskripsi} onChange={(v) => setEditModal({ ...editModal, deskripsi: v })} />
              <FieldTextarea label="Langkah Reproduksi" value={editModal.langkah || ""} onChange={(v) => setEditModal({ ...editModal, langkah: v })} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
              <button onClick={() => setEditModal(null)} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer" }}>
                Batal
              </button>
              <button onClick={handleEdit} disabled={saving} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 8, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setDeleteModal(null)}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Trash2 style={{ width: 24, height: 24, color: "#ef4444" }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>Hapus Kendala?</h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Tiket <strong style={{ color: "#2563eb" }}>{deleteModal.ticket_id}</strong> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer" }}>
                Batal
              </button>
              <button onClick={handleDelete} disabled={saving} style={{ flex: 1, padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: "#ef4444", border: "none", borderRadius: 8, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {importModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={closeImportModal}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Import Data Kendala</h2>
                <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>Upload file Excel untuk import data kendala</p>
              </div>
              <button onClick={closeImportModal} style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Info box */}
            <div style={{ backgroundColor: "#eff6ff", borderRadius: 10, padding: 14, border: "1px solid #bfdbfe", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#1e40af", lineHeight: 1.6 }}>
                <strong>Petunjuk Import:</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 16 }}>
                  <li>Download template terlebih dahulu untuk format yang benar</li>
                  <li>Kolom <strong>ID Ticket</strong> kosong = data baru (auto-generate ID)</li>
                  <li>Kolom <strong>ID Ticket</strong> diisi = update data existing (upsert)</li>
                  <li>Format file: .xlsx atau .xls</li>
                </ul>
              </div>
            </div>

            {!importResult ? (
              <>
                {/* Drop zone */}
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "32px 20px",
                    border: `2px dashed ${dragging ? "#3b82f6" : importFile ? "#a7f3d0" : "#e2e8f0"}`,
                    borderRadius: 10,
                    backgroundColor: dragging ? "#eff6ff" : importFile ? "#f0fdf4" : "#f8fafc",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    marginBottom: 16,
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    const f = e.dataTransfer.files[0]
                    if (f && (f.name.endsWith(".xlsx") || f.name.endsWith(".xls"))) {
                      setImportFile(f)
                    }
                  }}
                >
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) setImportFile(e.target.files[0])
                    }}
                  />
                  {importFile ? (
                    <>
                      <FileSpreadsheet style={{ width: 32, height: 32, color: "#10b981" }} />
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 13, color: "#065f46", margin: "0 0 4px", fontWeight: 600 }}>{importFile.name}</p>
                        <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{(importFile.size / 1024).toFixed(1)} KB - Klik untuk ganti file</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload style={{ width: 32, height: 32, color: dragging ? "#3b82f6" : "#94a3b8" }} />
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 13, color: "#374151", margin: "0 0 4px", fontWeight: 500 }}>Drag & drop file Excel atau klik untuk upload</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Format: .xlsx, .xls</p>
                      </div>
                    </>
                  )}
                </label>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <a href="/api/kendala/template" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "#065f46", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 8, cursor: "pointer", textDecoration: "none" }}>
                    <Download style={{ width: 13, height: 13 }} />
                    Download Template
                  </a>
                  <button onClick={handleImport} disabled={!importFile || importing} style={{ flex: 1, padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: !importFile || importing ? "#94a3b8" : "#2563eb", border: "none", borderRadius: 8, cursor: !importFile || importing ? "default" : "pointer" }}>
                    {importing ? "Mengimport..." : "Import Data"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Import Result */}
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: importResult.errors.length > 0 && importResult.inserted === 0 && importResult.updated === 0 ? "#fff1f2" : "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    {importResult.errors.length > 0 && importResult.inserted === 0 && importResult.updated === 0 ? (
                      <AlertCircle style={{ width: 24, height: 24, color: "#ef4444" }} />
                    ) : (
                      <CheckCircle2 style={{ width: 24, height: 24, color: "#10b981" }} />
                    )}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>
                    {importResult.errors.length > 0 && importResult.inserted === 0 && importResult.updated === 0 ? "Import Gagal" : "Import Selesai"}
                  </h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[
                    { label: "Total", value: importResult.total, color: "#475569", bg: "#f1f5f9" },
                    { label: "Ditambah", value: importResult.inserted, color: "#065f46", bg: "#ecfdf5" },
                    { label: "Diupdate", value: importResult.updated, color: "#1d4ed8", bg: "#eff6ff" },
                    { label: "Dilewati", value: importResult.skipped, color: "#92400e", bg: "#fffbeb" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center", backgroundColor: s.bg, borderRadius: 8, padding: "10px 8px" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {importResult.errors.length > 0 && (
                  <div style={{ backgroundColor: "#fff1f2", borderRadius: 8, padding: 12, border: "1px solid #fecdd3", marginBottom: 16, maxHeight: 150, overflowY: "auto" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#be123c", marginBottom: 6 }}>Error:</div>
                    {importResult.errors.map((err, i) => (
                      <div key={i} style={{ fontSize: 11, color: "#9f1239", lineHeight: 1.5 }}>{err}</div>
                    ))}
                  </div>
                )}

                <button onClick={closeImportModal} style={{ width: "100%", padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 8, cursor: "pointer" }}>
                  Selesai
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", backgroundColor: "white", outline: "none", boxSizing: "border-box" }} />
    </div>
  )
}

function FieldSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", appearance: "none", padding: "8px 30px 8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", backgroundColor: "white", outline: "none", boxSizing: "border-box", cursor: "pointer" }}>
          <option value="">Pilih {label.toLowerCase()}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#94a3b8", pointerEvents: "none" }} />
      </div>
    </div>
  )
}

function FieldTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", backgroundColor: "white", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
    </div>
  )
}