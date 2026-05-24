import React from 'react'
import Link from 'next/link'
import { Phone, MapPin, Clock, MessageSquare } from 'lucide-react'
import GmailIcon from '@/components/ui/icons/GmailIcon'
import { CONTACT } from '@/lib/site-config'

export const metadata = {
  title: 'Contact Us | Opportunities for Banyamulenge Youth in Kenya',
  description: 'Get in touch with the BYN-K platform team. We are here to help Banyamulenge youth in Kenya find verified opportunities.',
}

// Contact cards sourced from site-config so there is one place to update.
const contactInfo = [
  {
    icon: GmailIcon,
    title: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    description: 'Send us an email and we will respond within 24–48 hours.',
  },
  ...(CONTACT.phone
    ? [
        {
          icon: Phone,
          title: 'Phone / WhatsApp',
          value: CONTACT.phone,
          href: `tel:${CONTACT.phone.replace(/\s/g, '')}`,
          description: 'Call or WhatsApp us for immediate assistance.',
        },
      ]
    : []),
  {
    icon: MapPin,
    title: 'Location',
    value: 'Community Support Center, Nairobi, Kenya',
    href: null,
    description: 'Visit our community support center for in-person assistance.',
  },
  {
    icon: Clock,
    title: 'Support Hours',
    value: 'Monday – Friday, 9:00 AM – 5:00 PM EAT',
    href: null,
    description: 'Our team is available during business hours to assist you.',
  },
]

export default function ContactPage() {
  // Renders a hero, contact cards, location details, and CTA funnel.
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-hero-dark via-primary-dark to-primary py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-glass-on-dark border border-border-on-dark/70 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-on-dark mb-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-muted-on-dark max-w-2xl mx-auto leading-relaxed">
            Have questions or need assistance? Our team is here to help Banyamulenge youth find and apply for opportunities.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <div 
                  key={index}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {info.title}
                      </h3>
                      {info.href ? (
                        <a 
                          href={info.href}
                          className="text-primary font-medium hover:text-primary-dark transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-slate-700 font-medium">
                          {info.value}
                        </p>
                      )}
                      <p className="text-slate-500 text-sm mt-2">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Map/Location Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              Visit Our Community Support Center
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Located in Nairobi, Kenya, our support center provides in-person assistance for youth seeking opportunities.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Nairobi, Kenya</h3>
                <p className="text-slate-600">Community Support Center</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6">
              <p className="text-slate-600 leading-relaxed">
                Our community support center welcomes Banyamulenge youth who need assistance with:
              </p>
              <ul className="mt-4 space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Navigating the platform and finding opportunities
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Resume and application support
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Career guidance and mentorship connections
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Documentation questions and support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-hero-dark to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-on-dark mb-4">
            Ready to Explore Opportunities?
          </h2>
          <p className="text-muted-on-dark mb-8 max-w-xl mx-auto">
            Browse our verified listings and find your next opportunity today.
          </p>
          <Link 
            href="/"
            className="inline-block bg-link-on-dark hover:bg-secondary-dark text-surface-dark px-8 py-4 rounded-xl font-bold text-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark"
          >
            Browse Opportunities
          </Link>
        </div>
      </section>

    </div>
  )
}
