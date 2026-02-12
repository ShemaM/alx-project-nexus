import OpportunityDetailPage from '../../../opportunities/[slug]/page'

interface PageProps {
  params: Promise<{ category: string; slug: string }>
}

export default async function OpportunityCategorySlugPage({ params }: Readonly<PageProps>) {
  const { slug } = await params
  return <OpportunityDetailPage params={Promise.resolve({ slug })} />
}
