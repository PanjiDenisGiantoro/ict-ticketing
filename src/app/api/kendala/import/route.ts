import { NextRequest } from "next/server"
import pool from "@/lib/db"
import { RowDataPacket, ResultSetHeader } from "mysql2"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return Response.json({ error: "File tidak ditemukan" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer, { type: "buffer" })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

  if (rows.length === 0) {
    return Response.json({ error: "File Excel kosong" }, { status: 400 })
  }

  let inserted = 0
  let updated = 0
  let skipped = 0
  const errors: string[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2

    const nama_pelapor = String(row["Nama Pelapor"] || "").trim()
    const departemen = String(row["Departemen"] || "").trim()
    const aplikasi = String(row["Aplikasi"] || "").trim()
    const tipe = String(row["Tipe"] || "").trim()
    const kategori = String(row["Kategori"] || "").trim()
    const prioritas = String(row["Prioritas"] || "").trim().toUpperCase()
    const judul = String(row["Judul Kendala"] || "").trim()
    const deskripsi = String(row["Deskripsi"] || "").trim()
    const langkah = String(row["Langkah Reproduksi"] || "").trim()
    const status = String(row["Status"] || "OPEN").trim().toUpperCase()
    const ticketIdRaw = String(row["ID Ticket"] || "").trim()

    if (!nama_pelapor || !departemen || !aplikasi || !judul || !deskripsi) {
      errors.push(`Baris ${rowNum}: Field wajib kosong (Nama Pelapor, Departemen, Aplikasi, Judul, Deskripsi)`)
      skipped++
      continue
    }

    if (!["HIGH", "MEDIUM", "LOW"].includes(prioritas)) {
      errors.push(`Baris ${rowNum}: Prioritas tidak valid (harus HIGH/MEDIUM/LOW)`)
      skipped++
      continue
    }

    const validStatuses = ["OPEN", "IN PROGRESS", "RESOLVED", "ESCALATED", "CLOSED"]
    if (!validStatuses.includes(status)) {
      errors.push(`Baris ${rowNum}: Status tidak valid`)
      skipped++
      continue
    }

    const now = new Date()
    const tanggal = now.toISOString().split("T")[0]
    const jam = now.toTimeString().split(" ")[0]

    if (ticketIdRaw) {
      const [existing] = await pool.query<RowDataPacket[]>(
        "SELECT id FROM kendala WHERE ticket_id = ?",
        [ticketIdRaw]
      )

      if (existing.length > 0) {
        await pool.query<ResultSetHeader>(
          `UPDATE kendala SET nama_pelapor=?, departemen=?, aplikasi=?, tipe=?, kategori=?, prioritas=?, judul=?, deskripsi=?, langkah=?, status=? WHERE ticket_id=?`,
          [nama_pelapor, departemen, aplikasi, tipe, kategori, prioritas, judul, deskripsi, langkah, status, ticketIdRaw]
        )
        updated++
        continue
      }
    }

    const year = now.getFullYear()
    const [lastRow] = await pool.query<RowDataPacket[]>(
      "SELECT ticket_id FROM kendala WHERE ticket_id LIKE ? ORDER BY id DESC LIMIT 1",
      [`ICT-${year}-%`]
    )

    let nextNum = 1
    if (lastRow.length > 0) {
      const lastId = lastRow[0].ticket_id as string
      const lastNum = parseInt(lastId.split("-")[2], 10)
      nextNum = lastNum + 1
    }

    const ticketId = ticketIdRaw || `ICT-${year}-${String(nextNum).padStart(5, "0")}`

    await pool.query<ResultSetHeader>(
      `INSERT INTO kendala (ticket_id, tanggal, jam, nama_pelapor, departemen, aplikasi, tipe, kategori, prioritas, judul, deskripsi, langkah, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ticketId, tanggal, jam, nama_pelapor, departemen, aplikasi, tipe, kategori, prioritas, judul, deskripsi, langkah, status]
    )
    inserted++
  }

  return Response.json({
    total: rows.length,
    inserted,
    updated,
    skipped,
    errors: errors.slice(0, 20),
  })
}
