"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Download, FileText, FileSpreadsheet, ChevronDown, Clock, Printer, Search, Loader2, FileDown } from "lucide-react"

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
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function formatTime(timeStr: string) {
  const parts = timeStr.split(":")
  const h = parseInt(parts[0])
  const m = parts[1]
  return `${h % 12 || 12}:${m} ${h >= 12 ? "PM" : "AM"}`
}

export default function DownloadReportPage() {
  const [data, setData] = useState<Kendala[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [aplikasiFilter, setAplikasiFilter] = useState("")
  const [prioritasFilter, setPrioritasFilter] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [downloading, setDownloading] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", "20")
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

  const buildExportParams = () => {
    const params = new URLSearchParams()
    if (startDate) params.set("startDate", startDate)
    if (endDate) params.set("endDate", endDate)
    if (statusFilter) params.set("status", statusFilter)
    if (aplikasiFilter) params.set("aplikasi", aplikasiFilter)
    if (prioritasFilter) params.set("prioritas", prioritasFilter)
    return params.toString()
  }

  const handleDownload = (format: string, type: string) => {
    setDownloading(`${type}-${format}`)
    const params = buildExportParams()
    const url = `/api/report?format=${format}&type=${type}${params ? `&${params}` : ""}`
    const link = document.createElement("a")
    link.href = url
    link.download = ""
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => setDownloading(null), 1500)
  }

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const win = window.open("", "_blank")
    if (!win) return

    const filterInfo = [
      startDate && `Dari: ${formatDate(startDate)}`,
      endDate && `Sampai: ${formatDate(endDate)}`,
      statusFilter && `Status: ${statusFilter}`,
      aplikasiFilter && `Aplikasi: ${aplikasiFilter}`,
      prioritasFilter && `Prioritas: ${prioritasFilter}`,
    ].filter(Boolean).join(" | ")

    win.document.write(`<!DOCTYPE html><html><head><title>Laporan Kendala ICT</title><style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; padding: 20px; color: #1e293b; font-size: 11px; }
      .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1e293b; padding-bottom: 12px; }
      .header h1 { font-size: 18px; margin-bottom: 4px; }
      .header p { font-size: 11px; color: #64748b; }
      .filter-info { font-size: 10px; color: #64748b; margin-bottom: 12px; }
      table { width: 100%; border-collapse: collapse; font-size: 10px; }
      th { background: #f1f5f9; padding: 6px 8px; text-align: left; font-weight: 600; border: 1px solid #e2e8f0; white-space: nowrap; }
      td { padding: 5px 8px; border: 1px solid #e2e8f0; vertical-align: top; }
      tr:nth-child(even) { background: #f8fafc; }
      .footer { margin-top: 20px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
      .badge { padding: 1px 6px; border-radius: 999px; font-size: 9px; font-weight: 600; }
      @media print { body { padding: 10px; } }
    </style></head><body>
      <div class="header">
        <h1>LAPORAN KENDALA ICT</h1>
        <p>JNE Express - ICT Ticketing System</p>
      </div>
      ${filterInfo ? `<div class="filter-info">Filter: ${filterInfo}</div>` : ""}
      <div>Total Data: ${pagination.total} kendala</div>
      <br/>
      ${printContent.innerHTML}
      <div class="footer">
        Dicetak pada: ${new Date().toLocaleString("id-ID")} | ICT Ticketing System
      </div>
    </body></html>`)
    win.document.close()
    win.print()
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
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>Download Report</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Generate dan unduh laporan kendala ICT</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}>
            <Printer style={{ width: 14, height: 14 }} />
            Cetak
          </button>
          <button onClick={() => handleDownload("csv", "detail")} disabled={downloading === "detail-csv"} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#065f46", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}>
            <FileText style={{ width: 14, height: 14 }} />
            {downloading === "detail-csv" ? "Mengunduh..." : "Export CSV"}
          </button>
          <button onClick={() => handleDownload("xlsx", "detail")} disabled={downloading === "detail-xlsx"} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#92400e", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}>
            <FileSpreadsheet style={{ width: 14, height: 14 }} />
            {downloading === "detail-xlsx" ? "Mengunduh..." : "Export Excel"}
          </button>
          <button onClick={() => handleDownload("xlsx", "summary")} disabled={downloading === "summary-xlsx"} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#1d4ed8", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}>
            <FileDown style={{ width: 14, height: 14 }} />
            {downloading === "summary-xlsx" ? "Mengunduh..." : "Summary Report"}
          </button>
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
            <input type="text" placeholder="Cari ticket / user..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 28, paddingRight: 12, paddingTop: 6, paddingBottom: 6, fontSize: 11, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, color: "#475569", outline: "none", width: 200 }} />
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 120, backgroundColor: "white", borderRadius: 10, padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#2563eb" }}>{pagination.total}</div>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Total Data</div>
        </div>
        {statusFilter && (
          <div style={{ flex: 1, minWidth: 120, backgroundColor: "white", borderRadius: 10, padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1d4ed8" }}>{pagination.total}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Status: {statusFilter}</div>
          </div>
        )}
        {aplikasiFilter && (
          <div style={{ flex: 1, minWidth: 120, backgroundColor: "white", borderRadius: 10, padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#059669" }}>{pagination.total}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Aplikasi: {aplikasiFilter}</div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div style={{ backgroundColor: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: 0 }}>PREVIEW DATA LAPORAN</h2>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{pagination.total} data ditemukan</span>
        </div>

        <div ref={printRef} style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ textAlign: "center", padding: "9px 10px", fontSize: 10, fontWeight: 600, color: "#94a3b8", width: 36 }}>No</th>
                {["ID Ticket", "Tanggal", "Nama Pelapor", "Dept", "Aplikasi", "Kendala", "Status", "Prioritas"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ padding: 40, textAlign: "center" }}>
                    <Loader2 style={{ width: 24, height: 24, color: "#94a3b8", animation: "spin 1s linear infinite", margin: "0 auto" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Tidak ada data ditemukan</td>
                </tr>
              ) : (
                data.map((t, i) => (
                  <tr key={t.id} style={{ borderBottom: i < data.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <td style={{ padding: "8px 10px", textAlign: "center", color: "#94a3b8", fontSize: 10 }}>{(pagination.page - 1) * pagination.limit + i + 1}</td>
                    <td style={{ padding: "8px 12px", color: "#2563eb", fontWeight: 600, whiteSpace: "nowrap" }}>{t.ticket_id}</td>
                    <td style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>
                      <div style={{ color: "#374151", fontWeight: 500 }}>{formatDate(t.tanggal)}</div>
                      <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 1 }}>{formatTime(t.jam)}</div>
                    </td>
                    <td style={{ padding: "8px 12px", color: "#374151", fontWeight: 500, whiteSpace: "nowrap" }}>{t.nama_pelapor}</td>
                    <td style={{ padding: "8px 12px", color: "#64748b", fontSize: 10, whiteSpace: "nowrap" }}>{t.departemen}</td>
                    <td style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>
                      <div style={{ color: "#374151", fontWeight: 500 }}>{t.aplikasi}</div>
                      <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 1 }}>{t.tipe}</div>
                    </td>
                    <td style={{ padding: "8px 12px", maxWidth: 200 }}>
                      <span style={{ color: "#475569", lineHeight: 1.4, fontSize: 11 }}>{t.judul}</span>
                    </td>
                    <td style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>
                      <Badge label={t.status} style={statusColor[t.status] ?? { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" }} />
                    </td>
                    <td style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>
                      <Badge label={t.prioritas} style={priorityColor[t.prioritas] ?? { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" }} />
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
            <button disabled={pagination.page <= 1} onClick={() => fetchData(pagination.page - 1)} style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, border: "none", borderRadius: 6, cursor: pagination.page <= 1 ? "default" : "pointer", backgroundColor: "transparent", color: pagination.page <= 1 ? "#cbd5e1" : "#64748b" }}>
              ‹
            </button>
            {pageNumbers().map((p, i) =>
              typeof p === "string" ? (
                <span key={`d-${i}`} style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8" }}>...</span>
              ) : (
                <button key={p} onClick={() => fetchData(p)} style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, border: "none", borderRadius: 6, cursor: "pointer", backgroundColor: p === pagination.page ? "#2563eb" : "transparent", color: p === pagination.page ? "white" : "#64748b", fontWeight: p === pagination.page ? 600 : 400 }}>
                  {p}
                </button>
              )
            )}
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => fetchData(pagination.page + 1)} style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, border: "none", borderRadius: 6, cursor: pagination.page >= pagination.totalPages ? "default" : "pointer", backgroundColor: "transparent", color: pagination.page >= pagination.totalPages ? "#cbd5e1" : "#64748b" }}>
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
