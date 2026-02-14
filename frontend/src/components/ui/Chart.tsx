import React from 'react'

export interface ChartProps {
  type?: 'bar' | 'line' | 'pie'
  data: any[]
  title?: string
}

export function Chart({ type = 'bar', data, title }: ChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
      <div className="h-64 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-2">📊</div>
          <div className="font-semibold">{type.toUpperCase()} Chart</div>
          <div className="text-sm mt-2">{data.length} data points</div>
        </div>
      </div>
    </div>
  )
}
