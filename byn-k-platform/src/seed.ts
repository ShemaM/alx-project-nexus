import { getPayload } from 'payload'
import configPromise from './payload.config'

export const seed = async () => {
  const payload = await getPayload({ config: configPromise })

  console.log('🌱 Starting Seed...')

  // 1. Create a Media Logo (Placeholder)
  // Note: For a real seed, you'd upload a file, but we'll skip to Partners for now.

  // 2. Create a Partner (UNHCR)
  const unhcr = await payload.create({
    collection: 'partners',
    data: {
      name: 'UNHCR Kenya',
      website: 'https://www.unhcr.org/ke/',
    },
  })

  const mastercard = await payload.create({
    collection: 'partners',
    data: {
      name: 'Mastercard Foundation',
      website: 'https://mastercardfdn.org/',
    },
  })

  console.log('✅ Partners Created')

  // 3. Create Opportunities
  await payload.create({
    collection: 'opportunities',
    data: {
      title: 'DAFI Scholarship 2026',
      organization: unhcr.id,
      category: 'scholarships',
      documentation: ['alien_card', 'ctd'],
      deadline: '2026-06-30',
      isVerified: true,
      applyLink: 'https://unhcr.org/dafi-apply',
    },
  })

  await payload.create({
    collection: 'opportunities',
    data: {
      title: 'Digital Skills Training Program',
      organization: mastercard.id,
      category: 'jobs',
      documentation: ['alien_card', 'waiting_slip', 'passport'],
      deadline: '2026-03-15',
      isVerified: true,
      applyLink: 'https://mastercardfdn.org/digital-kenya',
    },
  })

  console.log('🚀 Seed Complete: 2 Partners and 2 Opportunities added!')
}