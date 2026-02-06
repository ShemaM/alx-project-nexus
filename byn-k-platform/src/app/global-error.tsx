'use client'

import { useEffect } from 'react'
import { isDatabaseError, type PayloadError } from '@/lib/error-utils'

type GlobalErrorProps = {
  error: PayloadError
  reset: () => void
}

/**
 * Global error boundary for the entire application.
 * This catches errors that happen in the root layout, including Payload initialization errors.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    // For now, we log to console in both environments for visibility
    console.error('Global error:', error)
  }, [error])

  const isDbError = isDatabaseError(error)

  return (
    <html>
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            backgroundColor: '#f5f5f5',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '500px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h1
              style={{
                color: '#e53935',
                marginBottom: '1rem',
                fontSize: '1.5rem',
              }}
            >
              {isDbError ? 'Database Connection Error' : 'Something went wrong'}
            </h1>

            <p
              style={{
                color: '#666',
                marginBottom: '1.5rem',
                lineHeight: 1.6,
              }}
            >
              {isDbError
                ? 'Unable to connect to the database. Please ensure the database server is running and the connection settings are correct.'
                : 'An unexpected error occurred while loading the application.'}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '1rem',
                  borderRadius: '4px',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#333',
                  }}
                >
                  Error Details
                </summary>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: '#666',
                  }}
                >
                  {error.message || 'Unknown error'}
                  {error.digest && `\n\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}

            <button
              onClick={() => reset()}
              style={{
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1565c0')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1976d2')}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
