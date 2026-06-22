"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Search, X, Loader2 } from "lucide-react"

type Aplikasi = { id: number; kode: string; nama: string; tipe: string; pic: string; status: string }
type Departemen = { id: number; kode: string; nama: string; atasan: string; total_staff: number }
type Kategori = { id: number; nama: string; prioritas_default: string; sla: string }

const priorityStyle: Record<string, { bg: string; color: string }> = {
  HIGH: { bg: "#fff1f2", color: "#be123c" },
  MEDIUM: { bg: "#fffbeb", color: "#92400e" },
  LOW: { bg: "#ecfdf5", color: "#065f46" },
}

const tabs = [
  { key: "aplikasi", label: "Aplikasi" },
  { key: "departemen", label: "Departemen" },
  { key: "kategori", label: "Kategori" },
]

export default function MasterDataPage() {
  return (
    <Suspense>
      <MasterDataContent />
    </Suspense>
  )
}

function MasterDataContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get("tab") || "aplikasi"
  const [activeTab, setActiveTab] = useState(tabParam)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [aplikasi, setAplikasi] = useState<Aplikasi[]>([])
  const [departemen, setDepartemen] = useState<Departemen[]>([])
  const [kategori, setKategori] = useState<Kategori[]>([])

  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<Aplikasi | Departemen | Kategori | null>(null)
  const [deleteItem, setDeleteItem] = useState<{ id: number; name: string } | null>(null)

  // Add forms
  const [addApp, setAddApp] = useState({ kode: "", nama: "", tipe: "", pic: "", status: "Aktif" })
  const [addDept, setAddDept] = useState({ kode: "", nama: "", atasan: "", total_staff: 0 })
  const [addKat, setAddKat] = useState({ nama: "", prioritas_default: "MEDIUM", sla: "" })

  useEffect(() => {
    setActiveTab(tabParam)
  }, [tabParam])

  const switchTab = (key: string) => {
    setActiveTab(key)
    setSearch("")
    setShowAdd(false)
    setEditItem(null)
    router.replace(`/dashboard/master-data?tab=${key}`)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    const s = search ? `?search=${encodeURIComponent(search)}` : ""
    try {
      if (activeTab === "aplikasi") {
        const res = await fetch(`/api/master/aplikasi${s}`)
        setAplikasi(await res.json())
      } else if (activeTab === "departemen") {
        const res = await fetch(`/api/master/departemen${s}`)
        setDepartemen(await res.json())
      } else {
        const res = await fetch(`/api/master/kategori${s}`)
        setKategori(await res.json())
      }
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [activeTab, search])

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 250)
    return () => clearTimeout(timer)
  }, [fetchData])

  const handleAdd = async () => {
    setSaving(true)
    try {
      const endpoint = `/api/master/${activeTab}`
      const body = activeTab === "aplikasi" ? addApp : activeTab === "departemen" ? addDept : addKat
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (!res.ok) { const j = await res.json(); alert(j.error); return }
      setShowAdd(false)
      setAddApp({ kode: "", nama: "", tipe: "", pic: "", status: "Aktif" })
      setAddDept({ kode: "", nama: "", atasan: "", total_staff: 0 })
      setAddKat({ nama: "", prioritas_default: "MEDIUM", sla: "" })
      fetchData()
    } catch { /* ignore */ } finally {
      setSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!editItem) return
    setSaving(true)
    try {
      const res = await fetch(`/api/master/${activeTab}/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem),
      })
      if (!res.ok) { const j = await res.json(); alert(j.error); return }
      setEditItem(null)
      fetchData()
    } catch { /* ignore */ } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    setSaving(true)
    try {
      await fetch(`/api/master/${activeTab}/${deleteItem.id}`, { method: "DELETE" })
      setDeleteItem(null)
      fetchData()
    } catch { /* ignore */ } finally {
      setSaving(false)
    }
  }

  const inputStyle = { padding: "6px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none", boxSizing: "border-box" as const }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>Master Data</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Kelola data referensi sistem ICT Ticketing</p>
        </div>
        <button onClick={() => { setShowAdd(true); setEditItem(null) }} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}>
          <Plus style={{ width: 14, height: 14 }} />
          Tambah {tabs.find((t) => t.key === activeTab)?.label}
        </button>
      </div>

      {/* Table card */}
      <div style={{ backgroundColor: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        {/* Tabs + search */}
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #f1f5f9", padding: "0 16px" }}>
          <div style={{ display: "flex" }}>
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => switchTab(tab.key)} style={{ padding: "12px 16px", fontSize: 12, fontWeight: activeTab === tab.key ? 600 : 400, color: activeTab === tab.key ? "#2563eb" : "#64748b", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.key ? "#2563eb" : "transparent"}`, cursor: "pointer" }}>
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto", position: "relative" }}>
            <Search style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#94a3b8" }} />
            <input type="text" placeholder={`Cari ${tabs.find((t) => t.key === activeTab)?.label.toLowerCase()}...`} value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 26, paddingRight: 10, paddingTop: 5, paddingBottom: 5, fontSize: 11, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, color: "#475569", outline: "none", width: 180 }} />
          </div>
        </div>

        {/* Add form inline */}
        {showAdd && (
          <div style={{ padding: 16, backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 10px" }}>
              Tambah {tabs.find((t) => t.key === activeTab)?.label} Baru
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
              {activeTab === "aplikasi" && (
                <>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Kode *</label><input value={addApp.kode} onChange={(e) => setAddApp({ ...addApp, kode: e.target.value })} style={{ ...inputStyle, width: 70 }} /></div>
                  <div style={{ flex: 1 }}><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Nama Aplikasi *</label><input value={addApp.nama} onChange={(e) => setAddApp({ ...addApp, nama: e.target.value })} style={{ ...inputStyle, width: "100%" }} /></div>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Tipe</label><input value={addApp.tipe} onChange={(e) => setAddApp({ ...addApp, tipe: e.target.value })} style={{ ...inputStyle, width: 90 }} /></div>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>PIC</label><input value={addApp.pic} onChange={(e) => setAddApp({ ...addApp, pic: e.target.value })} style={{ ...inputStyle, width: 120 }} /></div>
                </>
              )}
              {activeTab === "departemen" && (
                <>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Kode *</label><input value={addDept.kode} onChange={(e) => setAddDept({ ...addDept, kode: e.target.value })} style={{ ...inputStyle, width: 70 }} /></div>
                  <div style={{ flex: 1 }}><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Nama Departemen *</label><input value={addDept.nama} onChange={(e) => setAddDept({ ...addDept, nama: e.target.value })} style={{ ...inputStyle, width: "100%" }} /></div>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Atasan</label><input value={addDept.atasan} onChange={(e) => setAddDept({ ...addDept, atasan: e.target.value })} style={{ ...inputStyle, width: 140 }} /></div>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Jml Staff</label><input type="number" value={addDept.total_staff} onChange={(e) => setAddDept({ ...addDept, total_staff: Number(e.target.value) })} style={{ ...inputStyle, width: 70 }} /></div>
                </>
              )}
              {activeTab === "kategori" && (
                <>
                  <div style={{ flex: 1 }}><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Nama Kategori *</label><input value={addKat.nama} onChange={(e) => setAddKat({ ...addKat, nama: e.target.value })} style={{ ...inputStyle, width: "100%" }} /></div>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>Prioritas Default</label>
                    <select value={addKat.prioritas_default} onChange={(e) => setAddKat({ ...addKat, prioritas_default: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option>HIGH</option><option>MEDIUM</option><option>LOW</option>
                    </select>
                  </div>
                  <div><label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4 }}>SLA</label><input value={addKat.sla} onChange={(e) => setAddKat({ ...addKat, sla: e.target.value })} placeholder="e.g. 4 jam" style={{ ...inputStyle, width: 90 }} /></div>
                </>
              )}
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={handleAdd} disabled={saving} style={{ padding: "6px 14px", fontSize: 11, fontWeight: 600, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 7, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Simpan..." : "Simpan"}
                </button>
                <button onClick={() => setShowAdd(false)} style={{ padding: "6px 14px", fontSize: 11, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 7, cursor: "pointer" }}>Batal</button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <Loader2 style={{ width: 24, height: 24, color: "#94a3b8", animation: "spin 1s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : (
          <>
            {/* APLIKASI TABLE */}
            {activeTab === "aplikasi" && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                    {["Kode", "Nama Aplikasi", "Tipe", "PIC", "Status", "Aksi"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {aplikasi.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: "#94a3b8" }}>Tidak ada data</td></tr>
                  ) : aplikasi.map((a, i) => (
                    <tr key={a.id} style={{ borderBottom: i < aplikasi.length - 1 ? "1px solid #f8fafc" : "none" }}>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, backgroundColor: "#eff6ff", color: "#2563eb", padding: "2px 8px", borderRadius: 999 }}>{a.kode}</span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#374151", fontWeight: 500 }}>{a.nama}</td>
                      <td style={{ padding: "10px 14px", color: "#64748b" }}>{a.tipe}</td>
                      <td style={{ padding: "10px 14px", color: "#64748b" }}>{a.pic}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: a.status === "Aktif" ? "#ecfdf5" : a.status === "Maintenance" ? "#fff7ed" : "#f1f5f9", color: a.status === "Aktif" ? "#065f46" : a.status === "Maintenance" ? "#c2410c" : "#475569" }}>
                          {a.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => { setEditItem(a); setShowAdd(false) }} style={{ padding: 5, border: "1px solid #e2e8f0", borderRadius: 6, background: "white", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}><Pencil style={{ width: 13, height: 13 }} /></button>
                          <button onClick={() => setDeleteItem({ id: a.id, name: a.nama })} style={{ padding: 5, border: "1px solid #fecdd3", borderRadius: 6, background: "#fff1f2", cursor: "pointer", color: "#be123c", display: "flex", alignItems: "center" }}><Trash2 style={{ width: 13, height: 13 }} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* DEPARTEMEN TABLE */}
            {activeTab === "departemen" && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                    {["Kode", "Nama Departemen", "Atasan", "Jml Staff", "Aksi"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {departemen.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: 30, textAlign: "center", color: "#94a3b8" }}>Tidak ada data</td></tr>
                  ) : departemen.map((d, i) => (
                    <tr key={d.id} style={{ borderBottom: i < departemen.length - 1 ? "1px solid #f8fafc" : "none" }}>
                      <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 10, fontWeight: 600, backgroundColor: "#f5f3ff", color: "#7c3aed", padding: "2px 8px", borderRadius: 999 }}>{d.kode}</span></td>
                      <td style={{ padding: "10px 14px", color: "#374151", fontWeight: 500 }}>{d.nama}</td>
                      <td style={{ padding: "10px 14px", color: "#64748b" }}>{d.atasan}</td>
                      <td style={{ padding: "10px 14px", color: "#374151", fontWeight: 600 }}>{d.total_staff}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => { setEditItem(d); setShowAdd(false) }} style={{ padding: 5, border: "1px solid #e2e8f0", borderRadius: 6, background: "white", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}><Pencil style={{ width: 13, height: 13 }} /></button>
                          <button onClick={() => setDeleteItem({ id: d.id, name: d.nama })} style={{ padding: 5, border: "1px solid #fecdd3", borderRadius: 6, background: "#fff1f2", cursor: "pointer", color: "#be123c", display: "flex", alignItems: "center" }}><Trash2 style={{ width: 13, height: 13 }} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* KATEGORI TABLE */}
            {activeTab === "kategori" && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                    {["Nama Kategori", "Prioritas Default", "SLA", "Aksi"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kategori.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: 30, textAlign: "center", color: "#94a3b8" }}>Tidak ada data</td></tr>
                  ) : kategori.map((k, i) => (
                    <tr key={k.id} style={{ borderBottom: i < kategori.length - 1 ? "1px solid #f8fafc" : "none" }}>
                      <td style={{ padding: "10px 14px", color: "#374151", fontWeight: 500 }}>{k.nama}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: priorityStyle[k.prioritas_default]?.bg, color: priorityStyle[k.prioritas_default]?.color }}>{k.prioritas_default}</span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#374151" }}>{k.sla}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => { setEditItem(k); setShowAdd(false) }} style={{ padding: 5, border: "1px solid #e2e8f0", borderRadius: 6, background: "white", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}><Pencil style={{ width: 13, height: 13 }} /></button>
                          <button onClick={() => setDeleteItem({ id: k.id, name: k.nama })} style={{ padding: 5, border: "1px solid #fecdd3", borderRadius: 6, background: "#fff1f2", cursor: "pointer", color: "#be123c", display: "flex", alignItems: "center" }}><Trash2 style={{ width: 13, height: 13 }} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
            Total: {activeTab === "aplikasi" ? aplikasi.length : activeTab === "departemen" ? departemen.length : kategori.length} data
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setEditItem(null)}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: 0 }}>Edit {tabs.find((t) => t.key === activeTab)?.label}</h2>
              <button onClick={() => setEditItem(null)} style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}><X style={{ width: 18, height: 18 }} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {activeTab === "aplikasi" && (() => {
                const item = editItem as Aplikasi
                return <>
                  <EditField label="Kode" value={item.kode} onChange={(v) => setEditItem({ ...item, kode: v })} />
                  <EditField label="Nama Aplikasi" value={item.nama} onChange={(v) => setEditItem({ ...item, nama: v })} />
                  <EditField label="Tipe" value={item.tipe} onChange={(v) => setEditItem({ ...item, tipe: v })} />
                  <EditField label="PIC" value={item.pic} onChange={(v) => setEditItem({ ...item, pic: v })} />
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Status</label>
                    <select value={item.status} onChange={(e) => setEditItem({ ...item, status: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", cursor: "pointer", boxSizing: "border-box" }}>
                      <option>Aktif</option><option>Maintenance</option><option>Nonaktif</option>
                    </select>
                  </div>
                </>
              })()}
              {activeTab === "departemen" && (() => {
                const item = editItem as Departemen
                return <>
                  <EditField label="Kode" value={item.kode} onChange={(v) => setEditItem({ ...item, kode: v })} />
                  <EditField label="Nama Departemen" value={item.nama} onChange={(v) => setEditItem({ ...item, nama: v })} />
                  <EditField label="Atasan" value={item.atasan} onChange={(v) => setEditItem({ ...item, atasan: v })} />
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Jumlah Staff</label>
                    <input type="number" value={item.total_staff} onChange={(e) => setEditItem({ ...item, total_staff: Number(e.target.value) })} style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", boxSizing: "border-box" }} />
                  </div>
                </>
              })()}
              {activeTab === "kategori" && (() => {
                const item = editItem as Kategori
                return <>
                  <EditField label="Nama Kategori" value={item.nama} onChange={(v) => setEditItem({ ...item, nama: v })} />
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Prioritas Default</label>
                    <select value={item.prioritas_default} onChange={(e) => setEditItem({ ...item, prioritas_default: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", cursor: "pointer", boxSizing: "border-box" }}>
                      <option>HIGH</option><option>MEDIUM</option><option>LOW</option>
                    </select>
                  </div>
                  <EditField label="SLA" value={item.sla} onChange={(v) => setEditItem({ ...item, sla: v })} />
                </>
              })()}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
              <button onClick={() => setEditItem(null)} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer" }}>Batal</button>
              <button onClick={handleEdit} disabled={saving} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 8, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteItem && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setDeleteItem(null)}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Trash2 style={{ width: 24, height: 24, color: "#ef4444" }} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>Hapus Data?</h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: "#374151" }}>{deleteItem.name}</strong> akan dihapus permanen.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setDeleteItem(null)} style={{ flex: 1, padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer" }}>Batal</button>
              <button onClick={handleDelete} disabled={saving} style={{ flex: 1, padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: "#ef4444", border: "none", borderRadius: 8, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none", boxSizing: "border-box" }} />
    </div>
  )
}
