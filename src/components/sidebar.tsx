"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  LayoutDashboard,
  List,
  FilePlus,
  Ticket,
  CheckSquare,
  BarChart2,
  Download,
  Database,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react"

type NavChild = { name: string; href: string }
type NavItem = {
  name: string
  href?: string
  icon: React.ElementType
  children?: NavChild[]
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "List Kendala", href: "/dashboard/list-kendala", icon: List },
  { name: "Input Kendala", href: "/dashboard/input-kendala", icon: FilePlus },
  { name: "My Ticket", href: "/dashboard/my-ticket", icon: Ticket },
  {
    name: "Approval",
    icon: CheckSquare,
    children: [
      { name: "List Approval", href: "/dashboard/approval" },
      { name: "Riwayat Approval", href: "/dashboard/approval/riwayat" },
    ],
  },
  {
    name: "Reports",
    icon: BarChart2,
    children: [
      { name: "Summary", href: "/dashboard/reports" },
      { name: "Detail Report", href: "/dashboard/reports/detail" },
    ],
  },
  { name: "Download Report", href: "/dashboard/download-report", icon: Download },
  {
    name: "Master Data",
    icon: Database,
    children: [
      { name: "Aplikasi", href: "/dashboard/master-data?tab=aplikasi" },
      { name: "Departemen", href: "/dashboard/master-data?tab=departemen" },
      { name: "Kategori", href: "/dashboard/master-data?tab=kategori" },
    ],
  },
  { name: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
  { name: "Bantuan", href: "/dashboard/bantuan", icon: HelpCircle },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <Suspense>
      <SidebarContent onClose={onClose} />
    </Suspense>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")

  const [expanded, setExpanded] = useState<string[]>(() => {
    return navigation
      .filter((item) => item.children?.some((c) => {
        const [cPath] = c.href.split("?")
        return pathname.startsWith(cPath)
      }))
      .map((item) => item.name)
  })

  const toggle = (name: string) => {
    setExpanded((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  const isChildActive = (item: NavItem) =>
    item.children?.some((c) => {
      if (c.href.includes("?")) return fullPath === c.href
      return pathname === c.href || pathname.startsWith(c.href + "/")
    }) ?? false

  return (
    <div
      style={{
        width: 152,
        flexShrink: 0,
        height: "100%",
        backgroundColor: "#0D1526",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              fontWeight: 900,
              fontSize: 13,
              padding: "2px 6px",
              borderRadius: 3,
              letterSpacing: 1,
            }}
          >
            JNE
          </div>
          <div style={{ color: "#64748b", fontSize: 8, letterSpacing: 3, marginTop: 2 }}>
            EXPRESS
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, paddingTop: 8, paddingBottom: 8 }}>
        {navigation.map((item) => {
          const hasChildren = !!item.children
          const isOpen = expanded.includes(item.name)
          const isActive = item.href
            ? pathname === item.href
            : isChildActive(item)

          if (hasChildren) {
            return (
              <div key={item.name}>
                {/* Parent toggle button */}
                <button
                  onClick={() => toggle(item.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 12px",
                    fontSize: 11,
                    fontWeight: 500,
                    color: isActive ? "#ffffff" : "#94a3b8",
                    backgroundColor: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                    borderLeft: isActive ? "3px solid #60a5fa" : "3px solid transparent",
                    border: "none",
                    borderLeftStyle: "solid",
                    borderLeftWidth: 3,
                    borderLeftColor: isActive ? "#60a5fa" : "transparent",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <item.icon
                    style={{
                      width: 15,
                      height: 15,
                      flexShrink: 0,
                      color: isActive ? "#60a5fa" : "#94a3b8",
                    }}
                  />
                  <span style={{ flex: 1, lineHeight: 1.2 }}>{item.name}</span>
                  {isOpen
                    ? <ChevronDown style={{ width: 11, height: 11, opacity: 0.5 }} />
                    : <ChevronRight style={{ width: 11, height: 11, opacity: 0.5 }} />
                  }
                </button>

                {/* Sub-items */}
                {isOpen && (
                  <div style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                    {item.children!.map((child) => {
                      const childActive = child.href.includes("?")
                        ? fullPath === child.href
                        : pathname === child.href || pathname.startsWith(child.href + "/")
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => onClose?.()}
                          style={{
                            display: "block",
                            padding: "7px 12px 7px 32px",
                            fontSize: 10,
                            fontWeight: childActive ? 600 : 400,
                            color: childActive ? "#93c5fd" : "#64748b",
                            borderLeft: childActive ? "3px solid #60a5fa" : "3px solid transparent",
                            textDecoration: "none",
                          }}
                        >
                          {child.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href!}
              onClick={() => onClose?.()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 12px",
                fontSize: 11,
                fontWeight: 500,
                color: isActive ? "#ffffff" : "#94a3b8",
                backgroundColor: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                borderLeft: `3px solid ${isActive ? "#60a5fa" : "transparent"}`,
                textDecoration: "none",
              }}
            >
              <item.icon
                style={{
                  width: 15,
                  height: 15,
                  flexShrink: 0,
                  color: isActive ? "#60a5fa" : "#94a3b8",
                }}
              />
              <span style={{ flex: 1, lineHeight: 1.2 }}>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: 8, flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 6px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 10,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            AJ
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "white", fontSize: 10, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              AJ ZARKASIH
            </div>
            <div style={{ color: "#64748b", fontSize: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              ICT Ticketing
            </div>
          </div>
          <ChevronDown style={{ width: 11, height: 11, color: "#64748b", flexShrink: 0 }} />
        </div>
        <Link
          href="/logout"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#94a3b8",
            fontSize: 10,
            padding: "4px 6px",
            borderRadius: 4,
            textDecoration: "none",
            marginTop: 4,
          }}
        >
          <LogOut style={{ width: 11, height: 11 }} />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  )
}
