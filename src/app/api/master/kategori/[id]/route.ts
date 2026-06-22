import { NextRequest } from "next/server"
import pool from "@/lib/db"
import { ResultSetHeader } from "mysql2"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { nama, prioritas_default, sla } = await request.json()
  if (!nama) return Response.json({ error: "Nama wajib diisi" }, { status: 400 })
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE master_kategori SET nama=?, prioritas_default=?, sla=? WHERE id=?",
    [nama, prioritas_default || "MEDIUM", sla || "", id]
  )
  if (result.affectedRows === 0) return Response.json({ error: "Data tidak ditemukan" }, { status: 404 })
  return Response.json({ success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM master_kategori WHERE id=?", [id])
  if (result.affectedRows === 0) return Response.json({ error: "Data tidak ditemukan" }, { status: 404 })
  return Response.json({ success: true })
}
