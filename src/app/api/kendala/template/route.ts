import * as XLSX from "xlsx"

export async function GET() {
  const headers = [
    "ID Ticket",
    "Nama Pelapor",
    "Departemen",
    "Aplikasi",
    "Tipe",
    "Kategori",
    "Prioritas",
    "Judul Kendala",
    "Deskripsi",
    "Langkah Reproduksi",
    "Status",
  ]

  const sampleData = [
    {
      "ID Ticket": "",
      "Nama Pelapor": "AJ ZARKASIH",
      "Departemen": "ICT Ticketing",
      "Aplikasi": "LST_CASE",
      "Tipe": "Mobile",
      "Kategori": "Login / Autentikasi",
      "Prioritas": "HIGH",
      "Judul Kendala": "Tidak bisa login aplikasi",
      "Deskripsi": "Tidak bisa login ke aplikasi sejak pagi ini",
      "Langkah Reproduksi": "1. Buka aplikasi\n2. Input username & password\n3. Klik Login\n4. Muncul error",
      "Status": "OPEN",
    },
    {
      "ID Ticket": "ICT-2025-00128",
      "Nama Pelapor": "SRI WAHYUNI",
      "Departemen": "Finance",
      "Aplikasi": "HRIS",
      "Tipe": "Web",
      "Kategori": "Data Tidak Tampil",
      "Prioritas": "MEDIUM",
      "Judul Kendala": "Data laporan tidak tampil",
      "Deskripsi": "Halaman laporan keuangan kosong",
      "Langkah Reproduksi": "",
      "Status": "IN PROGRESS",
    },
  ]

  const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers })

  ws["!cols"] = [
    { wch: 18 },
    { wch: 20 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 22 },
    { wch: 10 },
    { wch: 35 },
    { wch: 45 },
    { wch: 35 },
    { wch: 14 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Template Kendala")

  const notesData = [
    { "Kolom": "ID Ticket", "Keterangan": "Kosongkan untuk data baru (auto-generate). Isi untuk update data existing." },
    { "Kolom": "Nama Pelapor", "Keterangan": "Wajib diisi. Nama lengkap pelapor." },
    { "Kolom": "Departemen", "Keterangan": "Wajib diisi. Contoh: ICT Ticketing, Finance, Operational, Marketing, IT Support, HRD, Accounting, Procurement" },
    { "Kolom": "Aplikasi", "Keterangan": "Wajib diisi. Contoh: LST_CASE, HRIS, E-CLAIM, EMAIL, VPN, Portal Internal, SAP" },
    { "Kolom": "Tipe", "Keterangan": "Opsional. Contoh: Mobile, Web, Client, Microsoft 365" },
    { "Kolom": "Kategori", "Keterangan": "Opsional. Contoh: Login / Autentikasi, Tampilan / UI Error, Upload / Download File, Koneksi / Jaringan, Data Tidak Tampil, Bug / Error Sistem" },
    { "Kolom": "Prioritas", "Keterangan": "Wajib. Nilai: HIGH, MEDIUM, atau LOW" },
    { "Kolom": "Judul Kendala", "Keterangan": "Wajib diisi. Ringkasan singkat kendala." },
    { "Kolom": "Deskripsi", "Keterangan": "Wajib diisi. Penjelasan detail kendala." },
    { "Kolom": "Langkah Reproduksi", "Keterangan": "Opsional. Langkah-langkah mereproduksi kendala." },
    { "Kolom": "Status", "Keterangan": "Nilai: OPEN, IN PROGRESS, RESOLVED, ESCALATED, CLOSED. Default: OPEN" },
  ]

  const wsNotes = XLSX.utils.json_to_sheet(notesData)
  wsNotes["!cols"] = [{ wch: 20 }, { wch: 80 }]
  XLSX.utils.book_append_sheet(wb, wsNotes, "Petunjuk")

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=template_kendala.xlsx",
    },
  })
}
