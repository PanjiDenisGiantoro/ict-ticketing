"use client"

import {
  RefreshCw,
  Calendar,
  ChevronDown,
  TrendingUp,
  LayoutDashboard,
  Search,
  Filter,
  MoreVertical,
  FilePlus,
  Ticket,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ClipboardList,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"

// ── Mock Data ──────────────────────────────────────────────────────────────

const statCards = [
  {
    label: "TOTAL KENDALA",
    value: 128,
    sub: "Semua Kendala",
    trend: "+12% dari periode lalu",
    icon: ClipboardList,
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
    borderColor: "#bfdbfe",
  },
  {
    label: "IN PROGRESS",
    value: 45,
    sub: "Sedang Diproses",
    trend: "+8% dari periode lalu",
    icon: Clock,
    iconBg: "#fffbeb",
    iconColor: "#d97706",
    borderColor: "#fde68a",
  },
  {
    label: "RESOLVED",
    value: 72,
    sub: "Selesai",
    trend: "+15% dari periode lalu",
    icon: CheckCircle2,
    iconBg: "#ecfdf5",
    iconColor: "#059669",
    borderColor: "#a7f3d0",
  },
  {
    label: "ESCALATED",
    value: 11,
    sub: "Perlu Perhatian",
    trend: "+5% dari periode lalu",
    icon: AlertTriangle,
    iconBg: "#fff1f2",
    iconColor: "#e11d48",
    borderColor: "#fecdd3",
  },
]

const donutData = [
  { name: "In Progress", value: 45, color: "#f59e0b" },
  { name: "Resolved", value: 72, color: "#10b981" },
  { name: "Escalated", value: 11, color: "#ef4444" },
]

const tickets = [
  {
    id: "ICT-2025-00128",
    tanggal: "28/04/2025",
    jam: "10:24 AM",
    user: "AJ ZARKASIH",
    dept: "ICT TICKETING",
    aplikasi: "LST_CASE",
    tipeAplikasi: "Mobile",
    kendala: "Tidak bisa login aplikasi LST_CASE Mobile",
    status: "IN PROGRESS",
    prioritas: "HIGH",
  },
  {
    id: "ICT-2025-00127",
    tanggal: "28/04/2025",
    jam: "09:45 AM",
    user: "SRI WAHYUNI",
    dept: "Finance",
    aplikasi: "HRIS",
    tipeAplikasi: "Web",
    kendala: "Data tidak tampil pada halaman laporan",
    status: "IN PROGRESS",
    prioritas: "MEDIUM",
  },
  {
    id: "ICT-2025-00126",
    tanggal: "28/04/2025",
    jam: "09:15 AM",
    user: "BAMBANG S.",
    dept: "Operational",
    aplikasi: "E-CLAIM",
    tipeAplikasi: "Web",
    kendala: "Gagal upload dokumen claim",
    status: "RESOLVED",
    prioritas: "MEDIUM",
  },
  {
    id: "ICT-2025-00125",
    tanggal: "27/04/2025",
    jam: "04:30 PM",
    user: "NUR FITRI",
    dept: "Marketing",
    aplikasi: "EMAIL",
    tipeAplikasi: "Microsoft 365",
    kendala: "Tidak bisa mengirim email",
    status: "RESOLVED",
    prioritas: "LOW",
  },
  {
    id: "ICT-2025-00124",
    tanggal: "27/04/2025",
    jam: "02:10 PM",
    user: "EDY SUSANTO",
    dept: "IT Support",
    aplikasi: "VPN",
    tipeAplikasi: "Client",
    kendala: "Koneksi VPN sering terputus",
    status: "IN PROGRESS",
    prioritas: "HIGH",
  },
]

const barData = [
  { name: "LST_CASE Mobile", value: 45, color: "#3b82f6", max: 45 },
  { name: "HRIS", value: 28, color: "#10b981", max: 45 },
  { name: "E-CLAIM", value: 20, color: "#f59e0b", max: 45 },
  { name: "EMAIL", value: 18, color: "#8b5cf6", max: 45 },
  { name: "VPN", value: 17, color: "#ef4444", max: 45 },
]

const trendData = [
  { date: "22/04", value: 15 },
  { date: "23/04", value: 22 },
  { date: "24/04", value: 18 },
  { date: "25/04", value: 30 },
  { date: "26/04", value: 25 },
  { date: "27/04", value: 20 },
  { date: "28/04", value: 28 },
]

const prioritasData = [
  { name: "High", value: 32, color: "#ef4444" },
  { name: "Medium", value: 60, color: "#f59e0b" },
  { name: "Low", value: 36, color: "#10b981" },
]

const quickActions = [
  { label: "Input Kendala", icon: FilePlus, bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  { label: "My Ticket", icon: Ticket, bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" },
  { label: "Download Report", icon: Download, bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  { label: "Dashboard", icon: LayoutDashboard, bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" },
]

// ── Status / Priority Badges ───────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    "IN PROGRESS": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    RESOLVED: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
    ESCALATED: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
  }
  const s = styles[status] ?? { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" }
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 999,
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    HIGH: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
    MEDIUM: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
    LOW: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
  }
  const s = styles[priority] ?? { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" }
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 999,
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {priority}
    </span>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: "100%" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Monitoring seluruh kendala dan tiket pada sistem ICT
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#475569",
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <Calendar style={{ width: 14, height: 14, color: "#94a3b8" }} />
            <span>01/04/2025 - 28/04/2025</span>
            <ChevronDown style={{ width: 13, height: 13, color: "#94a3b8" }} />
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "white",
              backgroundColor: "#2563eb",
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              fontWeight: 600,
            }}
          >
            <RefreshCw style={{ width: 13, height: 13 }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

        {/* ── Left column ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>

          {/* Stat cards — 4 in a row using flex */}
          <div style={{ display: "flex", gap: 12 }}>
            {statCards.map((card) => (
              <div
                key={card.label}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 16,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>
                      {card.label}
                    </p>
                    <p style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", margin: "4px 0 2px" }}>
                      {card.value}
                    </p>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{card.sub}</p>
                  </div>
                  <div
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: card.iconBg,
                      border: `1px solid ${card.borderColor}`,
                    }}
                  >
                    <card.icon style={{ width: 18, height: 18, color: card.iconColor }} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <TrendingUp style={{ width: 12, height: 12, color: "#10b981" }} />
                  <span style={{ fontSize: 10, color: "#10b981", fontWeight: 500 }}>{card.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              border: "1px solid #f1f5f9",
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: 0 }}>
                DATA KENDALA TERBARU
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    color: "#475569",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  <Filter style={{ width: 12, height: 12 }} />
                  Semua Status
                  <ChevronDown style={{ width: 11, height: 11 }} />
                </button>
                <div style={{ position: "relative" }}>
                  <Search
                    style={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 13,
                      height: 13,
                      color: "#94a3b8",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Cari ticket..."
                    style={{
                      paddingLeft: 26,
                      paddingRight: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontSize: 11,
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      color: "#475569",
                      outline: "none",
                      width: 140,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                    {["ID Ticket", "Tanggal", "User", "Aplikasi", "Kendala", "Status", "Prioritas", "Aksi"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "9px 14px",
                          fontSize: 10,
                          fontWeight: 600,
                          color: "#94a3b8",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, i) => (
                    <tr
                      key={t.id}
                      style={{
                        borderBottom: i < tickets.length - 1 ? "1px solid #f8fafc" : "none",
                      }}
                    >
                      <td style={{ padding: "10px 14px", color: "#2563eb", fontWeight: 600, whiteSpace: "nowrap" }}>
                        {t.id}
                      </td>
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
                        <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>{t.tipeAplikasi}</div>
                      </td>
                      <td style={{ padding: "10px 14px", maxWidth: 180 }}>
                        <span style={{ color: "#475569", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {t.kendala}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <StatusBadge status={t.status} />
                      </td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <PriorityBadge priority={t.prioritas} />
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <button style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}>
                          <MoreVertical style={{ width: 15, height: 15 }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>Menampilkan 1 - 5 dari 128 data</p>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {["‹", "1", "2", "3", "...", "26", "›"].map((p, i) => (
                  <button
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      backgroundColor: p === "1" ? "#2563eb" : "transparent",
                      color: p === "1" ? "white" : "#64748b",
                      fontWeight: p === "1" ? 600 : 400,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom charts — 2 in a row using flex */}
          <div style={{ display: "flex", gap: 16 }}>
            {/* Bar chart (KENDALA PER APLIKASI) */}
            <div
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                border: "1px solid #f1f5f9",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>
                  Kendala Per Aplikasi
                </h3>
                <button style={{ fontSize: 10, color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>
                  Lihat Semua
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {barData.map((d) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "#64748b", width: 90, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {d.name}
                    </span>
                    <div style={{ flex: 1, backgroundColor: "#f1f5f9", borderRadius: 999, height: 8 }}>
                      <div
                        style={{
                          width: `${(d.value / d.max) * 100}%`,
                          height: 8,
                          borderRadius: 999,
                          backgroundColor: d.color,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#374151", width: 20, textAlign: "right", flexShrink: 0 }}>
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Line chart (TREND KENDALA) */}
            <div
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                border: "1px solid #f1f5f9",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>
                  Trend Kendala
                </h3>
                <button style={{ fontSize: 10, color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>
                  Lihat Semua
                </button>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={trendData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Statistik Kendala */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 12px" }}>
              Statistik Kendala
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" fontSize={22} fontWeight="bold" fill="#1e293b">
                  128
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#64748b">
                  Total
                </text>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              {donutData.map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "#475569" }}>{d.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#1e293b" }}>{d.value}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>({Math.round((d.value / 128) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Last Entry */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>
                Last Entry
              </h3>
              <button style={{ fontSize: 10, color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>
                Lihat Semua
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: "#eff6ff",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ClipboardList style={{ width: 16, height: 16, color: "#3b82f6" }} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", margin: "0 0 2px" }}>ICT-2025-00128</p>
                <p style={{ fontSize: 10, color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                  Tidak bisa login aplikasi LST_CASE Mobile
                </p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "User", value: "AJ ZARKASIH" },
                { label: "Aplikasi", value: "LST_CASE Mobile" },
                { label: "Tanggal", value: "28/04/2025 10:24 AM" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>{row.label}</span>
                  <span style={{ fontSize: 10, color: "#374151", fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#94a3b8" }}>Status</span>
                <span style={{ fontSize: 10, fontWeight: 600, backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: 999 }}>
                  +IN PROGRESS
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#94a3b8" }}>Prioritas</span>
                <span style={{ fontSize: 10, fontWeight: 600, backgroundColor: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3", padding: "2px 8px", borderRadius: 999 }}>
                  +HIGH
                </span>
              </div>
            </div>
          </div>

          {/* Aksi Cepat */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 12px" }}>
              Aksi Cepat
            </h3>
            {/* 2x2 grid using flex wrap */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  style={{
                    width: "calc(50% - 4px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: "12px 8px",
                    borderRadius: 10,
                    border: `1px solid ${a.border}`,
                    backgroundColor: a.bg,
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <a.icon style={{ width: 18, height: 18, color: a.color }} />
                  <span style={{ fontSize: 9, fontWeight: 600, color: a.color, textAlign: "center", lineHeight: 1.2 }}>
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Kendala Per Prioritas */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 12px" }}>
              Kendala Per Prioritas
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flexShrink: 0 }}>
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie
                      data={prioritasData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={44}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {prioritasData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight="bold" fill="#1e293b">
                      128
                    </text>
                    <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#64748b">
                      Total
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                {prioritasData.map((d) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: d.color }} />
                      <span style={{ fontSize: 10, color: "#475569" }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}>
                      {d.value} ({Math.round((d.value / 128) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
