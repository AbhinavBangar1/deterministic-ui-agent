import React from 'react'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  children: string
  onClick?: () => void
}

export function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors ${variantStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
