"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, X, Check } from "lucide-react"

const initAplikasi = [
  { id: 1, kode: "LST", nama: "LST_CASE Mobile", tipe: "Mobile", status: "Aktif", pic: "Tim Mobile" },
  { id: 2, kode: "HRIS", nama: "HRIS Web", tipe: "Web", status: "Aktif", pic: "Tim HRIS" },
  { id: 3, kode: "ECL", nama: "E-CLAIM Web", tipe: "Web", status: "Aktif", pic: "Tim Finance" },
  { id: 4, kode: "EML", nama: "EMAIL Microsoft 365", tipe: "SaaS", status: "Aktif", pic: "Tim IT" },
  { id: 5, kode: "VPN", nama: "VPN Client", tipe: "Network", status: "Aktif", pic: "Tim Infrastruktur" },
  { id: 6, kode: "SAP", nama: "SAP ERP", tipe: "Enterprise", status: "Maintenance", pic: "Tim SAP" },
]

const initDepartemen = [
  { id: 1, kode: "ICT", nama: "ICT Ticketing", atasan: "Manager ICT", total: 5 },
  { id: 2, kode: "FIN", nama: "Finance", atasan: "Manager Finance", total: 12 },
  { id: 3, kode: "OPS", nama: "Operational", atasan: "Manager Ops", total: 28 },
  { id: 4, kode: "MKT", nama: "Marketing", atasan: "Manager Marketing", total: 8 },
  { id: 5, kode: "HRD", nama: "HRD", atasan: "Manager HRD", total: 10 },
  { id: 6, kode: "ITS", nama: "IT Support", atasan: "Manager IT", total: 7 },
]

const initKategori = [
  { id: 1, nama: "Login / Autentikasi", prioritasDefault: "HIGH", sla: "1 jam" },
  { id: 2, nama: "Tampilan / UI Error", prioritasDefault: "MEDIUM", sla: "4 jam" },
  { id: 3, nama: "Upload / Download File", prioritasDefault: "MEDIUM", sla: "4 jam" },
  { id: 4, nama: "Koneksi / Jaringan", prioritasDefault: "HIGH", sla: "1 jam" },
  { id: 5, nama: "Data Tidak Tampil", prioritasDefault: "MEDIUM", sla: "4 jam" },
  { id: 6, nama: "Email Tidak Terkirim", prioritasDefault: "HIGH", sla: "2 jam" },
  { id: 7, nama: "Performa Lambat", prioritasDefault: "LOW", sla: "24 jam" },
  { id: 8, nama: "Bug / Error Sistem", prioritasDefault: "HIGH", sla: "1 jam" },
]

const tabs = ["Aplikasi", "Departemen", "Kategori"]
const priorityStyle: Record<string, { bg: string; color: string }> = {
  HIGH: { bg: "#fff1f2", color: "#be123c" },
  MEDIUM: { bg: "#fffbeb", color: "#92400e" },
  LOW: { bg: "#ecfdf5", color: "#065f46" },
}

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState("Aplikasi")
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [aplikasi, setAplikasi] = useState(initAplikasi)
  const [departemen] = useState(initDepartemen)
  const [kategori] = useState(initKategori)

  const deleteAplikasi = (id: number) => setAplikasi((prev) => prev.filter((a) => a.id !== id))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>Master Data</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Kelola data referensi sistem ICT Ticketing</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}
        >
          <Plus style={{ width: 14, height: 14 }} />
          Tambah {activeTab === "Aplikasi" ? "Aplikasi" : activeTab === "Departemen" ? "Departemen" : "Kategori"}
        </button>
      </div>

      {/* Table card with tabs */}
      <div style={{ backgroundColor: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        {/* Tabs + search */}
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #f1f5f9", padding: "0 16px" }}>
          <div style={{ display: "flex" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearch(""); setShowAdd(false); setEditingId(null) }}
                style={{ padding: "12px 16px", fontSize: 12, fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? "#2563eb" : "#64748b", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab ? "#2563eb" : "transparent"}`, cursor: "pointer" }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto", position: "relative" }}>
            <Search style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#94a3b8" }} />
            <input
              type="text"
              placeholder={`Cari ${activeTab.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 26, paddingRight: 10, paddingTop: 5, paddingBottom: 5, fontSize: 11, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, color: "#475569", outline: "none", width: 180 }}
            />
          </div>
        </div>

        {/* Add form inline */}
        {showAdd && (
          <div style={{ padding: 16, backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 10px" }}>
              Tambah {activeTab} Baru
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              {activeTab === "Aplikasi" && (
                <>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Kode</label><input placeholder="Kode" style={{ padding: "6px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, width: 70, outline: "none" }} /></div>
                  <div style={{ flex: 1 }}><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Nama Aplikasi</label><input placeholder="Nama aplikasi" style={{ padding: "6px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, width: "100%", outline: "none", boxSizing: "border-box" }} /></div>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Tipe</label><input placeholder="Tipe" style={{ padding: "6px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, width: 80, outline: "none" }} /></div>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>PIC</label><input placeholder="PIC" style={{ padding: "6px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, width: 120, outline: "none" }} /></div>
                </>
              )}
              {activeTab === "Departemen" && (
                <>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Kode</label><input placeholder="Kode" style={{ padding: "6px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, width: 70, outline: "none" }} /></div>
                  <div style={{ flex: 1 }}><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Nama Departemen</label><input placeholder="Nama departemen" style={{ padding: "6px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, width: "100%", outline: "none", boxSizing: "border-box" }} /></div>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Atasan</label><input placeholder="Nama atasan" style={{ padding: "6px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, width: 140, outline: "none" }} /></div>
                </>
              )}
              {activeTab === "Kategori" && (
                <>
                  <div style={{ flex: 1 }}><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Nama Kategori</label><input placeholder="Nama kategori" style={{ padding: "6px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, width: "100%", outline: "none", boxSizing: "border-box" }} /></div>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Prioritas Default</label>
                    <select style={{ padding: "6px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none" }}>
                      <option>HIGH</option><option>MEDIUM</option><option>LOW</option>
                    </select>
                  </div>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>SLA</label><input placeholder="e.g. 4 jam" style={{ padding: "6px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, width: 80, outline: "none" }} /></div>
                </>
              )}
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ padding: "6px 14px", fontSize: 11, fontWeight: 600, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 7, cursor: "pointer" }}>Simpan</button>
                <button onClick={() => setShowAdd(false)} style={{ padding: "6px 14px", fontSize: 11, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 7, cursor: "pointer" }}>Batal</button>
              </div>
            </div>
          </div>
        )}

        {/* APLIKASI TABLE */}
        {activeTab === "Aplikasi" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                {["Kode", "Nama Aplikasi", "Tipe", "PIC", "Status", "Aksi"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aplikasi.filter((a) => a.nama.toLowerCase().includes(search.toLowerCase()) || a.kode.toLowerCase().includes(search.toLowerCase())).map((a, i, arr) => (
                <tr key={a.id} style={{ borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, backgroundColor: "#eff6ff", color: "#2563eb", padding: "2px 8px", borderRadius: 999 }}>{a.kode}</span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#374151", fontWeight: 500 }}>{a.nama}</td>
                  <td style={{ padding: "10px 14px", color: "#64748b" }}>{a.tipe}</td>
                  <td style={{ padding: "10px 14px", color: "#64748b" }}>{a.pic}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: a.status === "Aktif" ? "#ecfdf5" : "#fff7ed", color: a.status === "Aktif" ? "#065f46" : "#c2410c" }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => setEditingId(editingId === a.id ? null : a.id)} style={{ padding: 5, border: "1px solid #e2e8f0", borderRadius: 6, background: "white", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}>
                        <Pencil style={{ width: 13, height: 13 }} />
                      </button>
                      <button onClick={() => deleteAplikasi(a.id)} style={{ padding: 5, border: "1px solid #fecdd3", borderRadius: 6, background: "#fff1f2", cursor: "pointer", color: "#be123c", display: "flex", alignItems: "center" }}>
                        <Trash2 style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* DEPARTEMEN TABLE */}
        {activeTab === "Departemen" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                {["Kode", "Nama Departemen", "Atasan", "Jml Staff", "Aksi"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {departemen.filter((d) => d.nama.toLowerCase().includes(search.toLowerCase())).map((d, i, arr) => (
                <tr key={d.id} style={{ borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none" }}>
                  <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 10, fontWeight: 600, backgroundColor: "#f5f3ff", color: "#7c3aed", padding: "2px 8px", borderRadius: 999 }}>{d.kode}</span></td>
                  <td style={{ padding: "10px 14px", color: "#374151", fontWeight: 500 }}>{d.nama}</td>
                  <td style={{ padding: "10px 14px", color: "#64748b" }}>{d.atasan}</td>
                  <td style={{ padding: "10px 14px", color: "#374151", fontWeight: 600 }}>{d.total}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button style={{ padding: 5, border: "1px solid #e2e8f0", borderRadius: 6, background: "white", cursor: "pointer", color: "#64748b", display: "flex" }}><Pencil style={{ width: 13, height: 13 }} /></button>
                      <button style={{ padding: 5, border: "1px solid #fecdd3", borderRadius: 6, background: "#fff1f2", cursor: "pointer", color: "#be123c", display: "flex" }}><Trash2 style={{ width: 13, height: 13 }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* KATEGORI TABLE */}
        {activeTab === "Kategori" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                {["Nama Kategori", "Prioritas Default", "SLA", "Aksi"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kategori.filter((k) => k.nama.toLowerCase().includes(search.toLowerCase())).map((k, i, arr) => (
                <tr key={k.id} style={{ borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none" }}>
                  <td style={{ padding: "10px 14px", color: "#374151", fontWeight: 500 }}>{k.nama}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: priorityStyle[k.prioritasDefault]?.bg, color: priorityStyle[k.prioritasDefault]?.color }}>{k.prioritasDefault}</span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>{k.sla}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button style={{ padding: 5, border: "1px solid #e2e8f0", borderRadius: 6, background: "white", cursor: "pointer", color: "#64748b", display: "flex" }}><Pencil style={{ width: 13, height: 13 }} /></button>
                      <button style={{ padding: 5, border: "1px solid #fecdd3", borderRadius: 6, background: "#fff1f2", cursor: "pointer", color: "#be123c", display: "flex" }}><Trash2 style={{ width: 13, height: 13 }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
            Total: {activeTab === "Aplikasi" ? aplikasi.length : activeTab === "Departemen" ? departemen.length : kategori.length} data
          </p>
        </div>
      </div>
    </div>
  )
}
