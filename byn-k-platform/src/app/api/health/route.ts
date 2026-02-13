import { NextResponse } from 'next/server';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

export async function GET() {
  const startTime = Date.now();
  
  // Test backend connectivity
  let backendStatus = 'unreachable';
  let backendResponse = null;
  let backendError = null;
  
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health/`, {
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
      url: API_BASE_URL,
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
