import { getPayload } from 'payload'
import configPromise from './payload.config'

export const seed = async () => {
  const payload = await getPayload({ config: configPromise })

  console.log('🌱 Starting Seed...')

  // 1. Create a Media Logo (Placeholder)
  // Note: For a real seed, you'd upload a file, but we'll skip to Partners for now.

  // 2. Create Partners
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

  const wrc = await payload.create({
    collection: 'partners',
    data: {
      name: "Women's Refugee Commission",
      type: 'ngo',
      description:
        'The Women\'s Refugee Commission improves the lives and protects the rights of women, children, and youth displaced by conflict and crisis.',
      website: 'https://www.womensrefugeecommission.org/',
    },
  })

  const wusc = await payload.create({
    collection: 'partners',
    data: {
      name: 'WUSC (World University Service of Canada)',
      type: 'ngo',
      description:
        'WUSC is a Canadian global development organization working to catalyze positive education and economic outcomes for young people, with a focus on women and displaced populations.',
      website: 'https://wusc.ca/',
      location: 'Ottawa, Canada',
    },
  })

  const wuscKenya = await payload.create({
    collection: 'partners',
    data: {
      name: 'WUSC Kenya',
      type: 'ngo',
      description:
        'WUSC Kenya works to catalyze positive education and economic outcomes for young people in Kenya, with a focus on women and displaced populations.',
      website: 'https://wusc.ca/',
      location: 'Nairobi, Kenya',
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
      title: 'Digital Skills Training Program',
      organization: mastercard.id,
      category: 'jobs',
      documentation: ['alien_card', 'waiting_slip', 'passport'],
      deadline: '2026-03-15',
      location: 'kenya',
      isVerified: true,
      applicationType: 'link',
      applyLink: 'https://mastercardfdn.org/digital-kenya',
      descriptionType: 'text',
    },
  })

  // Humanitarian Futures – Gender, Displacement & Justice Fellowship (2026)
  await payload.create({
    collection: 'opportunities',
    data: {
      title: 'Humanitarian Futures – Gender, Displacement & Justice Fellowship (2026)',
      organization: wrc.id,
      category: 'fellowships',
      documentation: ['any_id'],
      deadline: '2026-02-09',
      location: 'remote',
      isVerified: true,
      isFeatured: true,
      applicationType: 'link',
      applyLink: 'https://wp.me/p23f03-iY2',
      descriptionType: 'text',
    },
  })

  // WUSC Career Opportunity
  await payload.create({
    collection: 'opportunities',
    data: {
      title: 'WUSC Career Opportunities',
      organization: wusc.id,
      category: 'jobs',
      documentation: ['any_id'],
      deadline: '2026-03-31',
      location: 'multiple',
      isVerified: true,
      applicationType: 'link',
      applyLink: 'https://wusc.bamboohr.com/careers',
      descriptionType: 'text',
    },
  })

  // Project Director, DREEM - WUSC Kenya
  await payload.create({
    collection: 'opportunities',
    data: {
      title: 'Project Director, DREEM',
      organization: wuscKenya.id,
      category: 'jobs',
      documentation: ['passport', 'any_id'],
      deadline: '2026-02-04',
      location: 'kenya',
      isVerified: true,
      isFeatured: true,
      applicationType: 'link',
      applyLink: 'https://wusc.bamboohr.com/careers/244',
      descriptionType: 'text',
    },
  })

  console.log('🚀 Seed Complete: 5 Partners and 5 Opportunities added!')
}