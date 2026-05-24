import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react'
import SubscriptionForm from '@/components/forms/SubscriptionForm'
import { CONTACT, LEGAL, SOCIAL, SITE_NAME } from '@/lib/site-config'

const SOCIAL_ICONS = [
  { key: 'facebook' as const, icon: Facebook, label: 'Facebook' },
  { key: 'twitter' as const, icon: Twitter, label: 'Twitter (X)' },
  { key: 'instagram' as const, icon: Instagram, label: 'Instagram' },
  { key: 'linkedin' as const, icon: Linkedin, label: 'LinkedIn' },
]

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

/** Footer with contact details, social links, and the newsletter subscription form. */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const activeSocialLinks = SOCIAL_ICONS.filter(({ key }) => SOCIAL[key] !== null)

  return (
    <footer className="border-t-4 border-accent bg-surface-dark text-muted-on-dark">
      <div className="bg-gradient-to-r from-primary/25 via-secondary/15 to-accent/15">
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-9 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-secondary">Opportunity alerts</p>
            <h3 className="mt-2 text-2xl font-black text-on-dark">Stay Updated</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-on-dark">
              Get verified jobs, scholarships, internships, and community updates as soon as they are published.
            </p>
          </div>
          <SubscriptionForm />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.1fr]">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center" aria-label="Banyamulenge Youth Kenya home">
              <Image
                src="/images/logo.png"
                alt={`${SITE_NAME} Logo`}
                width={88}
                height={88}
                className="h-20 w-20 rounded-xl object-contain shadow-[0_0_0_1px_rgba(45,143,221,0.24),0_20px_42px_-28px_rgba(45,143,221,0.9)]"
              />
            </Link>
            <p className="max-w-sm text-sm leading-7 text-muted-on-dark">
              Connecting Banyamulenge refugee youth in Kenya with verified opportunities, practical guidance, and trusted partners.
            </p>

            {activeSocialLinks.length > 0 && (
              <div className="mt-6 flex gap-3" role="list" aria-label="Social media links">
                {activeSocialLinks.map(({ key, icon: Icon, label }) => (
                  <a
                    key={key}
                    href={SOCIAL[key]!}
                    aria-label={label}
                    rel="noopener noreferrer"
                    target="_blank"
                    role="listitem"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-on-dark bg-glass-on-dark text-on-dark transition-colors hover:border-link-on-dark hover:bg-link-on-dark hover:text-surface-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-secondary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-on-dark transition-colors hover:text-link-on-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-secondary">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-on-dark transition-colors hover:text-link-on-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-secondary">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-accent-light" aria-hidden="true" />
                <span className="text-sm leading-6 text-muted-on-dark">{CONTACT.location}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={17} className="mt-0.5 shrink-0 text-accent-light" aria-hidden="true" />
                <a href={`mailto:${CONTACT.email}`} className="break-all text-sm text-muted-on-dark transition-colors hover:text-link-on-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark">
                  {CONTACT.email}
                </a>
              </li>
              {CONTACT.phone && (
                <li className="flex items-center gap-3">
                  <Phone size={17} className="shrink-0 text-accent-light" aria-hidden="true" />
                  <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="text-sm text-muted-on-dark transition-colors hover:text-link-on-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark">
                    {CONTACT.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/20 bg-black/35">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-muted-on-dark sm:flex-row">
          <p className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
            <span>&copy; {currentYear} {SITE_NAME}.</span>
            <span className="inline-flex items-center gap-1">
              Built with <Heart size={13} className="fill-accent text-accent" aria-label="love" /> for refugee youth.
            </span>
          </p>
          <nav aria-label="Legal links" className="flex items-center gap-5">
            <Link href={LEGAL.privacyPolicy} className="transition-colors hover:text-link-on-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark">
              Privacy Policy
            </Link>
            <Link href={LEGAL.termsOfService} className="transition-colors hover:text-link-on-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
