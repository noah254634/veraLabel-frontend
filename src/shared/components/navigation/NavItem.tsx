// shared/components/navigation/NavItem.tsx
import { NavLink } from "react-router-dom"
import React from "react"

type NavItemProps = {
  to: string
  label: string
  icon?: React.ReactNode
}

export function NavItem({ to, label, icon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 p-3 rounded-md hover:bg-slate-800 ${
          isActive ? "bg-slate-700 font-semibold" : ""
        }`
      }
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </NavLink>
  )
}
