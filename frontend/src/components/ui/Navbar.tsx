import React from 'react'

export interface NavbarProps {
  title?: string
  items?: string[]
}

export function Navbar({ title, items = [] }: NavbarProps) {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {title && <div className="text-xl font-bold">{title}</div>}
        {items.length > 0 && (
          <div className="flex space-x-6">
            {items.map((item, index) => (
              <a
                key={index}
                href="#"
                className="hover:text-blue-200 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
