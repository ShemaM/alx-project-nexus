/**
 * Hero Component
 * 
 * Revamped hero section serving as an ad center featuring:
 * - Animated gradient background with floating elements
 * - Featured opportunities carousel/spotlight
 * - Dynamic statistics with animated counters
 * - Modern glassmorphism design
 * - Engaging call-to-action buttons
 * 
 * Includes data-tour attribute for onboarding tour integration.
 * 
 * @module components/home/Hero
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, TrendingUp, Clock, ChevronLeft, ChevronRight, Star } from 'lucide-react'

export interface FeaturedOpportunity {
  id: string
  title: string
  organization: string
  category: 'job' | 'scholarship' | 'internship' | 'fellowship'
  deadline: string
  isHot?: boolean
}

export interface HeroProps {
  counts?: {
    jobs: number
    scholarships: number
    internships: number
    partners: number
  }
  featuredOpportunities?: FeaturedOpportunity[]
}

// Sample featured opportunities for the ad center
const defaultFeatured: FeaturedOpportunity[] = [
  { id: '1', title: 'Software Developer Opportunity', organization: 'RefugePoint', category: 'job', deadline: '2024-03-15', isHot: true },
  { id: '2', title: 'Full Scholarship Program 2024', organization: 'IKEA Foundation', category: 'scholarship', deadline: '2024-04-01', isHot: true },
  { id: '3', title: 'Youth Leadership Fellowship', organization: 'Amahoro Coalition', category: 'fellowship', deadline: '2024-03-30' },
]

const categoryColors = {
  job: 'from-amber-400 to-orange-500',
  scholarship: 'from-purple-400 to-indigo-500',
  internship: 'from-blue-400 to-cyan-500',
  fellowship: 'from-emerald-400 to-teal-500',
}

const categoryLabels = {
  job: '💼 Job',
  scholarship: '🎓 Scholarship',
  internship: '🏢 Internship',
  fellowship: '📚 Fellowship',
}

export const Hero = ({ counts, featuredOpportunities = defaultFeatured }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % featuredOpportunities.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, featuredOpportunities.length])

  const prevSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + featuredOpportunities.length) % featuredOpportunities.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, featuredOpportunities.length])

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const currentFeatured = featuredOpportunities[currentSlide]

  return (
    <header 
      data-tour="hero"
      className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#1E3A5F] to-[#0F2847]" />
      
      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[#2D8FDD] rounded-full mix-blend-multiply filter blur-[128px] animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-[#F5D300] rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#D52B2B] rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wMyIvPjwvZz48L3N2Zz4=')] opacity-40" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Branding & CTA */}
          <div className="text-center lg:text-left space-y-6">
            {/* Logo with glow effect */}
            <div className="flex justify-center lg:justify-start mb-4">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#2D8FDD] to-[#F5D300] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative bg-white p-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image 
                    src="/images/logo.png" 
                    alt="BANYAMULENGE YOUTH KENYA Logo" 
                    width={80} 
                    height={80}
                    className="w-16 h-16 md:w-20 md:h-20"
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* Headline with gradient text */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm text-blue-200">
                <Sparkles size={16} className="text-[#F5D300]" />
                <span>Trusted by 1000+ refugee youth</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1]">
                Empowering{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-[#F5D300] via-[#FFE066] to-[#F5D300] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    Banyamulenge
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <path d="M0,8 Q50,0 100,8 T200,8" stroke="#F5D300" strokeWidth="3" fill="none" className="animate-draw" />
                  </svg>
                </span>{' '}
                Youth
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100/90 max-w-xl leading-relaxed">
                Your gateway to verified opportunities, career growth, and educational success. Designed specifically for refugee youth in Kenya.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <Link 
                href="/categories/jobs"
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#F5D300] to-[#FFE066] text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#F5D300]/25 hover:shadow-xl hover:shadow-[#F5D300]/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span>Explore Opportunities</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/about"
                className="group inline-flex items-center gap-2 bg-white/5 text-white border-2 border-white/20 backdrop-blur-md px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-[#F5D300]/20 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-[#F5D300]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{(counts?.jobs ?? 0) + (counts?.scholarships ?? 0) + (counts?.internships ?? 0)}+</div>
                  <div className="text-xs text-blue-200">Active Opportunities</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Star size={20} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{counts?.partners ?? 0}+</div>
                  <div className="text-xs text-blue-200">Trusted Partners</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Featured Opportunity Ad Center */}
          <div className="relative">
            {/* Featured Opportunity Card */}
            <div className="relative">
              {/* Glow effect behind card */}
              <div className={`absolute -inset-4 bg-gradient-to-r ${categoryColors[currentFeatured?.category || 'job']} rounded-3xl blur-2xl opacity-20 transition-all duration-500`} />
              
              {/* Main Card */}
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-white uppercase tracking-wider">Featured Opportunity</span>
                  </div>
                  {currentFeatured?.isHot && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                      🔥 Hot
                    </div>
                  )}
                </div>

                {/* Carousel Content */}
                <div className="min-h-[200px]">
                  <div 
                    className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}
                  >
                    {/* Category Badge */}
                    <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${categoryColors[currentFeatured?.category || 'job']} px-4 py-2 rounded-xl text-white text-sm font-semibold mb-4`}>
                      {categoryLabels[currentFeatured?.category || 'job']}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                      {currentFeatured?.title}
                    </h3>
                    
                    {/* Organization */}
                    <p className="text-blue-200 text-lg mb-4">
                      by <span className="text-white font-semibold">{currentFeatured?.organization}</span>
                    </p>
                    
                    {/* Deadline */}
                    <div className="flex items-center gap-2 text-blue-200">
                      <Clock size={16} />
                      <span className="text-sm">
                        Deadline: {currentFeatured?.deadline 
                          ? new Date(currentFeatured.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          : 'TBD'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link 
                  href={`/opportunities/${currentFeatured?.id}`}
                  className="group flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-4 rounded-2xl font-bold text-lg hover:bg-[#F5D300] transition-all duration-300 mt-6"
                >
                  <span>Apply Now</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex gap-2">
                    {featuredOpportunities.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'w-8 bg-[#F5D300]' : 'w-2 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={prevSlide}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                      aria-label="Previous opportunity"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextSlide}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                      aria-label="Next opportunity"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards - Floating */}
            <div className="hidden lg:block absolute -bottom-4 -left-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl animate-float">
              <div className="text-3xl font-bold text-[#F5D300]">{counts?.jobs ?? 0}</div>
              <div className="text-sm text-blue-200">Jobs Available</div>
            </div>
            
            <div className="hidden lg:block absolute -top-4 -right-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl animate-float animation-delay-2000">
              <div className="text-3xl font-bold text-purple-400">{counts?.scholarships ?? 0}</div>
              <div className="text-sm text-blue-200">Scholarships</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}