import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
])

// Browser origin/referer values are for the Next.js app host, not the upstream Django API.
// Forwarding them causes Django CSRF origin checks to fail in local proxy setups.
const UPSTREAM_HEADER_BLOCKLIST = new Set([
  'origin',
  'referer',
])

export const dynamic = 'force-dynamic'

/**
 * Extract CSRF token from cookies
 */
function extractCsrfToken(request: NextRequest): string | null {
  const csrfCookie = request.cookies.get('csrftoken')
  return csrfCookie?.value || null
}

function buildBaseCandidates(baseUrl: string): string[] {
  const candidates = [baseUrl]
  if (baseUrl.endsWith('/api')) {
    const withoutApi = baseUrl.slice(0, -4).replace(/\/$/, '')
    if (withoutApi) candidates.push(withoutApi)
  } else {
    candidates.push(`${baseUrl}/api`)
  }
  return [...new Set(candidates)]
}

function buildPathCandidates(path: string, method: string): string[] {
  const normalizedPath = path.replace(/^\/+/, '')
  if (!normalizedPath) return ['']

  const hasTrailingSlash = normalizedPath.endsWith('/')
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(normalizedPath)
  if (hasTrailingSlash || hasFileExtension) {
    return [normalizedPath]
  }

  const slashVariant = `${normalizedPath}/`
  const upperMethod = method.toUpperCase()
  if (upperMethod === 'GET' || upperMethod === 'HEAD') {
    return [normalizedPath, slashVariant]
  }

  // Prefer trailing slashes for write requests to match DRF's APPEND_SLASH behavior.
  return [slashVariant, normalizedPath]
}

async function handler(
  request: NextRequest,
  { params }: { params: { path: string[] } | Promise<{ path: string[] }> }
) {
  const resolvedParams = await Promise.resolve(params)
  const pathSegments = resolvedParams.path || []
  const proxyPrefix = '/api/proxy/'
  const requestPathname = request.nextUrl.pathname
  const upstreamPath =
    requestPathname.startsWith(proxyPrefix)
      ? requestPathname.slice(proxyPrefix.length)
      : pathSegments.join('/')
  const baseCandidates = buildBaseCandidates(API_BASE_URL)
  const pathCandidates = buildPathCandidates(upstreamPath, request.method)

  const headers = new Headers(request.headers)
  for (const header of HOP_BY_HOP_HEADERS) {
    headers.delete(header)
  }
  for (const header of UPSTREAM_HEADER_BLOCKLIST) {
    headers.delete(header)
  }
  headers.delete('content-length')

  // Add CSRF token header for write requests if available
  const isWriteRequest = request.method !== 'GET' && request.method !== 'HEAD'
  if (isWriteRequest) {
    const csrfToken = extractCsrfToken(request)
    if (csrfToken && !headers.has('X-CSRFToken')) {
      headers.set('X-CSRFToken', csrfToken)
    }
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'follow', // Follow redirects automatically to handle Django's APPEND_SLASH
    cache: 'no-store',
  }

  if (isWriteRequest) {
    init.body = await request.text()
  }

  try {
    let upstreamResponse: Response | null = null

    for (const pathCandidate of pathCandidates) {
      for (const base of baseCandidates) {
        const upstreamUrl = `${base}/${pathCandidate}${request.nextUrl.search}`
        const response = await fetch(upstreamUrl, init)

        // Retry against alternate path/base variants only when endpoint is not found.
        if (response.status === 404) {
          upstreamResponse = response
          continue
        }

        upstreamResponse = response
        break
      }

      if (upstreamResponse && upstreamResponse.status !== 404) {
        break
      }
    }

    if (!upstreamResponse) {
      return NextResponse.json({ error: 'No upstream response' }, { status: 502 })
    }

    const responseHeaders = new Headers(upstreamResponse.headers)
    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    const attempted = pathCandidates
      .flatMap((pathCandidate) => baseCandidates.map((base) => `${base}/${pathCandidate}`))
      .join(', ')
    console.error(`Proxy request failed for ${attempted}:`, error)
    return NextResponse.json(
      { error: 'Upstream API request failed' },
      { status: 502 }
    )
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS }
