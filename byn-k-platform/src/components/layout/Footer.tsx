import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react'
import SubscriptionForm from '@/components/forms/SubscriptionForm'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/categories/jobs', label: 'Jobs' },
    { href: '/categories/scholarships', label: 'Scholarships' },
    { href: '/categories/internships', label: 'Internships' },
    { href: '/categories/training', label: 'Training' },
  ]

  const resources = [
    { href: '/about', label: 'About Us' },
    { href: '/partners', label: 'Our Partners' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact Us' },
  ]

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Linkedin, label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-gradient-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 items-center gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-blue-100 text-sm">
                Get the latest opportunities delivered to your inbox
              </p>
            </div>
            <SubscriptionForm />
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image 
                src="/images/logo.png" 
                alt="BANYAMULENGE YOUTH KENYA Logo" 
                width={56} 
                height={56}
                className="rounded-lg bg-white p-1"
              />
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight leading-tight">BANYAMULENGE</span>
                <span className="text-xs font-semibold text-[#F5D300] tracking-wider">YOUTH KENYA</span>
              </div>
            </Link>
            <p className="text-blue-100 text-sm leading-relaxed mb-4">
              Connecting Banyamulenge refugee youth in Kenya with verified jobs, scholarships, and opportunities.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 hover:bg-[#F5D300] hover:text-[#1E6BB8] rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-blue-100 hover:text-[#F5D300] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-blue-100 hover:text-[#F5D300] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#F5D300] flex-shrink-0 mt-0.5" />
                <span className="text-blue-100 text-sm">
                  Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#F5D300] flex-shrink-0" />
                <a
                  href="mailto:contact@bynk-platform.org"
                  className="text-blue-100 hover:text-[#F5D300] transition-colors text-sm"
                >
                  contact@bynk-platform.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#F5D300] flex-shrink-0" />
                <a
                  href="tel:+254700000000"
                  className="text-blue-100 hover:text-[#F5D300] transition-colors text-sm"
                >
                  +254 700 000 000
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-blue-100">
            <p className="flex items-center gap-1">
              &copy; {currentYear} BANYAMULENGE YOUTH KENYA. Made with{' '}
              <Heart size={14} className="text-[#D52B2B] fill-[#D52B2B]" /> for refugee youth.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-[#F5D300] transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-[#F5D300] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
