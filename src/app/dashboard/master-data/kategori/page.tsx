"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function KategoriPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/dashboard/master-data?tab=kategori")
  }, [router])
  return null
}
