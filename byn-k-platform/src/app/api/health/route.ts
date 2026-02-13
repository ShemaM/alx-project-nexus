import { NextResponse } from 'next/server';

// Construct base URLs properly
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
// Extract backend base URL (remove /api suffix if present)
const BACKEND_BASE_URL = API_URL.endsWith('/api') 
  ? API_URL.slice(0, -4) 
  : API_URL.replace(/\/api$/, '');

export async function GET() {
  const startTime = Date.now();
  
  // Test backend connectivity
  let backendStatus = 'unreachable';
  let backendResponse = null;
  let backendError = null;
  
  try {
    const healthUrl = `${BACKEND_BASE_URL}/health/`;
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    if (response.ok) {
      backendStatus = 'healthy';
      backendResponse = await response.json();
    } else {
      backendStatus = `error_${response.status}`;
      backendError = `HTTP ${response.status}: ${response.statusText}`;
    }
  } catch (error) {
    backendStatus = 'connection_failed';
    backendError = error instanceof Error ? error.message : 'Unknown error';
  }
  
  const responseTime = Date.now() - startTime;
  
  return NextResponse.json({
    status: backendStatus === 'healthy' ? 'healthy' : 'degraded',
    service: 'byn-k-frontend',
    timestamp: new Date().toISOString(),
    response_time_ms: responseTime,
    backend: {
      url: BACKEND_BASE_URL,
      status: backendStatus,
      response: backendResponse,
      error: backendError,
    },
    environment: {
      node_env: process.env.NODE_ENV,
      api_url_configured: !!process.env.NEXT_PUBLIC_API_URL,
      nextauth_url_configured: !!process.env.NEXTAUTH_URL,
    },
  });
}
