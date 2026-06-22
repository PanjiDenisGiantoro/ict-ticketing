import { NextRequest } from "next/server"
import pool from "@/lib/db"
import { RowDataPacket } from "mysql2"
import * as XLSX from "xlsx"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const format = searchParams.get("format") || "xlsx"
  const startDate = searchParams.get("startDate") || ""
  const endDate = searchParams.get("endDate") || ""
  const status = searchParams.get("status") || ""
  const aplikasi = searchParams.get("aplikasi") || ""
  const prioritas = searchParams.get("prioritas") || ""
  const type = searchParams.get("type") || "detail"

  const conditions: string[] = []
  const params: string[] = []

  if (startDate) {
    conditions.push("tanggal >= ?")
    params.push(startDate)
  }
  if (endDate) {
    conditions.push("tanggal <= ?")
    params.push(endDate)
  }
  if (status) {
    conditions.push("status = ?")
    params.push(status)
  }
  if (aplikasi) {
    conditions.push("aplikasi = ?")
    params.push(aplikasi)
  }
  if (prioritas) {
    conditions.push("prioritas = ?")
    params.push(prioritas)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

  if (type === "summary") {
    const [totalRows] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM kendala ${where}`, params)
    const [statusRows] = await pool.query<RowDataPacket[]>(`SELECT status, COUNT(*) as jumlah FROM kendala ${where} GROUP BY status`, params)
    const [appRows] = await pool.query<RowDataPacket[]>(`SELECT aplikasi, COUNT(*) as jumlah FROM kendala ${where} GROUP BY aplikasi ORDER BY jumlah DESC`, params)
    const [prioRows] = await pool.query<RowDataPacket[]>(`SELECT prioritas, COUNT(*) as jumlah FROM kendala ${where} GROUP BY prioritas`, params)

    const wb = XLSX.utils.book_new()

    const summaryData = [{ Keterangan: "Total Kendala", Jumlah: totalRows[0].total }]
    for (const r of statusRows) summaryData.push({ Keterangan: `Status: ${r.status}`, Jumlah: r.jumlah })
    for (const r of prioRows) summaryData.push({ Keterangan: `Prioritas: ${r.prioritas}`, Jumlah: r.jumlah })
    const wsSummary = XLSX.utils.json_to_sheet(summaryData)
    wsSummary["!cols"] = [{ wch: 25 }, { wch: 10 }]
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary")

    const wsApp = XLSX.utils.json_to_sheet(appRows.map((r) => ({ Aplikasi: r.aplikasi, Jumlah: r.jumlah })))
    wsApp["!cols"] = [{ wch: 20 }, { wch: 10 }]
    XLSX.utils.book_append_sheet(wb, wsApp, "Per Aplikasi")

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
    return new Response(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=laporan_summary_kendala.xlsx",
      },
    })
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT ticket_id, tanggal, jam, nama_pelapor, departemen, aplikasi, tipe, kategori, prioritas, judul, deskripsi, langkah, status, created_at FROM kendala ${where} ORDER BY created_at DESC`,
    params
  )

  const exportData = rows.map((r) => ({
    "ID Ticket": r.ticket_id,
    "Tanggal": new Date(r.tanggal as string).toLocaleDateString("id-ID"),
    "Jam": r.jam,
    "Nama Pelapor": r.nama_pelapor,
    "Departemen": r.departemen,
    "Aplikasi": r.aplikasi,
    "Tipe": r.tipe,
    "Kategori": r.kategori,
    "Prioritas": r.prioritas,
    "Judul Kendala": r.judul,
    "Deskripsi": r.deskripsi,
    "Langkah Reproduksi": r.langkah,
    "Status": r.status,
  }))

  if (format === "csv") {
    const ws = XLSX.utils.json_to_sheet(exportData)
    const csv = XLSX.utils.sheet_to_csv(ws)
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=laporan_kendala.csv",
      },
    })
  }

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(exportData)
  ws["!cols"] = [
    { wch: 18 }, { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 16 },
    { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 10 }, { wch: 35 },
    { wch: 45 }, { wch: 35 }, { wch: 14 },
  ]
  XLSX.utils.book_append_sheet(wb, ws, "Data Kendala")

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=laporan_kendala.xlsx",
    },
  })
}
