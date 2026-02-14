import React, { ReactNode } from 'react'

export interface ModalProps {
  isOpen: boolean
  title?: string
  children?: ReactNode
  onClose?: () => void
}

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        {title && (
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        )}
        <div className="text-gray-600">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
