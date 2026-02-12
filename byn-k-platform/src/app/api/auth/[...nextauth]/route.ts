import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import LinkedInProvider from 'next-auth/providers/linkedin'

const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

const providers: NextAuthOptions['providers'] = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  providers.push(
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      issuer: 'https://www.linkedin.com',
      wellKnown: 'https://www.linkedin.com/oauth/.well-known/openid-configuration',
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
    })
  )
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers,
  callbacks: {
    async jwt({ token, account }) {
      if (account && (account.provider === 'google' || account.provider === 'linkedin')) {
        try {
          const response = await fetch(`${APP_URL}/api/auth/social`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              provider: account.provider,
              access_token: account.access_token,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            const mutableToken = token as any
            mutableToken.djangoAccessToken = data.access || data.access_token || null
            mutableToken.djangoRefreshToken = data.refresh || data.refresh_token || null
            mutableToken.djangoUser = data.user || null
          }
        } catch (error) {
          console.error('Failed to exchange social token with Django:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      ;(session as any).djangoAccessToken = (token as any).djangoAccessToken || null
      ;(session as any).djangoRefreshToken = (token as any).djangoRefreshToken || null
      ;(session as any).djangoUser = (token as any).djangoUser || null
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
