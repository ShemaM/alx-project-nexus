import React from 'react'
import Link from 'next/link'
import { Star, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react'

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
    { href: '/admin', label: 'Admin Portal' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact Us' },
  ]

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Linkedin, label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-[#0F4C81] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-blue-200 text-sm">
                Get the latest opportunities delivered to your inbox
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623]"
              />
              <button
                type="submit"
                className="bg-[#F5A623] hover:bg-[#d98c1d] text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#F5A623] rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">BYN-K</span>
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">
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
                    className="w-10 h-10 bg-white/10 hover:bg-[#F5A623] rounded-lg flex items-center justify-center transition-colors"
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
                    className="text-blue-200 hover:text-[#F5A623] transition-colors text-sm"
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
                    className="text-blue-200 hover:text-[#F5A623] transition-colors text-sm"
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
                <MapPin size={18} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
                <span className="text-blue-200 text-sm">
                  Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#F5A623] flex-shrink-0" />
                <a
                  href="mailto:info@byn-k.org"
                  className="text-blue-200 hover:text-[#F5A623] transition-colors text-sm"
                >
                  info@byn-k.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#F5A623] flex-shrink-0" />
                <a
                  href="tel:+254700000000"
                  className="text-blue-200 hover:text-[#F5A623] transition-colors text-sm"
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-blue-200">
            <p className="flex items-center gap-1">
              &copy; {currentYear} BYN-K Platform. Made with{' '}
              <Heart size={14} className="text-[#F5A623] fill-[#F5A623]" /> for refugee youth.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-[#F5A623] transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-[#F5A623] transition-colors">
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
