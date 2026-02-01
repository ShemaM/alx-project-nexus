/**
 * Error utility functions for error boundaries
 * 
 * @module lib/error-utils
 */

/**
 * Extended Error type that may contain Payload-specific properties
 */
export interface PayloadError extends Error {
  digest?: string
  payloadInitError?: boolean
}

/**
 * Checks if an error is related to database connection issues
 * 
 * @param error - The error to check
 * @returns true if the error appears to be database-related
 */
export function isDatabaseError(error: PayloadError): boolean {
  const message = error.message?.toLowerCase() || ''
  
  return (
    message.includes('cannot connect to postgres') ||
    message.includes('database') ||
    message.includes('econnrefused') ||
    message.includes('etimedout') ||
    error.payloadInitError === true
  )
}
