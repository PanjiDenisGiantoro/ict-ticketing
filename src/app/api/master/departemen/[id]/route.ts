import { NextRequest } from "next/server"
import pool from "@/lib/db"
import { ResultSetHeader } from "mysql2"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { kode, nama, atasan, total_staff } = await request.json()
  if (!kode || !nama) return Response.json({ error: "Kode dan Nama wajib diisi" }, { status: 400 })
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE master_departemen SET kode=?, nama=?, atasan=?, total_staff=? WHERE id=?",
    [kode, nama, atasan || "", total_staff || 0, id]
  )
  if (result.affectedRows === 0) return Response.json({ error: "Data tidak ditemukan" }, { status: 404 })
  return Response.json({ success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM master_departemen WHERE id=?", [id])
  if (result.affectedRows === 0) return Response.json({ error: "Data tidak ditemukan" }, { status: 404 })
  return Response.json({ success: true })
}
