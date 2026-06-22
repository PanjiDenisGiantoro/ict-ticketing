import pool from "@/lib/db"
import { RowDataPacket } from "mysql2"

export async function GET() {
  const [totalRows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) as total FROM kendala"
  )
  const total = totalRows[0].total as number

  const [statusRows] = await pool.query<RowDataPacket[]>(
    "SELECT status, COUNT(*) as count FROM kendala GROUP BY status"
  )
  const statusMap: Record<string, number> = {}
  for (const row of statusRows) {
    statusMap[row.status as string] = row.count as number
  }

  const [prioritasRows] = await pool.query<RowDataPacket[]>(
    "SELECT prioritas, COUNT(*) as count FROM kendala GROUP BY prioritas"
  )
  const prioritasMap: Record<string, number> = {}
  for (const row of prioritasRows) {
    prioritasMap[row.prioritas as string] = row.count as number
  }

  const [aplikasiRows] = await pool.query<RowDataPacket[]>(
    "SELECT aplikasi, COUNT(*) as count FROM kendala GROUP BY aplikasi ORDER BY count DESC LIMIT 5"
  )

  const [recentRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM kendala ORDER BY created_at DESC LIMIT 5"
  )

  const [lastEntry] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM kendala ORDER BY created_at DESC LIMIT 1"
  )

  const [trendRows] = await pool.query<RowDataPacket[]>(
    `SELECT DATE(tanggal) as date, COUNT(*) as count
     FROM kendala
     WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
     GROUP BY DATE(tanggal)
     ORDER BY date ASC`
  )

  const trendData = trendRows.map((r) => ({
    date: new Date(r.date as string).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" }),
    value: r.count as number,
  }))

  const barColors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"]
  const maxAplikasiCount = aplikasiRows.length > 0 ? (aplikasiRows[0].count as number) : 1
  const aplikasiData = aplikasiRows.map((r, i) => ({
    name: r.aplikasi as string,
    value: r.count as number,
    color: barColors[i % barColors.length],
    max: maxAplikasiCount,
  }))

  return Response.json({
    total,
    statusMap,
    prioritasMap,
    aplikasiData,
    recentTickets: recentRows,
    lastEntry: lastEntry[0] || null,
    trendData,
  })
}
