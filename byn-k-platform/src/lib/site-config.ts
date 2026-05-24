/**
 * Central place for brand identity, contact details, and external URLs.
 * Fill in the real values once they are confirmed; set to null to hide the item.
 */

export const SITE_NAME = 'Banyamulenge Youth Kenya'
export const SITE_SHORT_NAME = 'BYN-K'
export const SITE_TAGLINE = 'Opportunities for Banyamulenge Youth'

export const CONTACT = {
  email: 'opportunitiesbanyamulengeyouth@gmail.com',
  /** Set to a real number (e.g. '+254712345678') or null to hide the phone entry. */
  phone: null as string | null,
  location: 'Nairobi, Kenya',
}

export const SOCIAL = {
  /** Set each to the full URL or null to hide that icon. */
  facebook: null as string | null,
  twitter: null as string | null,
  instagram: null as string | null,
  linkedin: null as string | null,
}

export const LEGAL = {
  /** Internal routes. Create these pages when the documents are ready. */
  privacyPolicy: '/privacy-policy',
  termsOfService: '/terms',
}
