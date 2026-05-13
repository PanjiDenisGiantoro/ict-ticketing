"use client"

import { useState } from "react"
import { ChevronDown, Phone, Mail, MessageSquare, BookOpen, Video, ExternalLink, Search, Send } from "lucide-react"

const faqs = [
  { q: "Bagaimana cara membuat tiket kendala baru?", a: "Klik menu 'Input Kendala' di sidebar kiri, kemudian isi form yang tersedia meliputi aplikasi yang bermasalah, kategori kendala, prioritas, dan deskripsi detail. Upload screenshot jika diperlukan, lalu klik 'Submit Kendala'." },
  { q: "Berapa lama waktu respon penanganan kendala?", a: "Waktu respon bergantung pada tingkat prioritas: HIGH priority ditangani dalam 1 jam, MEDIUM dalam 4 jam, dan LOW dalam 1×24 jam kerja. Tim ICT akan menghubungi Anda segera setelah tiket diterima." },
  { q: "Bagaimana cara memantau status tiket saya?", a: "Anda dapat memantau status tiket melalui menu 'My Ticket' di sidebar. Di sana terlihat semua tiket yang pernah Anda buat beserta status terkini (In Progress, Resolved, atau Escalated)." },
  { q: "Apa yang dimaksud dengan status 'Escalated'?", a: "Status 'Escalated' berarti kendala Anda memerlukan penanganan lebih lanjut dari level manajemen atau vendor. Kendala ini membutuhkan waktu lebih lama untuk diselesaikan, dan tim ICT akan terus mengupdate progress-nya." },
  { q: "Bisakah saya mengedit tiket yang sudah dikirim?", a: "Tiket yang sudah berstatus 'In Progress' atau lebih lanjut tidak dapat diedit. Jika ada informasi tambahan, silahkan tambahkan komentar pada tiket tersebut atau hubungi ICT Helpdesk langsung." },
  { q: "Bagaimana cara menambahkan lampiran setelah tiket dibuat?", a: "Saat ini lampiran hanya bisa ditambahkan saat pertama kali membuat tiket. Jika ada lampiran tambahan yang perlu ditambahkan setelah tiket dibuat, silahkan hubungi ICT Helpdesk melalui email atau telepon." },
  { q: "Apa yang harus dilakukan jika tidak bisa login ke sistem?", a: "Jika tidak bisa mengakses sistem ICT Ticketing, hubungi ICT Helpdesk langsung melalui telepon ext. 1234 atau email ict@jne.co.id. Untuk kendala aplikasi lain, buat tiket kendala baru dengan prioritas HIGH." },
  { q: "Bagaimana cara melihat laporan kendala?", a: "Klik menu 'Reports' di sidebar untuk melihat statistik dan analisis kendala. Anda dapat memfilter berdasarkan periode waktu, aplikasi, atau departemen. Laporan juga bisa diunduh melalui menu 'Download Report'." },
]

const quickLinks = [
  { title: "Panduan Penggunaan Sistem", desc: "Dokumentasi lengkap cara menggunakan ICT Ticketing", icon: BookOpen, color: "#2563eb", bg: "#eff6ff" },
  { title: "Video Tutorial", desc: "Video step-by-step penggunaan fitur utama", icon: Video, color: "#7c3aed", bg: "#f5f3ff" },
  { title: "Kebijakan IT", desc: "Standar dan prosedur penggunaan sistem IT JNE", icon: ExternalLink, color: "#059669", bg: "#ecfdf5" },
]

export default function BantuanPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [searchFaq, setSearchFaq] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const filteredFaqs = faqs.filter((f) => f.q.toLowerCase().includes(searchFaq.toLowerCase()) || f.a.toLowerCase().includes(searchFaq.toLowerCase()))

  const handleSend = () => {
    if (message.trim()) {
      setSent(true)
      setMessage("")
      setTimeout(() => setSent(false), 3000)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>Bantuan</h1>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Panduan penggunaan dan kontak dukungan ICT</p>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Left: FAQ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Quick links */}
          <div style={{ display: "flex", gap: 12 }}>
            {quickLinks.map((link) => (
              <div key={link.title} style={{ flex: 1, backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", cursor: "pointer', display: 'flex", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: link.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <link.icon style={{ width: 18, height: 18, color: link.color }} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 2px" }}>{link.title}</p>
                  <p style={{ fontSize: 10, color: "#64748b", margin: 0 }}>{link.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div style={{ backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: 0 }}>Pertanyaan yang Sering Diajukan (FAQ)</h3>
              <div style={{ position: "relative" }}>
                <Search style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={searchFaq}
                  onChange={(e) => setSearchFaq(e.target.value)}
                  style={{ paddingLeft: 26, paddingRight: 10, paddingTop: 6, paddingBottom: 6, fontSize: 11, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, color: "#475569", outline: "none", width: 180 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredFaqs.length === 0 && (
                <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>Tidak ada pertanyaan yang cocok.</p>
              )}
              {filteredFaqs.map((faq, i) => (
                <div key={i} style={{ border: "1px solid #f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "12px 16px",
                      background: openFaq === i ? "#f8fafc" : "white",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", flex: 1 }}>{faq.q}</span>
                    <ChevronDown style={{ width: 14, height: 14, color: "#94a3b8", flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 16px 14px", borderTop: "1px solid #f1f5f9" }}>
                      <p style={{ fontSize: 11, color: "#475569", lineHeight: 1.7, margin: "10px 0 0" }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: contact */}
        <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Contact info */}
          <div style={{ backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 14px" }}>Kontak ICT Helpdesk</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, backgroundColor: "#f8fafc", borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, backgroundColor: "#eff6ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone style={{ width: 14, height: 14, color: "#2563eb" }} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 1px" }}>Telepon Internal</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0 }}>Ext. 1234</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, backgroundColor: "#f8fafc", borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, backgroundColor: "#eff6ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail style={{ width: 14, height: 14, color: "#2563eb" }} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 1px" }}>Email</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0 }}>ict@jne.co.id</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, backgroundColor: "#f8fafc", borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, backgroundColor: "#ecfdf5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MessageSquare style={{ width: 14, height: 14, color: "#059669" }} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 1px" }}>WhatsApp</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0 }}>+62 811-1234-5678</p>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: 10, backgroundColor: "#fffbeb", borderRadius: 8, border: "1px solid #fde68a" }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#92400e", margin: "0 0 2px" }}>Jam Operasional</p>
              <p style={{ fontSize: 11, color: "#92400e", margin: 0 }}>Senin - Jumat: 08.00 - 17.00</p>
              <p style={{ fontSize: 11, color: "#92400e", margin: 0 }}>Sabtu: 08.00 - 12.00</p>
            </div>
          </div>

          {/* Send message */}
          <div style={{ backgroundColor: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 12px" }}>Kirim Pesan</h3>
            {sent ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <p style={{ fontSize: 12, color: "#059669", fontWeight: 600, margin: "0 0 4px" }}>✓ Pesan Terkirim!</p>
                <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Tim ICT akan segera merespons.</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 10 }}>
                  <input type="text" placeholder="Subjek" style={{ width: "100%", padding: "7px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, color: "#374151", outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
                  <textarea
                    placeholder="Tuliskan pertanyaan atau pesan Anda..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    style={{ width: "100%", padding: "7px 10px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 7, color: "#374151", outline: "none", resize: "none", boxSizing: "border-box" }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", fontSize: 12, fontWeight: 600, color: "white", backgroundColor: message.trim() ? "#2563eb" : "#94a3b8", border: "none", borderRadius: 8, cursor: message.trim() ? "pointer" : "not-allowed" }}
                >
                  <Send style={{ width: 13, height: 13 }} />
                  Kirim Pesan
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
