"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DepartemenPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/dashboard/master-data?tab=departemen")
  }, [router])
  return null
}
