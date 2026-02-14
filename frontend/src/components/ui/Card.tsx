import React, { ReactNode } from 'react'

export interface CardProps {
  title?: string
  children?: ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      )}
      <div className="text-gray-600 space-y-3">{children}</div>
    </div>
  )
}
