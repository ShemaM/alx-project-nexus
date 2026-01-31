'use client'

import { useEffect } from 'react'

type ErrorProps = {
  error: Error & { digest?: string; payloadInitError?: boolean }
  reset: () => void
}

/**
 * Error boundary for the admin panel.
 * Displays a user-friendly error page when the admin panel fails to load,
 * such as when the database connection fails.
 */
export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Admin panel error:', error)
    }
  }, [error])

  // Check if this is a database connection error
  const isDatabaseError =
    error.message?.includes('cannot connect to Postgres') ||
    error.message?.includes('database') ||
    error.message?.includes('ECONNREFUSED') ||
    error.payloadInitError === true

  return (
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
          {isDatabaseError ? 'Database Connection Error' : 'Something went wrong'}
        </h1>

        <p
          style={{
            color: '#666',
            marginBottom: '1.5rem',
            lineHeight: 1.6,
          }}
        >
          {isDatabaseError
            ? 'Unable to connect to the database. Please ensure the database server is running and the connection settings are correct.'
            : 'An unexpected error occurred while loading the admin panel.'}
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
  )
}
