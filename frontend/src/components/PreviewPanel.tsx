'use client'

import { useEffect, useRef, useState } from 'react'

interface PreviewPanelProps {
  code: string
}

export function PreviewPanel({ code }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code || !iframeRef.current) return

    try {
      setError(null)
      const html = generatePreviewHTML(code)
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(html)
        iframeDoc.close()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error rendering preview')
    }
  }, [code])

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-3 border-b flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold">Live Preview</h2>
          <p className="text-xs text-gray-500">Real-time UI rendering</p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="flex-1 relative">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600 p-4">
            <div className="text-center">
              <p className="font-semibold mb-2">Preview Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!code && !error && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2"></p>
              <p className="text-sm">Preview will appear here</p>
            </div>
          </div>
        )}

        {code && !error && (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="UI Preview"
            srcDoc={generatePreviewHTML(code)}
          />
        )}
      </div>
    </div>
  )
}


function generatePreviewHTML(code: string): string {
  const componentStyles = `
    .layout-single { max-width: 600px; margin: 0 auto; padding: 2rem; }
    .layout-two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem; }
    .layout-three-column { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; padding: 2rem; }
    .layout-dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; padding: 2rem; }
  `

  const transformedCode = code
    .replace(/import .* from '@\/components\/ui'/g, '')
    .replace(/export default function GeneratedUI\(\)/g, 'function GeneratedUI()')

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <!-- React -->
      <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

      <!-- Babel (IMPORTANT FIX) -->
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

      <!-- Tailwind -->
      <script src="https://cdn.tailwindcss.com"></script>

      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; background: #f5f5f5; min-height: 100vh; }
        ${componentStyles}
      </style>
    </head>
    <body>
      <div id="root"></div>

      <!-- IMPORTANT: type="text/babel" -->
      <script type="text/babel">
        const { createElement: h, useState } = React;
        const { createRoot } = ReactDOM;

        ${getComponentImplementations()}

        ${transformedCode}

        const root = createRoot(document.getElementById('root'));
        root.render(<GeneratedUI />);
      </script>
    </body>
    </html>
  `
}



function getComponentImplementations(): string {
  return `
    function Button({ variant = 'primary', children, onClick }) {
      const styles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700'
      };
      return h('button', {
        className: 'px-4 py-2 rounded-md font-medium transition-colors ' + styles[variant],
        onClick
      }, children);
    }

    function Card({ title, children }) {
      return h('div', { className: 'bg-white rounded-lg shadow-md p-6 border border-gray-200' },
        title && h('h3', { className: 'text-xl font-semibold mb-4 text-gray-800' }, title),
        h('div', { className: 'text-gray-600 space-y-3' }, children)
      );
    }

    function Input({ type = 'text', placeholder, value, onChange }) {
      return h('input', {
        type,
        placeholder,
        value,
        onChange,
        className: 'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
      });
    }

    function Table({ columns, data, headers }) {
      const displayHeaders = headers || columns;
      return h('div', { className: 'overflow-x-auto' },
        h('table', { className: 'min-w-full bg-white border border-gray-200 rounded-lg' },
          h('thead', { className: 'bg-gray-50' },
            h('tr', null, displayHeaders.map((header, i) =>
              h('th', {
                key: i,
                className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'
              }, header)
            ))
          ),
          h('tbody', { className: 'divide-y divide-gray-200' },
            data.map((row, i) =>
              h('tr', { key: i, className: 'hover:bg-gray-50' },
                row.map((cell, j) =>
                  h('td', {
                    key: j,
                    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                  }, cell)
                )
              )
            )
          )
        )
      );
    }

    function Modal({ isOpen, title, children, onClose }) {
      if (!isOpen) return null;
      return h('div', { className: 'fixed inset-0 z-50 flex items-center justify-center' },
        h('div', { className: 'fixed inset-0 bg-black bg-opacity-50', onClick: onClose }),
        h('div', { className: 'relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10' },
          title && h('h2', { className: 'text-2xl font-bold mb-4 text-gray-800' }, title),
          h('div', { className: 'text-gray-600' }, children),
          onClose && h('button', {
            onClick: onClose,
            className: 'absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl'
          }, '×')
        )
      );
    }

    function Sidebar({ items = [], children }) {
      return h('div', { className: 'w-64 bg-gray-800 text-white h-full p-4' },
        items.length > 0 && h('nav', { className: 'space-y-2' },
          items.map((item, i) =>
            h('a', {
              key: i,
              href: '#',
              className: 'block px-4 py-2 rounded hover:bg-gray-700 transition-colors'
            }, item)
          )
        ),
        children && h('div', { className: 'mt-4' }, children)
      );
    }

    function Navbar({ title, items = [] }) {
      return h('nav', { className: 'bg-blue-600 text-white p-4 shadow-lg' },
        h('div', { className: 'container mx-auto flex items-center justify-between' },
          title && h('div', { className: 'text-xl font-bold' }, title),
          items.length > 0 && h('div', { className: 'flex space-x-6' },
            items.map((item, i) =>
              h('a', {
                key: i,
                href: '#',
                className: 'hover:text-blue-200 transition-colors'
              }, item)
            )
          )
        )
      );
    }

    function Chart({ type = 'bar', data, title }) {
      return h('div', { className: 'bg-white p-6 rounded-lg border border-gray-200' },
        title && h('h3', { className: 'text-lg font-semibold mb-4 text-gray-800' }, title),
        h('div', { className: 'h-64 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-center justify-center' },
          h('div', { className: 'text-center text-gray-600' },
            h('div', { className: 'text-4xl mb-2' }, ''),
            h('div', { className: 'font-semibold' }, type.toUpperCase() + ' Chart'),
            h('div', { className: 'text-sm mt-2' }, data.length + ' data points')
          )
        )
      );
    }
  `
}

