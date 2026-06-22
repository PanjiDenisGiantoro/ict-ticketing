"use client"

import { useState } from "react"
import { FilePlus, MoreVertical, Eye, MessageSquare, RefreshCw, ClipboardList, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import Link from "next/link"

const myTickets = [
  { id: "ICT-2025-00128", tanggal: "28/04/2025", jam: "10:24 AM", aplikasi: "LST_CASE Mobile", kendala: "Tidak bisa login aplikasi LST_CASE Mobile", status: "IN PROGRESS", prioritas: "HIGH", handler: "Budi Santoso" },
  { id: "ICT-2025-00120", tanggal: "25/04/2025", jam: "09:00 AM", aplikasi: "HRIS Web", kendala: "Menu laporan tidak bisa diakses", status: "RESOLVED", prioritas: "MEDIUM", handler: "Rina Wati" },
  { id: "ICT-2025-00115", tanggal: "22/04/2025", jam: "02:15 PM", aplikasi: "VPN Client", kendala: "VPN disconnect setiap 30 menit", status: "RESOLVED", prioritas: "HIGH", handler: "Budi Santoso" },
  { id: "ICT-2025-00108", tanggal: "18/04/2025", jam: "11:00 AM", aplikasi: "EMAIL Microsoft 365", kendala: "Email masuk terlambat lebih dari 2 jam", status: "ESCALATED", prioritas: "HIGH", handler: "Manager IT" },
  { id: "ICT-2025-00095", tanggal: "10/04/2025", jam: "08:30 AM", aplikasi: "E-CLAIM Web", kendala: "Gagal submit form klaim perjalanan", status: "RESOLVED", prioritas: "LOW", handler: "Rina Wati" },
]

const tabs = ["Semua", "IN PROGRESS", "RESOLVED", "ESCALATED"]

const statusStyle: Record<string, { bg: string; color: string; border: string }> = {
  "IN PROGRESS": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  RESOLVED: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
  ESCALATED: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
}
const priorityStyle: Record<string, { bg: string; color: string; border: string }> = {
  HIGH: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
  MEDIUM: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  LOW: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
}

const statCards = [
  { label: "Total Tiket Saya", value: 12, icon: ClipboardList, bg: "#eff6ff", iconColor: "#2563eb", border: "#bfdbfe" },
  { label: "In Progress", value: 1, icon: Clock, bg: "#fffbeb", iconColor: "#d97706", border: "#fde68a" },
  { label: "Resolved", value: 9, icon: CheckCircle2, bg: "#ecfdf5", iconColor: "#059669", border: "#a7f3d0" },
  { label: "Escalated", value: 2, icon: AlertTriangle, bg: "#fff1f2", iconColor: "#e11d48", border: "#fecdd3" },
]

export default function MyTicketPage() {
  const [activeTab, setActiveTab] = useState("Semua")
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filtered = activeTab === "Semua" ? myTickets : myTickets.filter((t) => t.status === activeTab)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>My Ticket</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Tiket kendala yang Anda buat</p>
        </div>
        <Link href="/dashboard/input-kendala" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", textDecoration: "none", fontWeight: 600 }}>
          <FilePlus style={{ width: 14, height: 14 }} />
          Input Kendala
        </Link>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {statCards.map((card) => (
          <div key={card.label} style={{ flex: "1 1 140px", backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: card.bg, border: `1px solid ${card.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <card.icon style={{ width: 20, height: 20, color: card.iconColor }} />
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 }}>{card.value}</p>
              <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={{ backgroundColor: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", padding: "0 16px" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 16px",
                fontSize: 12,
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "#2563eb" : "#64748b",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab ? "#2563eb" : "transparent"}`,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {tab}
              <span style={{ marginLeft: 6, fontSize: 10, backgroundColor: activeTab === tab ? "#eff6ff" : "#f1f5f9", color: activeTab === tab ? "#2563eb" : "#94a3b8", padding: "1px 6px", borderRadius: 999, fontWeight: 600 }}>
                {tab === "Semua" ? myTickets.length : myTickets.filter((t) => t.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                {["ID Ticket", "Tanggal", "Aplikasi", "Kendala", "Status", "Prioritas", "Handler", "Aksi"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f8fafc" : "none" }}>
                  <td style={{ padding: "10px 14px", color: "#2563eb", fontWeight: 600, whiteSpace: "nowrap" }}>{t.id}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <div style={{ color: "#374151", fontWeight: 500 }}>{t.tanggal}</div>
                    <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>{t.jam}</div>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#374151", whiteSpace: "nowrap" }}>{t.aplikasi}</td>
                  <td style={{ padding: "10px 14px", maxWidth: 220 }}>
                    <span style={{ color: "#475569", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{t.kendala}</span>
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: statusStyle[t.status]?.bg, color: statusStyle[t.status]?.color, border: `1px solid ${statusStyle[t.status]?.border}` }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: priorityStyle[t.prioritas]?.bg, color: priorityStyle[t.prioritas]?.color, border: `1px solid ${priorityStyle[t.prioritas]?.border}` }}>
                      {t.prioritas}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#374151", whiteSpace: "nowrap" }}>{t.handler}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button title="Lihat Detail" style={{ padding: 5, border: "1px solid #e2e8f0", borderRadius: 6, background: "white", cursor: "pointer", color: "#2563eb", display: "flex", alignItems: "center" }}>
                        <Eye style={{ width: 13, height: 13 }} />
                      </button>
                      <button title="Komentar" style={{ padding: 5, border: "1px solid #e2e8f0", borderRadius: 6, background: "white", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}>
                        <MessageSquare style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Menampilkan 1 - {filtered.length} dari 12 tiket saya</p>
          <div style={{ display: "flex", gap: 2 }}>
            {["‹", "1", "2", "›"].map((p, i) => (
              <button key={i} style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, border: "none", borderRadius: 6, cursor: "pointer", backgroundColor: p === "1" ? "#2563eb" : "transparent", color: p === "1" ? "white" : "#64748b" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
