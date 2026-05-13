"use client"

import { useState } from "react"
import { FilePlus, Search, Filter, ChevronDown, MoreVertical, Download, Eye, Pencil, Trash2 } from "lucide-react"

const allTickets = [
  { id: "ICT-2025-00128", tanggal: "28/04/2025", jam: "10:24 AM", user: "AJ ZARKASIH", dept: "ICT TICKETING", aplikasi: "LST_CASE", tipe: "Mobile", kendala: "Tidak bisa login aplikasi LST_CASE Mobile", status: "IN PROGRESS", prioritas: "HIGH" },
  { id: "ICT-2025-00127", tanggal: "28/04/2025", jam: "09:45 AM", user: "SRI WAHYUNI", dept: "Finance", aplikasi: "HRIS", tipe: "Web", kendala: "Data tidak tampil pada halaman laporan", status: "IN PROGRESS", prioritas: "MEDIUM" },
  { id: "ICT-2025-00126", tanggal: "28/04/2025", jam: "09:15 AM", user: "BAMBANG S.", dept: "Operational", aplikasi: "E-CLAIM", tipe: "Web", kendala: "Gagal upload dokumen claim", status: "RESOLVED", prioritas: "MEDIUM" },
  { id: "ICT-2025-00125", tanggal: "27/04/2025", jam: "04:30 PM", user: "NUR FITRI", dept: "Marketing", aplikasi: "EMAIL", tipe: "Microsoft 365", kendala: "Tidak bisa mengirim email", status: "RESOLVED", prioritas: "LOW" },
  { id: "ICT-2025-00124", tanggal: "27/04/2025", jam: "02:10 PM", user: "EDY SUSANTO", dept: "IT Support", aplikasi: "VPN", tipe: "Client", kendala: "Koneksi VPN sering terputus", status: "IN PROGRESS", prioritas: "HIGH" },
  { id: "ICT-2025-00123", tanggal: "27/04/2025", jam: "11:05 AM", user: "DEWI RAHAYU", dept: "HRD", aplikasi: "HRIS", tipe: "Web", kendala: "Tidak bisa mengakses modul cuti", status: "ESCALATED", prioritas: "HIGH" },
  { id: "ICT-2025-00122", tanggal: "26/04/2025", jam: "03:20 PM", user: "RENDI PRATAMA", dept: "Finance", aplikasi: "E-CLAIM", tipe: "Web", kendala: "Error saat submit klaim", status: "RESOLVED", prioritas: "MEDIUM" },
  { id: "ICT-2025-00121", tanggal: "26/04/2025", jam: "10:00 AM", user: "LINDA SARI", dept: "Operational", aplikasi: "LST_CASE", tipe: "Mobile", kendala: "Aplikasi crash saat buka menu pengiriman", status: "IN PROGRESS", prioritas: "HIGH" },
]

const statusColor: Record<string, { bg: string; color: string; border: string }> = {
  "IN PROGRESS": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  RESOLVED: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
  ESCALATED: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
}
const priorityColor: Record<string, { bg: string; color: string; border: string }> = {
  HIGH: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
  MEDIUM: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  LOW: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
}

function Badge({ label, style }: { label: string; style: { bg: string; color: string; border: string } }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: style.bg, color: style.color, border: `1px solid ${style.border}`, whiteSpace: "nowrap" }}>
      {label}
    </span>
  )
}

export default function ListKendalaPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Semua Status")
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filtered = allTickets.filter((t) => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) || t.kendala.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "Semua Status" || t.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>List Kendala</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Daftar seluruh kendala yang masuk pada sistem ICT</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
            <Download style={{ width: 14, height: 14 }} />
            Export
          </button>
          <a href="/dashboard/input-kendala" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", textDecoration: "none", fontWeight: 600 }}>
            <FilePlus style={{ width: 14, height: 14 }} />
            Input Kendala
          </a>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ backgroundColor: "white", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Status filter */}
          <div style={{ position: "relative" }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ appearance: "none", fontSize: 12, color: "#475569", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 30px 6px 10px", cursor: "pointer", outline: "none" }}
            >
              {["Semua Status", "IN PROGRESS", "RESOLVED", "ESCALATED"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: "#94a3b8", pointerEvents: "none" }} />
          </div>

          {/* Aplikasi filter */}
          <div style={{ position: "relative" }}>
            <select style={{ appearance: "none", fontSize: 12, color: "#475569", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 30px 6px 10px", cursor: "pointer", outline: "none" }}>
              {["Semua Aplikasi", "LST_CASE", "HRIS", "E-CLAIM", "EMAIL", "VPN"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: "#94a3b8", pointerEvents: "none" }} />
          </div>

          {/* Prioritas filter */}
          <div style={{ position: "relative" }}>
            <select style={{ appearance: "none", fontSize: 12, color: "#475569", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 30px 6px 10px", cursor: "pointer", outline: "none" }}>
              {["Semua Prioritas", "HIGH", "MEDIUM", "LOW"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: "#94a3b8", pointerEvents: "none" }} />
          </div>

          {/* Date range */}
          <input type="date" style={{ fontSize: 12, color: "#475569", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", outline: "none" }} />
          <span style={{ fontSize: 12, color: "#94a3b8" }}>s/d</span>
          <input type="date" style={{ fontSize: 12, color: "#475569", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", outline: "none" }} />

          {/* Search */}
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
                <th style={{ width: 36, padding: "10px 14px" }}>
                  <input type="checkbox" style={{ cursor: "pointer" }} />
                </th>
                {["ID Ticket", "Tanggal", "User", "Aplikasi", "Kendala", "Status", "Prioritas", "Aksi"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.1s" }}>
                  <td style={{ padding: "10px 14px", textAlign: "center" }}>
                    <input type="checkbox" style={{ cursor: "pointer" }} />
                  </td>
                  <td style={{ padding: "10px 14px", color: "#2563eb", fontWeight: 600, whiteSpace: "nowrap" }}>{t.id}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <div style={{ color: "#374151", fontWeight: 500 }}>{t.tanggal}</div>
                    <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>{t.jam}</div>
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <div style={{ color: "#374151", fontWeight: 500 }}>{t.user}</div>
                    <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>{t.dept}</div>
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <div style={{ color: "#374151", fontWeight: 500 }}>{t.aplikasi}</div>
                    <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>{t.tipe}</div>
                  </td>
                  <td style={{ padding: "10px 14px", maxWidth: 200 }}>
                    <span style={{ color: "#475569", lineHeight: 1.4 }}>{t.kendala}</span>
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
                        onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                        style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "#94a3b8", borderRadius: 4 }}
                      >
                        <MoreVertical style={{ width: 15, height: 15 }} />
                      </button>
                      {openMenu === t.id && (
                        <div style={{ position: "absolute", right: 0, top: "100%", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: 130 }}>
                          {[{ icon: Eye, label: "Lihat Detail", color: "#2563eb" }, { icon: Pencil, label: "Edit", color: "#475569" }, { icon: Trash2, label: "Hapus", color: "#ef4444" }].map((action) => (
                            <button key={action.label} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", fontSize: 11, color: action.color, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                              <action.icon style={{ width: 13, height: 13 }} />
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Menampilkan 1 - {filtered.length} dari 128 data</p>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {["‹", "1", "2", "3", "...", "26", "›"].map((p, i) => (
              <button key={i} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, border: "none", borderRadius: 6, cursor: "pointer", backgroundColor: p === "1" ? "#2563eb" : "transparent", color: p === "1" ? "white" : "#64748b", fontWeight: p === "1" ? 600 : 400 }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
