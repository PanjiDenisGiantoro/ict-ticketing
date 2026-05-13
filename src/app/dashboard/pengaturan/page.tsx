"use client"

import { useState } from "react"
import { User, Bell, Lock, Eye, EyeOff, Camera, Save } from "lucide-react"

const sections = [
  { id: "profil", label: "Profil", icon: User },
  { id: "notifikasi", label: "Notifikasi", icon: Bell },
  { id: "keamanan", label: "Keamanan", icon: Lock },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 40,
        height: 22,
        borderRadius: 999,
        backgroundColor: checked ? "#2563eb" : "#e2e8f0",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute",
        top: 3,
        left: checked ? 21 : 3,
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transition: "left 0.2s",
      }} />
    </button>
  )
}

export default function PengaturanPage() {
  const [activeSection, setActiveSection] = useState("profil")
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  const [notif, setNotif] = useState({
    emailNewTicket: true,
    emailStatusUpdate: true,
    emailSummaryHarian: false,
    emailSummaryMingguan: true,
    browserPush: true,
    soundAlert: false,
    escalationAlert: true,
  })

  const toggleNotif = (key: keyof typeof notif) => setNotif((prev) => ({ ...prev, [key]: !prev[key] }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>Pengaturan</h1>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Kelola profil, notifikasi, dan keamanan akun Anda</p>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Left nav */}
        <div style={{ width: 200, flexShrink: 0, backgroundColor: "white", borderRadius: 12, padding: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 12px",
                fontSize: 12,
                fontWeight: activeSection === s.id ? 600 : 400,
                color: activeSection === s.id ? "#2563eb" : "#475569",
                backgroundColor: activeSection === s.id ? "#eff6ff" : "transparent",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <s.icon style={{ width: 15, height: 15 }} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Right content */}
        <div style={{ flex: 1 }}>

          {/* PROFIL */}
          {activeSection === "profil" && (
            <div style={{ backgroundColor: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "0 0 20px", paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
                Informasi Profil
              </h3>

              {/* Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 22, fontWeight: 700 }}>
                    AJ
                  </div>
                  <button style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", backgroundColor: "#2563eb", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Camera style={{ width: 11, height: 11, color: "white" }} />
                  </button>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: "0 0 2px" }}>AJ ZARKASIH</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 8px" }}>ICT Ticketing Division</p>
                  <button style={{ fontSize: 11, color: "#2563eb", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
                    Ganti Foto
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Nama Lengkap</label>
                    <input defaultValue="AJ ZARKASIH" style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>NIK / Employee ID</label>
                    <input defaultValue="JNE-2019-0042" readOnly style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", backgroundColor: "#f8fafc", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
                    <input defaultValue="aj.zarkasih@jne.co.id" style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>No. Telepon</label>
                    <input defaultValue="+62 812-3456-7890" style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Departemen</label>
                    <input defaultValue="ICT Ticketing" readOnly style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", backgroundColor: "#f8fafc", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Jabatan</label>
                    <input defaultValue="ICT Helpdesk Specialist" style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Bio / Catatan</label>
                  <textarea rows={2} defaultValue="ICT Helpdesk Specialist yang bertanggung jawab atas penanganan kendala teknis pengguna JNE Express." style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none", resize: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
                  <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: saved ? "#059669" : "#2563eb", border: "none", borderRadius: 8, cursor: "pointer", transition: "background-color 0.3s" }}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saved ? "Tersimpan!" : "Simpan Perubahan"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFIKASI */}
          {activeSection === "notifikasi" && (
            <div style={{ backgroundColor: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "0 0 20px", paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
                Pengaturan Notifikasi
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {/* Email section */}
                <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 12px" }}>Email Notifikasi</p>
                {[
                  { key: "emailNewTicket", label: "Tiket Baru Masuk", desc: "Notifikasi saat ada tiket kendala baru" },
                  { key: "emailStatusUpdate", label: "Update Status Tiket", desc: "Notifikasi perubahan status tiket Anda" },
                  { key: "emailSummaryHarian", label: "Summary Harian", desc: "Ringkasan tiket setiap hari pukul 08.00" },
                  { key: "emailSummaryMingguan", label: "Summary Mingguan", desc: "Ringkasan tiket setiap Senin pagi" },
                ].map((item) => (
                  <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f8fafc" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500, color: "#374151", margin: "0 0 2px" }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{item.desc}</p>
                    </div>
                    <Toggle checked={notif[item.key as keyof typeof notif]} onChange={() => toggleNotif(item.key as keyof typeof notif)} />
                  </div>
                ))}

                <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, margin: "20px 0 12px" }}>Browser & Suara</p>
                {[
                  { key: "browserPush", label: "Browser Push Notification", desc: "Notifikasi langsung di browser" },
                  { key: "soundAlert", label: "Notifikasi Suara", desc: "Suara saat ada notifikasi masuk" },
                  { key: "escalationAlert", label: "Alert Eskalasi", desc: "Notifikasi khusus untuk tiket yang dieskalasi" },
                ].map((item) => (
                  <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f8fafc" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500, color: "#374151", margin: "0 0 2px" }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{item.desc}</p>
                    </div>
                    <Toggle checked={notif[item.key as keyof typeof notif]} onChange={() => toggleNotif(item.key as keyof typeof notif)} />
                  </div>
                ))}

                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16 }}>
                  <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: saved ? "#059669" : "#2563eb", border: "none", borderRadius: 8, cursor: "pointer" }}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saved ? "Tersimpan!" : "Simpan Pengaturan"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* KEAMANAN */}
          {activeSection === "keamanan" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ backgroundColor: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "0 0 20px", paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
                  Ubah Password
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password Saat Ini</label>
                    <div style={{ position: "relative" }}>
                      <input type={showPassword ? "text" : "password"} placeholder="Masukkan password saat ini" style={{ width: "100%", padding: "8px 36px 8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                        {showPassword ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password Baru</label>
                    <div style={{ position: "relative" }}>
                      <input type={showNewPassword ? "text" : "password"} placeholder="Minimal 8 karakter" style={{ width: "100%", padding: "8px 36px 8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                        {showNewPassword ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                      </button>
                    </div>
                    <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>Minimal 8 karakter, kombinasi huruf besar, kecil, angka, dan simbol</p>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Konfirmasi Password Baru</label>
                    <input type="password" placeholder="Ulangi password baru" style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", padding: "9px 20px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: saved ? "#059669" : "#2563eb", border: "none", borderRadius: 8, cursor: "pointer" }}>
                    {saved ? "Password Diubah!" : "Ubah Password"}
                  </button>
                </div>
              </div>

              <div style={{ backgroundColor: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "0 0 14px" }}>Sesi Aktif</h3>
                {[
                  { device: "Chrome / Windows 11", location: "Jakarta, Indonesia", time: "Saat ini", current: true },
                  { device: "Mobile / Android", location: "Tangerang, Indonesia", time: "2 jam lalu", current: false },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 1 ? "1px solid #f1f5f9" : "none" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500, color: "#374151", margin: "0 0 2px" }}>
                        {s.device}
                        {s.current && <span style={{ marginLeft: 6, fontSize: 10, backgroundColor: "#ecfdf5", color: "#065f46", padding: "1px 6px", borderRadius: 999, fontWeight: 600 }}>Sesi Ini</span>}
                      </p>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{s.location} · {s.time}</p>
                    </div>
                    {!s.current && (
                      <button style={{ fontSize: 11, color: "#be123c", backgroundColor: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
                        Logout
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
