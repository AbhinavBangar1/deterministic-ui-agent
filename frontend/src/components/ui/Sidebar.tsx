import React, { ReactNode } from 'react'

export interface SidebarProps {
  items?: string[]
  children?: ReactNode
}

export function Sidebar({ items = [], children }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      {items.length > 0 && (
        <nav className="space-y-2">
          {items.map((item, index) => (
            <a
              key={index}
              href="#"
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
