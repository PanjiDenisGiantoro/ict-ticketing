"use client"

import { Menu, Bell, HelpCircle, Search } from "lucide-react"

export function DashboardHeader({ onMenuClick, isMobile }: { onMenuClick?: () => void; isMobile?: boolean }) {
  return (
    <header
      style={{
        height: 56,
        flexShrink: 0,
        backgroundColor: "white",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 12,
        zIndex: 10,
      }}
    >
      <button
        onClick={onMenuClick}
        style={{
          padding: 6,
          borderRadius: 6,
          color: "#64748b",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Menu style={{ width: 20, height: 20 }} />
      </button>

      {!isMobile && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>Power Apps</span>
          <span style={{ color: "#cbd5e1" }}>|</span>
          <span style={{ color: "#334155", fontSize: 13, fontWeight: 700 }}>LST_CASE Mobile</span>
        </div>
      )}

      <div style={{ flex: 1, maxWidth: 360, position: "relative" }}>
        <Search
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            width: 15,
            height: 15,
            color: "#94a3b8",
          }}
        />
        <input
          type="text"
          placeholder="Cari kendala, tiket, aplikasi..."
          style={{
            width: "100%",
            paddingLeft: 32,
            paddingRight: 12,
            paddingTop: 6,
            paddingBottom: 6,
            fontSize: 12,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            color: "#475569",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
        <button
          style={{
            position: "relative",
            padding: 6,
            borderRadius: 6,
            color: "#64748b",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Bell style={{ width: 20, height: 20 }} />
          <span
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 16,
              height: 16,
              backgroundColor: "#ef4444",
              borderRadius: "50%",
              color: "white",
              fontSize: 9,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            3
          </span>
        </button>

        <button
          style={{
            padding: 6,
            borderRadius: 6,
            color: "#64748b",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <HelpCircle style={{ width: 20, height: 20 }} />
        </button>

        <button
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#3b82f6",
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          AJ
        </button>
      </div>
    </header>
  )
}
