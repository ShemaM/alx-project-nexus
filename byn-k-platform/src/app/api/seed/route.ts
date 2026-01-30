import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const payload = await getPayload({ config: configPromise })

    // 1. Create Partners
    const unhcr = await payload.create({
      collection: 'partners',
      data: {
        name: 'UNHCR Kenya',
        type: 'ngo',
        website: 'https://www.unhcr.org/ke/',
      },
    })

    const mastercard = await payload.create({
      collection: 'partners',
      data: {
        name: 'Mastercard Foundation',
        type: 'ngo',
        website: 'https://mastercardfdn.org/',
      },
    })

    // 2. Create Opportunities
    await payload.create({
      collection: 'opportunities',
      data: {
        title: 'DAFI Scholarship 2026',
        organization: unhcr.id,
        category: 'scholarships',
        documentation: ['alien_card', 'ctd'],
        deadline: '2026-06-30',
        location: 'kenya',
        isVerified: true,
        applicationType: 'link',
        applyLink: 'https://unhcr.org/dafi-apply',
        descriptionType: 'text',
      },
    })

    await payload.create({
      collection: 'opportunities',
      data: {
        title: 'Digital Skills Training',
        organization: mastercard.id,
        category: 'jobs',
        documentation: ['alien_card', 'waiting_slip'],
        deadline: '2026-03-15',
        location: 'kenya',
        isVerified: true,
        applicationType: 'link',
        applyLink: 'https://mastercardfdn.org/digital-kenya',
        descriptionType: 'text',
      },
    })

    return NextResponse.json({ message: '🌱 Database Seeded Successfully!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}