import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'Contact Us | Opportunities for Banyamulenge Youth in Kenya',
  description: 'Get in touch with the BYN-K platform team. We are here to help Banyamulenge youth in Kenya find verified opportunities.',
}

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'contact@bynk-platform.org',
    href: 'mailto:contact@bynk-platform.org',
    description: 'Send us an email and we will respond within 24-48 hours.',
  },
  {
    icon: Phone,
    title: 'Phone/WhatsApp',
    value: '+254 700 000 000',
    href: 'tel:+254700000000',
    description: 'Call or WhatsApp us for immediate assistance.',
  },
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
    value: 'Monday – Friday, 9:00 AM to 5:00 PM EAT',
    href: null,
    description: 'Our team is available during business hours to assist you.',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-[#F5D300]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
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
                    <div className="w-12 h-12 bg-[#2D8FDD]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#2D8FDD]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {info.title}
                      </h3>
                      {info.href ? (
                        <a 
                          href={info.href}
                          className="text-[#2D8FDD] font-medium hover:text-[#1E6BB8] transition-colors"
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
            <h2 className="text-2xl md:text-3xl font-bold text-[#2D8FDD] mb-4">
              Visit Our Community Support Center
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Located in Nairobi, Kenya, our support center provides in-person assistance for youth seeking opportunities.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#F5D300]/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#F5D300]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Nairobi, Kenya</h3>
                <p className="text-slate-600">Community Support Center</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#2D8FDD]/5 to-[#F5D300]/5 rounded-xl p-6">
              <p className="text-slate-600 leading-relaxed">
                Our community support center welcomes Banyamulenge youth who need assistance with:
              </p>
              <ul className="mt-4 space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2D8FDD] rounded-full" />
                  Navigating the platform and finding opportunities
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2D8FDD] rounded-full" />
                  Resume and application support
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2D8FDD] rounded-full" />
                  Career guidance and mentorship connections
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2D8FDD] rounded-full" />
                  Documentation questions and support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Explore Opportunities?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Browse our verified listings and find your next opportunity today.
          </p>
          <Link 
            href="/"
            className="inline-block bg-[#F5D300] hover:bg-[#D4B500] text-[#1E6BB8] px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Browse Opportunities
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
