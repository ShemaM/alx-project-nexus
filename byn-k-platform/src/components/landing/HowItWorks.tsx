import { Search, FileCheck2, Send, BookOpen } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: Search,
    title: 'Search & Discover',
    description:
      'Browse verified opportunities — jobs, scholarships, internships, fellowships, and training — all in one place.',
  },
  {
    number: '2',
    icon: FileCheck2,
    title: 'Filter by Your Documents',
    description:
      'Every listing is tagged with the documents it accepts — Refugee ID, CTD, Mandate Letter, Alien Card, and more.',
  },
  {
    number: '3',
    icon: BookOpen,
    title: 'Read the Details',
    description:
      'Check documentation requirements, deadlines, and prep checklists before applying.',
  },
  {
    number: '4',
    icon: Send,
    title: 'Apply with Confidence',
    description:
      'Get direct links and community-verified details. Save favourites and set alerts for new listings.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
            How it works
          </p>
          <h2 className="font-syne text-3xl font-extrabold tracking-[-0.5px] text-white md:text-4xl">
            Apply in 4 simple steps
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-[1.7] text-white/65">
            No complicated process — find what fits your documents, apply directly.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                <span className="font-syne text-[18px] font-extrabold text-navy">
                  {step.number}
                </span>
              </div>
              <h3 className="font-syne mb-3 text-[15px] font-extrabold text-white">
                {step.title}
              </h3>
              <p className="text-[13px] leading-[1.65] text-white/65">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
