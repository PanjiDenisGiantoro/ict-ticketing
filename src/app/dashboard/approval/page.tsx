"use client"

import { useState } from "react"
import { Check, X, Eye, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

const pendingTickets = [
  { id: "ICT-2025-00123", tanggal: "27/04/2025", jam: "11:05 AM", user: "DEWI RAHAYU", dept: "HRD", aplikasi: "HRIS Web", kendala: "Tidak bisa mengakses modul cuti karyawan, sudah 2 hari mengganggu proses absensi", prioritas: "HIGH", submittedBy: "Supervisor HRD" },
  { id: "ICT-2025-00119", tanggal: "25/04/2025", jam: "03:40 PM", user: "FAHMI RIDWAN", dept: "Procurement", aplikasi: "SAP", kendala: "Error saat generate PO, berdampak ke proses pengadaan seluruh divisi", prioritas: "HIGH", submittedBy: "Manager Procurement" },
  { id: "ICT-2025-00116", tanggal: "24/04/2025", jam: "10:20 AM", user: "SITI AMINAH", dept: "Finance", aplikasi: "E-CLAIM Web", kendala: "Data klaim bulanan tidak tersinkronisasi dengan sistem akuntansi", prioritas: "MEDIUM", submittedBy: "Kepala Finance" },
]

const approvedTickets = [
  { id: "ICT-2025-00112", tanggal: "22/04/2025", user: "RENDI PRATAMA", aplikasi: "VPN Client", kendala: "VPN tidak bisa digunakan dari luar kantor", prioritas: "HIGH", approvedBy: "AJ ZARKASIH", approvedDate: "22/04/2025 14:30" },
  { id: "ICT-2025-00108", tanggal: "20/04/2025", user: "LINDA SARI", aplikasi: "LST_CASE Mobile", kendala: "Crash saat buka menu pengiriman", prioritas: "MEDIUM", approvedBy: "AJ ZARKASIH", approvedDate: "20/04/2025 09:15" },
]

const rejectedTickets = [
  { id: "ICT-2025-00105", tanggal: "18/04/2025", user: "BAMBANG S.", aplikasi: "Portal Internal", kendala: "Request penambahan fitur baru pada portal", prioritas: "LOW", rejectedBy: "AJ ZARKASIH", reason: "Bukan termasuk kategori kendala teknis. Silahkan melalui jalur feature request." },
]

const tabs = ["Menunggu Approval", "Disetujui", "Ditolak"]
const priorityStyle: Record<string, { bg: string; color: string; border: string }> = {
  HIGH: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
  MEDIUM: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  LOW: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
}

export default function ApprovalPage() {
  const [activeTab, setActiveTab] = useState("Menunggu Approval")
  const [approving, setApproving] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>Approval</h1>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Kelola persetujuan eskalasi kendala dari tim</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Menunggu Approval", value: pendingTickets.length, icon: Clock, bg: "#fffbeb", iconColor: "#d97706", border: "#fde68a" },
          { label: "Disetujui Bulan Ini", value: approvedTickets.length, icon: CheckCircle2, bg: "#ecfdf5", iconColor: "#059669", border: "#a7f3d0" },
          { label: "Ditolak Bulan Ini", value: rejectedTickets.length, icon: XCircle, bg: "#fff1f2", iconColor: "#e11d48", border: "#fecdd3" },
          { label: "Total Eskalasi", value: 11, icon: AlertTriangle, bg: "#f5f3ff", iconColor: "#7c3aed", border: "#ddd6fe" },
        ].map((card) => (
          <div key={card.label} style={{ flex: 1, backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 14 }}>
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
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", padding: "0 16px" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ padding: "12px 16px", fontSize: 12, fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? "#2563eb" : "#64748b", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab ? "#2563eb" : "transparent"}`, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {tab}
              <span style={{ marginLeft: 6, fontSize: 10, backgroundColor: activeTab === tab ? "#eff6ff" : "#f1f5f9", color: activeTab === tab ? "#2563eb" : "#94a3b8", padding: "1px 6px", borderRadius: 999, fontWeight: 600 }}>
                {tab === "Menunggu Approval" ? pendingTickets.length : tab === "Disetujui" ? approvedTickets.length : rejectedTickets.length}
              </span>
            </button>
          ))}
        </div>

        {/* Pending tab */}
        {activeTab === "Menunggu Approval" && (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {pendingTickets.map((t) => (
              <div key={t.id} style={{ border: "1px solid #f1f5f9", borderRadius: 10, padding: 16, backgroundColor: "#fafafa" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb" }}>{t.id}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: priorityStyle[t.prioritas]?.bg, color: priorityStyle[t.prioritas]?.color, border: `1px solid ${priorityStyle[t.prioritas]?.border}` }}>
                      {t.prioritas}
                    </span>
                    <span style={{ fontSize: 10, backgroundColor: "#fffbeb", color: "#92400e", border: "1px solid #fde68a", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>
                      PENDING APPROVAL
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "#065f46", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 7, cursor: "pointer" }}
                      onClick={() => setApproving(t.id)}>
                      <Check style={{ width: 13, height: 13 }} /> Setujui
                    </button>
                    <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "#be123c", backgroundColor: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 7, cursor: "pointer" }}
                      onClick={() => setRejecting(t.id)}>
                      <X style={{ width: 13, height: 13 }} /> Tolak
                    </button>
                    <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", fontSize: 11, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 7, cursor: "pointer" }}>
                      <Eye style={{ width: 13, height: 13 }} /> Detail
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 24, marginBottom: 8 }}>
                  <div><span style={{ fontSize: 10, color: "#94a3b8" }}>User: </span><span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>{t.user} ({t.dept})</span></div>
                  <div><span style={{ fontSize: 10, color: "#94a3b8" }}>Aplikasi: </span><span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>{t.aplikasi}</span></div>
                  <div><span style={{ fontSize: 10, color: "#94a3b8" }}>Tanggal: </span><span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>{t.tanggal} {t.jam}</span></div>
                </div>
                <p style={{ fontSize: 11, color: "#475569", margin: "0 0 6px", lineHeight: 1.5, backgroundColor: "white", padding: "8px 12px", borderRadius: 6, border: "1px solid #f1f5f9" }}>{t.kendala}</p>
                <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>Diajukan oleh: <strong>{t.submittedBy}</strong></p>

                {/* Approve modal inline */}
                {approving === t.id && (
                  <div style={{ marginTop: 12, backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 8, padding: 14 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#065f46", margin: "0 0 8px" }}>Konfirmasi Persetujuan</p>
                    <p style={{ fontSize: 11, color: "#064e3b", margin: "0 0 10px" }}>Tiket <strong>{t.id}</strong> akan disetujui dan ditangani oleh tim ICT.</p>
                    <textarea placeholder="Catatan persetujuan (opsional)..." rows={2} style={{ width: "100%", fontSize: 11, padding: "6px 10px", border: "1px solid #a7f3d0", borderRadius: 6, outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 8 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ padding: "6px 14px", fontSize: 11, fontWeight: 600, color: "white", backgroundColor: "#059669", border: "none", borderRadius: 6, cursor: "pointer" }}>Konfirmasi Setujui</button>
                      <button onClick={() => setApproving(null)} style={{ padding: "6px 14px", fontSize: 11, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer" }}>Batal</button>
                    </div>
                  </div>
                )}

                {/* Reject modal inline */}
                {rejecting === t.id && (
                  <div style={{ marginTop: 12, backgroundColor: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 8, padding: 14 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#be123c", margin: "0 0 8px" }}>Alasan Penolakan</p>
                    <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Tuliskan alasan penolakan..." rows={2} style={{ width: "100%", fontSize: 11, padding: "6px 10px", border: "1px solid #fecdd3", borderRadius: 6, outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 8 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ padding: "6px 14px", fontSize: 11, fontWeight: 600, color: "white", backgroundColor: "#e11d48", border: "none", borderRadius: 6, cursor: "pointer" }}>Konfirmasi Tolak</button>
                      <button onClick={() => setRejecting(null)} style={{ padding: "6px 14px", fontSize: 11, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer" }}>Batal</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Approved tab */}
        {activeTab === "Disetujui" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                {["ID Ticket", "Tanggal", "User", "Aplikasi", "Kendala", "Prioritas", "Disetujui Oleh", "Tanggal Approve"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {approvedTickets.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < approvedTickets.length - 1 ? "1px solid #f8fafc" : "none" }}>
                  <td style={{ padding: "10px 14px", color: "#2563eb", fontWeight: 600 }}>{t.id}</td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>{t.tanggal}</td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>{t.user}</td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>{t.aplikasi}</td>
                  <td style={{ padding: "10px 14px", color: "#475569", maxWidth: 200 }}>{t.kendala}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: priorityStyle[t.prioritas]?.bg, color: priorityStyle[t.prioritas]?.color, border: `1px solid ${priorityStyle[t.prioritas]?.border}` }}>{t.prioritas}</span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>{t.approvedBy}</td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>{t.approvedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Rejected tab */}
        {activeTab === "Ditolak" && (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {rejectedTickets.map((t) => (
              <div key={t.id} style={{ border: "1px solid #fecdd3", borderRadius: 10, padding: 14, backgroundColor: "#fff8f8" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#be123c" }}>{t.id}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: priorityStyle[t.prioritas]?.bg, color: priorityStyle[t.prioritas]?.color, border: `1px solid ${priorityStyle[t.prioritas]?.border}` }}>{t.prioritas}</span>
                  <span style={{ fontSize: 10, backgroundColor: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>DITOLAK</span>
                </div>
                <div style={{ display: "flex", gap: 20, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "#374151" }}>{t.user} — {t.aplikasi}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{t.tanggal}</span>
                </div>
                <p style={{ fontSize: 11, color: "#475569", margin: "0 0 6px" }}>{t.kendala}</p>
                <div style={{ backgroundColor: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 6, padding: "6px 10px" }}>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>Alasan penolakan: </span>
                  <span style={{ fontSize: 10, color: "#be123c" }}>{t.reason}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
