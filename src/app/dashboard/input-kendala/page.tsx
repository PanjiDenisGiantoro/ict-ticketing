"use client"

import { useState } from "react"
import { ChevronDown, Upload, X, FileText, AlertCircle, CheckCircle2, Info } from "lucide-react"
import Link from "next/link"

const aplikasiList = ["LST_CASE Mobile", "HRIS Web", "E-CLAIM Web", "EMAIL Microsoft 365", "VPN Client", "Portal Internal", "SAP", "Lainnya"]
const departemenList = ["ICT Ticketing", "Finance", "Operational", "Marketing", "IT Support", "HRD", "Accounting", "Procurement"]
const kategoriList = ["Login / Autentikasi", "Tampilan / UI Error", "Upload / Download File", "Koneksi / Jaringan", "Data Tidak Tampil", "Email Tidak Terkirim", "Performa Lambat", "Bug / Error Sistem", "Lainnya"]

export default function InputKendalaPage() {
  const [form, setForm] = useState({
    aplikasi: "",
    departemen: "",
    kategori: "",
    prioritas: "",
    judul: "",
    deskripsi: "",
    langkah: "",
  })
  const [files, setFiles] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const removeFile = (name: string) => setFiles((prev) => prev.filter((f) => f !== name))

  const prioritasOptions = [
    { value: "HIGH", label: "High", desc: "Sistem tidak bisa digunakan sama sekali", bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
    { value: "MEDIUM", label: "Medium", desc: "Sebagian fungsi terganggu", bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
    { value: "LOW", label: "Low", desc: "Gangguan minor, masih bisa digunakan", bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
  ]

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600, margin: "0 auto", paddingTop: 40, alignItems: "center", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CheckCircle2 style={{ width: 36, height: 36, color: "#10b981" }} />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>Kendala Berhasil Disubmit!</h2>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>Tiket kendala Anda telah berhasil dikirim. Tim ICT akan segera menangani kendala Anda.</p>
        </div>
        <div style={{ backgroundColor: "#f8fafc", borderRadius: 10, padding: "12px 20px", border: "1px solid #e2e8f0", width: "100%" }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>ID Tiket</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#2563eb" }}>ICT-2025-00129</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setSubmitted(false)} style={{ padding: "8px 20px", fontSize: 12, fontWeight: 600, color: "#2563eb", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, cursor: "pointer" }}>
            Input Kendala Baru
          </button>
          <Link href="/dashboard/my-ticket" style={{ padding: "8px 20px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 8, cursor: "pointer", textDecoration: "none" }}>
            Lihat My Ticket
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>Input Kendala Baru</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Laporkan kendala atau masalah teknis yang Anda alami</p>
        </div>
        <Link href="/dashboard/list-kendala" style={{ fontSize: 12, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 14px", textDecoration: "none" }}>
          ← Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {/* Main form */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Section 1: Informasi Tiket */}
            <div style={{ backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 16px", paddingBottom: 10, borderBottom: "1px solid #f1f5f9" }}>
                Informasi Tiket
              </h3>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    Nama Pelapor <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="AJ ZARKASIH"
                    readOnly
                    style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", backgroundColor: "#f8fafc", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    Departemen <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={form.departemen}
                      onChange={(e) => handleChange("departemen", e.target.value)}
                      required
                      style={{ width: "100%", appearance: "none", padding: "8px 30px 8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: form.departemen ? "#374151" : "#94a3b8", backgroundColor: "white", outline: "none", boxSizing: "border-box", cursor: "pointer" }}
                    >
                      <option value="">Pilih departemen</option>
                      {departemenList.map((d) => <option key={d}>{d}</option>)}
                    </select>
                    <ChevronDown style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#94a3b8", pointerEvents: "none" }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    Tanggal Kendala <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", backgroundColor: "white", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Detail Kendala */}
            <div style={{ backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 16px", paddingBottom: 10, borderBottom: "1px solid #f1f5f9" }}>
                Detail Kendala
              </h3>

              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    Aplikasi <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={form.aplikasi}
                      onChange={(e) => handleChange("aplikasi", e.target.value)}
                      required
                      style={{ width: "100%", appearance: "none", padding: "8px 30px 8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: form.aplikasi ? "#374151" : "#94a3b8", backgroundColor: "white", outline: "none", boxSizing: "border-box", cursor: "pointer" }}
                    >
                      <option value="">Pilih aplikasi</option>
                      {aplikasiList.map((a) => <option key={a}>{a}</option>)}
                    </select>
                    <ChevronDown style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#94a3b8", pointerEvents: "none" }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    Kategori Kendala <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={form.kategori}
                      onChange={(e) => handleChange("kategori", e.target.value)}
                      required
                      style={{ width: "100%", appearance: "none", padding: "8px 30px 8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: form.kategori ? "#374151" : "#94a3b8", backgroundColor: "white", outline: "none", boxSizing: "border-box", cursor: "pointer" }}
                    >
                      <option value="">Pilih kategori</option>
                      {kategoriList.map((k) => <option key={k}>{k}</option>)}
                    </select>
                    <ChevronDown style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#94a3b8", pointerEvents: "none" }} />
                  </div>
                </div>
              </div>

              {/* Prioritas */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  Tingkat Prioritas <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {prioritasOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChange("prioritas", opt.value)}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: `2px solid ${form.prioritas === opt.value ? opt.border : "#e2e8f0"}`,
                        backgroundColor: form.prioritas === opt.value ? opt.bg : "white",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: opt.color, marginBottom: 2 }}>{opt.label}</div>
                      <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.3 }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Judul */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Judul Kendala <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tidak bisa login ke aplikasi LST_CASE Mobile"
                  value={form.judul}
                  onChange={(e) => handleChange("judul", e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", backgroundColor: "white", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Deskripsi */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Deskripsi Detail <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  placeholder="Jelaskan kendala yang Anda alami secara detail..."
                  value={form.deskripsi}
                  onChange={(e) => handleChange("deskripsi", e.target.value)}
                  required
                  rows={4}
                  style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", backgroundColor: "white", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }}
                />
              </div>

              {/* Langkah */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Langkah Reproduksi
                </label>
                <textarea
                  placeholder="Tuliskan langkah-langkah untuk mereproduksi kendala ini..."
                  value={form.langkah}
                  onChange={(e) => handleChange("langkah", e.target.value)}
                  rows={3}
                  style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", backgroundColor: "white", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }}
                />
              </div>
            </div>

            {/* Section 3: Attachment */}
            <div style={{ backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 16px", paddingBottom: 10, borderBottom: "1px solid #f1f5f9" }}>
                Lampiran <span style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8" }}>(Opsional)</span>
              </h3>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "28px 20px",
                  border: `2px dashed ${dragging ? "#3b82f6" : "#e2e8f0"}`,
                  borderRadius: 10,
                  backgroundColor: dragging ? "#eff6ff" : "#f8fafc",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragging(false)
                  const names = Array.from(e.dataTransfer.files).map((f) => f.name)
                  setFiles((prev) => [...prev, ...names])
                }}
              >
                <input
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files) {
                      const names = Array.from(e.target.files).map((f) => f.name)
                      setFiles((prev) => [...prev, ...names])
                    }
                  }}
                />
                <Upload style={{ width: 28, height: 28, color: dragging ? "#3b82f6" : "#94a3b8" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: "#374151", margin: "0 0 4px", fontWeight: 500 }}>Drag & drop file atau klik untuk upload</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>PNG, JPG, PDF, DOCX (maks. 10MB per file)</p>
                </div>
              </label>

              {files.length > 0 && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  {files.map((file) => (
                    <div key={file} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", backgroundColor: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <FileText style={{ width: 14, height: 14, color: "#64748b", flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 11, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file}</span>
                      <button type="button" onClick={() => removeFile(file)} style={{ padding: 2, border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}>
                        <X style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Link href="/dashboard/list-kendala" style={{ padding: "9px 20px", fontSize: 12, fontWeight: 600, color: "#475569", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer", textDecoration: "none" }}>
                Batal
              </Link>
              <button type="button" style={{ padding: "9px 20px", fontSize: 12, fontWeight: 600, color: "#2563eb", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, cursor: "pointer" }}>
                Simpan Draft
              </button>
              <button type="submit" style={{ padding: "9px 20px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: "#2563eb", border: "none", borderRadius: 8, cursor: "pointer" }}>
                Submit Kendala
              </button>
            </div>
          </div>

          {/* Right info panel */}
          <div style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ backgroundColor: "#eff6ff", borderRadius: 12, padding: 16, border: "1px solid #bfdbfe" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Info style={{ width: 14, height: 14, color: "#2563eb" }} />
                <h4 style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", margin: 0 }}>Petunjuk Pengisian</h4>
              </div>
              <ul style={{ fontSize: 11, color: "#1e40af", margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
                <li>Isi semua field yang bertanda <strong>*</strong></li>
                <li>Pilih prioritas sesuai dampak kendala</li>
                <li>Jelaskan kendala secara detail</li>
                <li>Lampirkan screenshot jika ada</li>
                <li>Tiket akan diproses maks. 1×24 jam</li>
              </ul>
            </div>

            <div style={{ backgroundColor: "white", borderRadius: 12, padding: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: "0 0 10px" }}>SLA Response Time</h4>
              {[
                { label: "High Priority", value: "1 jam", color: "#be123c", bg: "#fff1f2" },
                { label: "Medium Priority", value: "4 jam", color: "#92400e", bg: "#fffbeb" },
                { label: "Low Priority", value: "1×24 jam", color: "#065f46", bg: "#ecfdf5" },
              ].map((sla) => (
                <div key={sla.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "#64748b" }}>{sla.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: sla.color, backgroundColor: sla.bg, padding: "2px 8px", borderRadius: 999 }}>{sla.value}</span>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: "#fff7ed", borderRadius: 12, padding: 16, border: "1px solid #fed7aa" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <AlertCircle style={{ width: 14, height: 14, color: "#ea580c" }} />
                <h4 style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", margin: 0 }}>Kontak Darurat</h4>
              </div>
              <p style={{ fontSize: 11, color: "#9a3412", margin: "0 0 6px" }}>Untuk kendala kritis, hubungi:</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#7c2d12", margin: 0 }}>📞 Ext. 1234 (ICT Helpdesk)</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#7c2d12", margin: 0 }}>✉️ ict@jne.co.id</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
