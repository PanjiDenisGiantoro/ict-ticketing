import { NextRequest } from "next/server"
import pool from "@/lib/db"
import { RowDataPacket, ResultSetHeader } from "mysql2"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM kendala WHERE id = ?",
    [id]
  )

  if (rows.length === 0) {
    return Response.json({ error: "Data tidak ditemukan" }, { status: 404 })
  }

  return Response.json(rows[0])
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { nama_pelapor, departemen, aplikasi, tipe, kategori, prioritas, judul, deskripsi, langkah, status } = body

  if (!nama_pelapor || !departemen || !aplikasi || !prioritas || !judul || !deskripsi) {
    return Response.json({ error: "Field wajib belum diisi" }, { status: 400 })
  }

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE kendala SET nama_pelapor=?, departemen=?, aplikasi=?, tipe=?, kategori=?, prioritas=?, judul=?, deskripsi=?, langkah=?, status=? WHERE id=?`,
    [nama_pelapor, departemen, aplikasi, tipe || "", kategori || "", prioritas, judul, deskripsi, langkah || "", status || "OPEN", id]
  )

  if (result.affectedRows === 0) {
    return Response.json({ error: "Data tidak ditemukan" }, { status: 404 })
  }

  return Response.json({ success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM kendala WHERE id = ?",
    [id]
  )

  if (result.affectedRows === 0) {
    return Response.json({ error: "Data tidak ditemukan" }, { status: 404 })
  }

  return Response.json({ success: true })
}