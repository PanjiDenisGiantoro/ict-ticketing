import { NextRequest } from "next/server"
import pool from "@/lib/db"
import { RowDataPacket, ResultSetHeader } from "mysql2"

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") || ""
  const conditions: string[] = []
  const params: string[] = []
  if (search) {
    conditions.push("nama LIKE ?")
    params.push(`%${search}%`)
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM master_kategori ${where} ORDER BY id ASC`, params
  )
  return Response.json(rows)
}

export async function POST(request: NextRequest) {
  const { nama, prioritas_default, sla } = await request.json()
  if (!nama) return Response.json({ error: "Nama wajib diisi" }, { status: 400 })
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO master_kategori (nama, prioritas_default, sla) VALUES (?, ?, ?)",
    [nama, prioritas_default || "MEDIUM", sla || ""]
  )
  return Response.json({ id: result.insertId }, { status: 201 })
}
