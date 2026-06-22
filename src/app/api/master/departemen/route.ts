import { NextRequest } from "next/server"
import pool from "@/lib/db"
import { RowDataPacket, ResultSetHeader } from "mysql2"

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") || ""
  const conditions: string[] = []
  const params: string[] = []
  if (search) {
    conditions.push("(kode LIKE ? OR nama LIKE ?)")
    params.push(`%${search}%`, `%${search}%`)
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM master_departemen ${where} ORDER BY id ASC`, params
  )
  return Response.json(rows)
}

export async function POST(request: NextRequest) {
  const { kode, nama, atasan, total_staff } = await request.json()
  if (!kode || !nama) return Response.json({ error: "Kode dan Nama wajib diisi" }, { status: 400 })
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO master_departemen (kode, nama, atasan, total_staff) VALUES (?, ?, ?, ?)",
    [kode, nama, atasan || "", total_staff || 0]
  )
  return Response.json({ id: result.insertId }, { status: 201 })
}
