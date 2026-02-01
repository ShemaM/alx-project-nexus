import { getPayload } from 'payload'
import configPromise from './payload.config'

export const seed = async () => {
  const payload = await getPayload({ config: configPromise })

  console.log('🌱 Starting Seed...')

  // 1. Create Partners
  const wrc = await payload.create({
    collection: 'partners',
    data: {
      name: "Women's Refugee Commission",
      type: 'ngo',
      description:
        "The Women's Refugee Commission improves the lives and protects the rights of women, children, and youth displaced by conflict and crisis.",
      website: 'https://www.womensrefugeecommission.org/',
    },
  })

  const konexio = await payload.create({
    collection: 'partners',
    data: {
      name: 'Konexio Africa',
      type: 'ngo',
      description:
        'Konexio Africa, in partnership with SHOFCO, provides digital skills training and connects young people with global BPO employers.',
      website: 'https://www.konexio.eu/',
      location: 'Nairobi, Kenya',
    },
  })

  const refugepoint = await payload.create({
    collection: 'partners',
    data: {
      name: 'RefugePoint',
      type: 'ngo',
      description:
        'RefugePoint works to find lasting solutions for at-risk refugees who fall through the cracks of humanitarian assistance.',
      website: 'https://www.refugepoint.org/',
    },
  })

  const proartist = await payload.create({
    collection: 'partners',
    data: {
      name: 'ProArtist / The Coalition Africa',
      type: 'company',
      description:
        'ProArtist develops management and solution-finding skills through hands-on experience in customer service, leadership, and professional development.',
      website: 'https://thecoalitionafrica.com/',
      email: 'daisy@thecoalitionafrica.com',
      location: 'Kitengela, Kenya',
    },
  })

  const homebroadband = await payload.create({
    collection: 'partners',
    data: {
      name: 'Homebroadband Company',
      type: 'company',
      description: 'Homebroadband company offering internet connectivity solutions.',
      location: 'Nairobi, Kenya',
    },
  })

  const nairobiRetail = await payload.create({
    collection: 'partners',
    data: {
      name: 'Nairobi CBD Retail',
      type: 'company',
      description: 'Retail shop in Nairobi CBD seeking customer service staff.',
      location: 'Nairobi CBD, Kenya',
    },
  })

  console.log('✅ Partners Created')

  // 2. Create Opportunities

  // 1. Humanitarian Futures – Gender, Displacement & Justice Fellowship (2026)
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

  // 2. FREE BPO Bootcamp – 2026 (Kibera Koyaro)
  await payload.create({
    collection: 'opportunities',
    data: {
      title: 'FREE BPO Bootcamp – 2026 (Kibera Koyaro)',
      organization: konexio.id,
      category: 'internships',
      documentation: ['any_id'],
      deadline: '2026-02-04',
      location: 'kenya',
      isVerified: true,
      isFeatured: true,
      applicationType: 'link',
      applyLink:
        'https://docs.google.com/forms/d/e/1FAIpQLSfBPOBootcampFormLink/viewform',
      descriptionType: 'text',
    },
  })

  // 3. Shop Attendant (Nairobi CBD)
  await payload.create({
    collection: 'opportunities',
    data: {
      title: 'Shop Attendant (Nairobi CBD)',
      organization: nairobiRetail.id,
      category: 'jobs',
      documentation: ['any_id'],
      deadline: '2026-02-28',
      location: 'kenya',
      isVerified: true,
      applicationType: 'link',
      applyLink: 'https://wa.me/254795873066',
      descriptionType: 'text',
    },
  })

  // 4. Direct Sales Executive - Homebroadband Company
  await payload.create({
    collection: 'opportunities',
    data: {
      title: 'Direct Sales Executive - Homebroadband Company',
      organization: homebroadband.id,
      category: 'jobs',
      documentation: ['any_id'],
      deadline: '2026-02-28',
      location: 'kenya',
      isVerified: true,
      applicationType: 'link',
      applyLink: 'https://mis.amahorocoalition.com/shared_jobs/43a51c74-9e0e-42ef-b672-0f30b506ee6a',
      descriptionType: 'text',
    },
  })

  // 5. RefugePoint Career Opportunity
  await payload.create({
    collection: 'opportunities',
    data: {
      title: 'RefugePoint Career Opportunity - Nairobi',
      organization: refugepoint.id,
      category: 'jobs',
      documentation: ['any_id'],
      deadline: '2026-02-28',
      location: 'kenya',
      isVerified: true,
      applicationType: 'link',
      applyLink: 'https://refugepoint.applicantstack.com/x/detail/a25lemtsyamk',
      descriptionType: 'text',
    },
  })

  // 6. ProArtist Location Coordinator (Kitengela Barbershop)
  await payload.create({
    collection: 'opportunities',
    data: {
      title: 'Location Coordinator - ProArtist Barbershop (Kitengela)',
      organization: proartist.id,
      category: 'jobs',
      documentation: ['any_id'],
      deadline: '2026-02-28',
      location: 'kenya',
      isVerified: true,
      applicationType: 'link',
      applyLink:
        'https://docs.google.com/forms/d/e/1FAIpQLSeODF8_hbztVVHtgfVHGy-s--u2d5WTGGsRqsUAwfthUgoqSA/viewform',
      descriptionType: 'text',
    },
  })

  console.log('🚀 Seed Complete: 6 Partners and 6 Opportunities added!')
}