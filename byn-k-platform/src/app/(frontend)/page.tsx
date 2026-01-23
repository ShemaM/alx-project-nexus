import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/home/Hero'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { HomeContent } from '@/components/home/HomeContent'
import { PartnersSection } from '@/components/home/PartnersSection'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <CategoriesSection />
      <HomeContent />
      <PartnersSection />
      <Footer />
    </div>
  )
}