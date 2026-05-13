"use client"

import { Calendar, ChevronDown, Download, TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const monthlyTrend = [
  { bulan: "Jan", total: 42, resolved: 38, escalated: 2 },
  { bulan: "Feb", total: 56, resolved: 49, escalated: 3 },
  { bulan: "Mar", total: 48, resolved: 44, escalated: 1 },
  { bulan: "Apr", total: 72, resolved: 63, escalated: 5 },
  { bulan: "Mei", total: 61, resolved: 55, escalated: 4 },
  { bulan: "Jun", total: 83, resolved: 71, escalated: 6 },
  { bulan: "Jul", total: 77, resolved: 68, escalated: 7 },
  { bulan: "Ags", total: 91, resolved: 80, escalated: 8 },
  { bulan: "Sep", total: 68, resolved: 59, escalated: 5 },
  { bulan: "Okt", total: 95, resolved: 84, escalated: 9 },
  { bulan: "Nov", total: 88, resolved: 77, escalated: 8 },
  { bulan: "Des", total: 128, resolved: 72, escalated: 11 },
]

const byAplikasi = [
  { name: "LST_CASE Mobile", value: 45 },
  { name: "HRIS", value: 28 },
  { name: "E-CLAIM", value: 20 },
  { name: "EMAIL", value: 18 },
  { name: "VPN", value: 17 },
]

const byDept = [
  { dept: "ICT Ticketing", count: 32 },
  { dept: "Finance", count: 26 },
  { dept: "Operational", count: 22 },
  { dept: "Marketing", count: 18 },
  { dept: "HRD", count: 15 },
  { dept: "IT Support", count: 15 },
]

const byPrioritas = [
  { name: "High", value: 32, color: "#ef4444" },
  { name: "Medium", value: 60, color: "#f59e0b" },
  { name: "Low", value: 36, color: "#10b981" },
]

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"]

const summaryCards = [
  { label: "Total Tiket (Bulan Ini)", value: 128, change: "+12%", up: true, sub: "vs bulan lalu" },
  { label: "Rata-rata Waktu Resolve", value: "4.2 jam", change: "-18%", up: false, sub: "lebih cepat" },
  { label: "SLA Terpenuhi", value: "87%", change: "+5%", up: true, sub: "dari target 85%" },
  { label: "User Satisfaction", value: "4.6/5", change: "+0.3", up: true, sub: "dari survei" },
]

export default function ReportsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>Reports</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Analisis dan statistik kendala sistem ICT</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
            <Calendar style={{ width: 14, height: 14, color: "#94a3b8" }} />
            Januari - Desember 2025
            <ChevronDown style={{ width: 12, height: 12, color: "#94a3b8" }} />
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}>
            <Download style={{ width: 13, height: 13 }} />
            Export Laporan
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 12 }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{ flex: 1, backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 8px" }}>{card.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>{card.value}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {card.up
                ? <TrendingUp style={{ width: 12, height: 12, color: "#10b981" }} />
                : <TrendingDown style={{ width: 12, height: 12, color: "#10b981" }} />
              }
              <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>{card.change}</span>
              <span style={{ fontSize: 10, color: "#94a3b8" }}>{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Trend chart — full width */}
      <div style={{ backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: 0 }}>Trend Kendala Bulanan (2025)</h3>
          <div style={{ display: "flex", gap: 12 }}>
            {[{ color: "#3b82f6", label: "Total" }, { color: "#10b981", label: "Resolved" }, { color: "#ef4444", label: "Escalated" }].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: l.color }} />
                <span style={{ fontSize: 10, color: "#64748b" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} />
            <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} />
            <Line type="monotone" dataKey="escalated" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: "#ef4444" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Row of 3 charts */}
      <div style={{ display: "flex", gap: 16 }}>
        {/* By Aplikasi */}
        <div style={{ flex: 1, backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 16px" }}>Kendala Per Aplikasi</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={byAplikasi} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#64748b" }} width={90} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {byAplikasi.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Prioritas */}
        <div style={{ width: 220, backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>Per Prioritas</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={byPrioritas} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                {byPrioritas.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {byPrioritas.map((d) => (
              <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: d.color }} />
                  <span style={{ fontSize: 10, color: "#475569" }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}>{d.value} ({Math.round(d.value / 128 * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Departemen */}
        <div style={{ flex: 1, backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 16px" }}>Kendala Per Departemen</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {byDept.map((d, i) => (
              <div key={d.dept} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "#64748b", width: 90, flexShrink: 0 }}>{d.dept}</span>
                <div style={{ flex: 1, backgroundColor: "#f1f5f9", borderRadius: 999, height: 8 }}>
                  <div style={{ width: `${(d.count / 32) * 100}%`, height: 8, borderRadius: 999, backgroundColor: COLORS[i % COLORS.length] }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#374151", width: 20, textAlign: "right" }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
