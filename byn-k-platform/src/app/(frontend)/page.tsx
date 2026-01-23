import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'

type AuthUser = {
  email?: string | null
}

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  let user: AuthUser | null = null

  try {
    const payload = await getPayload({ config: payloadConfig })
    const authResult = await payload.auth({ headers })
    user = authResult.user
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Payload initialization failed:', err)
    }
  }

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="home">
      <div className="content">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && (
          <>
            <h1>Welcome to your new project.</h1>
            <p>
              {process.env.NODE_ENV === 'production'
                ? 'Authentication is temporarily unavailable. Please try again later.'
                : 'Database connection unavailable. Please check your configuration.'}
            </p>
          </>
        )}
        {user && <h1>Welcome back, {user.email}</h1>}
        <div className="links">
          <a
            className="admin"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="docs"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
      <div className="footer">
        <p>Update this page by editing</p>
        <a className="codeLink" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}
