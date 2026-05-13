import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#f1f5f9" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <DashboardHeader />
        <main style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
