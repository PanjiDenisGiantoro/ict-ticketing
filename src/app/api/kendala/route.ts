import { NextRequest } from "next/server"
import pool from "@/lib/db"
import { RowDataPacket, ResultSetHeader } from "mysql2"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit")) || 10))
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""
  const aplikasi = searchParams.get("aplikasi") || ""
  const prioritas = searchParams.get("prioritas") || ""
  const startDate = searchParams.get("startDate") || ""
  const endDate = searchParams.get("endDate") || ""

  const conditions: string[] = []
  const params: (string | number)[] = []

  if (search) {
    conditions.push("(ticket_id LIKE ? OR judul LIKE ? OR nama_pelapor LIKE ? OR deskripsi LIKE ?)")
    const like = `%${search}%`
    params.push(like, like, like, like)
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
  if (startDate) {
    conditions.push("tanggal >= ?")
    params.push(startDate)
  }
  if (endDate) {
    conditions.push("tanggal <= ?")
    params.push(endDate)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
  const offset = (page - 1) * limit

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM kendala ${where}`,
    params
  )
  const total = countRows[0].total as number

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM kendala ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )

  return Response.json({
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { nama_pelapor, departemen, aplikasi, tipe, kategori, prioritas, judul, deskripsi, langkah } = body

  if (!nama_pelapor || !departemen || !aplikasi || !prioritas || !judul || !deskripsi) {
    return Response.json({ error: "Field wajib belum diisi" }, { status: 400 })
  }

  const now = new Date()
  const year = now.getFullYear()
  const tanggal = now.toISOString().split("T")[0]
  const jam = now.toTimeString().split(" ")[0]

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

  const ticketId = `ICT-${year}-${String(nextNum).padStart(5, "0")}`

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO kendala (ticket_id, tanggal, jam, nama_pelapor, departemen, aplikasi, tipe, kategori, prioritas, judul, deskripsi, langkah, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
    [ticketId, tanggal, jam, nama_pelapor, departemen, aplikasi, tipe || "", kategori || "", prioritas, judul, deskripsi, langkah || ""]
  )

  return Response.json({ id: result.insertId, ticket_id: ticketId }, { status: 201 })
}