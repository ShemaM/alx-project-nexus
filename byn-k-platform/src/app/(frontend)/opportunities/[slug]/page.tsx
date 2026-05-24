import { OpportunityDetail } from '@/components/opportunities/OpportunityDetail'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function OpportunitySlugPage({ params }: Readonly<PageProps>) {
  const { slug } = await params
  return <OpportunityDetail slug={slug} />
}
