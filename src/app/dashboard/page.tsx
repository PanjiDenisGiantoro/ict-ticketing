"use client"

import { useState, useEffect, useCallback } from "react"
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
  Loader2,
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
import { useBreakpoint } from "@/hooks/use-breakpoint"
import Link from "next/link"

type DashboardData = {
  total: number
  statusMap: Record<string, number>
  prioritasMap: Record<string, number>
  aplikasiData: { name: string; value: number; color: string; max: number }[]
  recentTickets: {
    id: number
    ticket_id: string
    tanggal: string
    jam: string
    nama_pelapor: string
    departemen: string
    aplikasi: string
    tipe: string
    judul: string
    status: string
    prioritas: string
  }[]
  lastEntry: {
    ticket_id: string
    nama_pelapor: string
    aplikasi: string
    tipe: string
    tanggal: string
    jam: string
    judul: string
    status: string
    prioritas: string
  } | null
  trendData: { date: string; value: number }[]
}

const quickActions = [
  { label: "Input Kendala", icon: FilePlus, bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", href: "/dashboard/input-kendala" },
  { label: "My Ticket", icon: Ticket, bg: "#ecfdf5", color: "#059669", border: "#a7f3d0", href: "/dashboard/my-ticket" },
  { label: "Download Report", icon: Download, bg: "#fffbeb", color: "#d97706", border: "#fde68a", href: "/dashboard/download-report" },
  { label: "List Kendala", icon: LayoutDashboard, bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe", href: "/dashboard/list-kendala" },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    OPEN: { bg: "#f0f9ff", color: "#0369a1", border: "#bae6fd" },
    "IN PROGRESS": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    RESOLVED: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
    ESCALATED: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
    CLOSED: { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" },
  }
  const s = styles[status] ?? { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" }
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
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
    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {priority}
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

export default function DashboardPage() {
  const bp = useBreakpoint()
  const isMobile = bp === "mobile"
  const isTablet = bp === "tablet"
  const isCompact = isMobile || isTablet

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/dashboard")
      const json = await res.json()
      setData(json)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const total = data?.total ?? 0
  const inProgress = (data?.statusMap?.["IN PROGRESS"] ?? 0) + (data?.statusMap?.["OPEN"] ?? 0)
  const resolved = data?.statusMap?.["RESOLVED"] ?? 0
  const escalated = data?.statusMap?.["ESCALATED"] ?? 0

  const statCards = [
    { label: "TOTAL KENDALA", value: total, sub: "Semua Kendala", icon: ClipboardList, iconBg: "#eff6ff", iconColor: "#2563eb", borderColor: "#bfdbfe" },
    { label: "IN PROGRESS", value: inProgress, sub: "Sedang Diproses", icon: Clock, iconBg: "#fffbeb", iconColor: "#d97706", borderColor: "#fde68a" },
    { label: "RESOLVED", value: resolved, sub: "Selesai", icon: CheckCircle2, iconBg: "#ecfdf5", iconColor: "#059669", borderColor: "#a7f3d0" },
    { label: "ESCALATED", value: escalated, sub: "Perlu Perhatian", icon: AlertTriangle, iconBg: "#fff1f2", iconColor: "#e11d48", borderColor: "#fecdd3" },
  ]

  const donutData = [
    { name: "In Progress", value: inProgress, color: "#f59e0b" },
    { name: "Resolved", value: resolved, color: "#10b981" },
    { name: "Escalated", value: escalated, color: "#ef4444" },
  ]

  const highCount = data?.prioritasMap?.["HIGH"] ?? 0
  const mediumCount = data?.prioritasMap?.["MEDIUM"] ?? 0
  const lowCount = data?.prioritasMap?.["LOW"] ?? 0
  const prioritasData = [
    { name: "High", value: highCount, color: "#ef4444" },
    { name: "Medium", value: mediumCount, color: "#f59e0b" },
    { name: "Low", value: lowCount, color: "#10b981" },
  ]

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <Loader2 style={{ width: 32, height: 32, color: "#94a3b8", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: "100%" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Monitoring seluruh kendala dan tiket pada sistem ICT
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={fetchDashboard}
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
      <div style={{ display: "flex", flexDirection: isCompact ? "column" : "row", gap: 16, alignItems: "flex-start" }}>

        {/* Left column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0, width: "100%" }}>

          {/* Stat cards */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {statCards.map((card) => (
              <div
                key={card.label}
                style={{
                  flex: isCompact ? "1 1 calc(50% - 6px)" : 1,
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
                  <div style={{ padding: 10, borderRadius: 10, backgroundColor: card.iconBg, border: `1px solid ${card.borderColor}` }}>
                    <card.icon style={{ width: 18, height: 18, color: card.iconColor }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ backgroundColor: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: 0 }}>
                DATA KENDALA TERBARU
              </h2>
              <Link href="/dashboard/list-kendala" style={{ fontSize: 10, color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>
                Lihat Semua →
              </Link>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                    {["ID Ticket", "Tanggal", "User", "Aplikasi", "Kendala", "Status", "Prioritas"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "9px 14px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.recentTickets ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 30, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>Belum ada data</td>
                    </tr>
                  ) : (
                    (data?.recentTickets ?? []).map((t, i) => (
                      <tr key={t.id} style={{ borderBottom: i < (data?.recentTickets.length ?? 0) - 1 ? "1px solid #f8fafc" : "none" }}>
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
                        <td style={{ padding: "10px 14px", maxWidth: 180 }}>
                          <span style={{ color: "#475569", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {t.judul}
                          </span>
                        </td>
                        <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                          <StatusBadge status={t.status} />
                        </td>
                        <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                          <PriorityBadge priority={t.prioritas} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom charts */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {/* Bar chart (KENDALA PER APLIKASI) */}
            <div style={{ flex: "1 1 280px", backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>
                  Kendala Per Aplikasi
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(data?.aplikasiData ?? []).length === 0 ? (
                  <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", padding: 20 }}>Belum ada data</p>
                ) : (
                  (data?.aplikasiData ?? []).map((d) => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, color: "#64748b", width: 90, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {d.name}
                      </span>
                      <div style={{ flex: 1, backgroundColor: "#f1f5f9", borderRadius: 999, height: 8 }}>
                        <div style={{ width: `${(d.value / d.max) * 100}%`, height: 8, borderRadius: 999, backgroundColor: d.color }} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#374151", width: 20, textAlign: "right", flexShrink: 0 }}>
                        {d.value}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Line chart (TREND KENDALA) */}
            <div style={{ flex: "1 1 280px", backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>
                  Trend Kendala (7 Hari Terakhir)
                </h3>
              </div>
              {(data?.trendData ?? []).length === 0 ? (
                <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", padding: 20 }}>Belum ada data</p>
              ) : (
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={data?.trendData ?? []} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: isCompact ? "100%" : 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Statistik Kendala */}
          <div style={{ backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 12px" }}>
              Statistik Kendala
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" fontSize={22} fontWeight="bold" fill="#1e293b">
                  {total}
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
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>({total > 0 ? Math.round((d.value / total) * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Last Entry */}
          <div style={{ backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>
                Last Entry
              </h3>
              <Link href="/dashboard/list-kendala" style={{ fontSize: 10, color: "#2563eb", textDecoration: "none" }}>
                Lihat Semua
              </Link>
            </div>
            {data?.lastEntry ? (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, backgroundColor: "#eff6ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ClipboardList style={{ width: 16, height: 16, color: "#3b82f6" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", margin: "0 0 2px" }}>{data.lastEntry.ticket_id}</p>
                    <p style={{ fontSize: 10, color: "#64748b", margin: 0, lineHeight: 1.4 }}>{data.lastEntry.judul}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "User", value: data.lastEntry.nama_pelapor },
                    { label: "Aplikasi", value: `${data.lastEntry.aplikasi} ${data.lastEntry.tipe}`.trim() },
                    { label: "Tanggal", value: `${formatDate(data.lastEntry.tanggal)} ${formatTime(data.lastEntry.jam)}` },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>{row.label}</span>
                      <span style={{ fontSize: 10, color: "#374151", fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>Status</span>
                    <StatusBadge status={data.lastEntry.status} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>Prioritas</span>
                    <PriorityBadge priority={data.lastEntry.prioritas} />
                  </div>
                </div>
              </>
            ) : (
              <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", padding: 10 }}>Belum ada data</p>
            )}
          </div>

          {/* Aksi Cepat */}
          <div style={{ backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374141", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 12px" }}>
              Aksi Cepat
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
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
                    textDecoration: "none",
                  }}
                >
                  <a.icon style={{ width: 18, height: 18, color: a.color }} />
                  <span style={{ fontSize: 9, fontWeight: 600, color: a.color, textAlign: "center", lineHeight: 1.2 }}>
                    {a.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Kendala Per Prioritas */}
          <div style={{ backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 12px" }}>
              Kendala Per Prioritas
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flexShrink: 0 }}>
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie data={prioritasData} cx="50%" cy="50%" innerRadius={28} outerRadius={44} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                      {prioritasData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight="bold" fill="#1e293b">
                      {total}
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
                      {d.value} ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
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
