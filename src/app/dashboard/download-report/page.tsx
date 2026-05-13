"use client"

import { useState } from "react"
import { Download, FileText, FileSpreadsheet, Calendar, ChevronDown, CheckCircle2, Clock } from "lucide-react"

const reportTypes = [
  { id: "summary", title: "Laporan Summary Kendala", desc: "Rekap total kendala, status, dan trend bulanan", icon: FileText, formats: ["PDF", "Excel"] },
  { id: "detail", title: "Laporan Detail Kendala", desc: "Data lengkap setiap tiket kendala beserta penanganan", icon: FileSpreadsheet, formats: ["Excel", "CSV"] },
  { id: "sla", title: "Laporan SLA & Response Time", desc: "Analisis pemenuhan SLA dan waktu penanganan", icon: FileText, formats: ["PDF", "Excel"] },
  { id: "aplikasi", title: "Laporan Per Aplikasi", desc: "Breakdown kendala berdasarkan aplikasi", icon: FileSpreadsheet, formats: ["PDF", "Excel"] },
  { id: "departemen", title: "Laporan Per Departemen", desc: "Rekap kendala berdasarkan unit/departemen", icon: FileText, formats: ["PDF", "Excel"] },
  { id: "user", title: "Laporan Per User", desc: "History tiket per user / pelapor", icon: FileSpreadsheet, formats: ["Excel", "CSV"] },
]

const downloadHistory = [
  { name: "Laporan Summary - April 2025", format: "PDF", size: "1.2 MB", date: "28/04/2025 10:30", status: "ready" },
  { name: "Laporan Detail Kendala - Q1 2025", format: "Excel", size: "3.4 MB", date: "02/04/2025 09:15", status: "ready" },
  { name: "Laporan SLA - Maret 2025", format: "PDF", size: "0.8 MB", date: "01/04/2025 08:00", status: "ready" },
  { name: "Laporan Per Aplikasi - Q1 2025", format: "Excel", size: "2.1 MB", date: "31/03/2025 15:45", status: "processing" },
]

export default function DownloadReportPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState<string | null>(null)

  const handleGenerate = (id: string) => {
    setGenerating(id)
    setTimeout(() => setGenerating(null), 2000)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>Download Report</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Generate dan unduh laporan kendala ICT</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Left: report generator */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Date range filter */}
          <div style={{ backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 14px" }}>Filter Periode</h3>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 4 }}>Dari Tanggal</label>
                <input type="date" defaultValue="2025-04-01" style={{ padding: "7px 10px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none" }} />
              </div>
              <div style={{ paddingTop: 20 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>s/d</span>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 4 }}>Sampai Tanggal</label>
                <input type="date" defaultValue="2025-04-28" style={{ padding: "7px 10px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 4 }}>Periode Cepat</label>
                <div style={{ position: "relative" }}>
                  <select style={{ appearance: "none", padding: "7px 28px 7px 10px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none", cursor: "pointer" }}>
                    {["Bulan Ini", "Bulan Lalu", "3 Bulan Terakhir", "6 Bulan Terakhir", "Tahun Ini"].map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: "#94a3b8", pointerEvents: "none" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Report type selection */}
          <div style={{ backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 14px" }}>Pilih Jenis Laporan</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {reportTypes.map((rpt) => (
                <div
                  key={rpt.id}
                  onClick={() => setSelected(rpt.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: 14,
                    borderRadius: 10,
                    border: `2px solid ${selected === rpt.id ? "#3b82f6" : "#f1f5f9"}`,
                    backgroundColor: selected === rpt.id ? "#eff6ff" : "#fafafa",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: selected === rpt.id ? "#bfdbfe" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <rpt.icon style={{ width: 18, height: 18, color: selected === rpt.id ? "#2563eb" : "#64748b" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: selected === rpt.id ? "#1d4ed8" : "#374151", margin: "0 0 2px" }}>{rpt.title}</p>
                    <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{rpt.desc}</p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {rpt.formats.map((fmt) => (
                      <span key={fmt} style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: "#f1f5f9", color: "#64748b" }}>
                        {fmt}
                      </span>
                    ))}
                  </div>
                  {selected === rpt.id && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <div style={{ position: "relative" }}>
                        <select
                          value={selectedFormat[rpt.id] || rpt.formats[0]}
                          onChange={(e) => { e.stopPropagation(); setSelectedFormat((prev) => ({ ...prev, [rpt.id]: e.target.value })) }}
                          onClick={(e) => e.stopPropagation()}
                          style={{ appearance: "none", padding: "5px 24px 5px 8px", fontSize: 11, fontWeight: 600, border: "1px solid #bfdbfe", borderRadius: 6, color: "#1d4ed8", backgroundColor: "#eff6ff", outline: "none", cursor: "pointer" }}
                        >
                          {rpt.formats.map((f) => <option key={f}>{f}</option>)}
                        </select>
                        <ChevronDown style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 11, height: 11, color: "#2563eb", pointerEvents: "none" }} />
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleGenerate(rpt.id) }}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", fontSize: 11, fontWeight: 600, color: "white", backgroundColor: generating === rpt.id ? "#93c5fd" : "#2563eb", border: "none", borderRadius: 7, cursor: "pointer" }}
                      >
                        {generating === rpt.id ? <><Clock style={{ width: 12, height: 12 }} /> Proses...</> : <><Download style={{ width: 12, height: 12 }} /> Unduh</>}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: download history */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 14px" }}>Riwayat Download</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {downloadHistory.map((item, i) => (
                <div key={i} style={{ padding: 12, backgroundColor: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#374151", margin: 0, lineHeight: 1.3 }}>{item.name}</p>
                    {item.status === "ready"
                      ? <button style={{ padding: "3px 8px", fontSize: 10, fontWeight: 600, color: "#059669", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 6, cursor: "pointer", flexShrink: 0, marginLeft: 8, display: "flex", alignItems: "center", gap: 3 }}>
                          <Download style={{ width: 10, height: 10 }} /> Unduh
                        </button>
                      : <span style={{ fontSize: 10, color: "#d97706", backgroundColor: "#fffbeb", border: "1px solid #fde68a", padding: "2px 6px", borderRadius: 999, flexShrink: 0, marginLeft: 8 }}>Processing</span>
                    }
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{item.format}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>·</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{item.size}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>·</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
