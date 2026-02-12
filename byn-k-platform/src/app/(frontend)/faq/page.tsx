import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronDown, HelpCircle, Target, CheckCircle, UserPlus, Building2 } from 'lucide-react'

export const metadata = {
  title: 'FAQ | Opportunities for Banyamulenge Youth in Kenya',
  description: 'Frequently asked questions about the BYN-K platform - find answers about browsing opportunities, account creation, verification process, and more.',
}

const faqs = [
  {
    icon: Target,
    question: 'What is the goal of this platform?',
    answer: 'The "Opportunities for Banyamulenge Youth in Kenya" platform aims to bridge the information gap by providing a centralized hub for jobs, scholarships, and training specifically curated for our community.',
  },
  {
    icon: CheckCircle,
    question: 'How do you verify the opportunities?',
    answer: 'We vet every listing through our network of humanitarian partners and community leaders to ensure they are legitimate and safe for our youth to apply to.',
  },
  {
    icon: UserPlus,
    question: 'Do I need an account to browse?',
    answer: 'No, you can browse all opportunities freely. However, signing in via Google or LinkedIn allows you to bookmark opportunities and receive personalized updates.',
  },
  {
    icon: Building2,
    question: 'Who can post an opportunity?',
    answer: 'Verified NGOs, community organizations, and employers can submit opportunities. All submissions go through an approval process by our administrators.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-[#F5D300]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about the BYN-K platform and how we serve the Banyamulenge youth community in Kenya.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {faqs.map((faq, index) => {
              const Icon = faq.icon
              return (
                <details 
                  key={index}
                  className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <summary className="flex items-center gap-4 p-6 cursor-pointer list-none">
                    <div className="w-12 h-12 bg-[#2D8FDD]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#2D8FDD]" />
                    </div>
                    <h3 className="flex-1 text-lg font-bold text-slate-900">
                      {faq.question}
                    </h3>
                    <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <div className="pl-16">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Reach out to our team and we&apos;ll be happy to help.
          </p>
          <a 
            href="/contact"
            className="inline-block bg-[#F5D300] hover:bg-[#D4B500] text-[#1E6BB8] px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
