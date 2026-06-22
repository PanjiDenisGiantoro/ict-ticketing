"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { DashboardHeader } from "./dashboard-header"
import { useBreakpoint } from "@/hooks/use-breakpoint"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const bp = useBreakpoint()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = bp !== "desktop"

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f1f5f9",
        position: "relative",
      }}
    >
      {/* Backdrop — mobile only */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 40,
            cursor: "pointer",
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={
          isMobile
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                height: "100%",
                zIndex: 50,
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.25s ease",
              }
            : { flexShrink: 0 }
        }
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <DashboardHeader
          onMenuClick={() => setSidebarOpen((v) => !v)}
          isMobile={isMobile}
        />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: bp === "mobile" ? 12 : 16,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
