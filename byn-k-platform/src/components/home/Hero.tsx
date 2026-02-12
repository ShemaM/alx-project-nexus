/**
 * Hero Component
 * 
 * Revamped hero section serving as an ad center featuring:
 * - Full-width background image with dark blue/slate gradient overlay
 * - Distinctive white logo container box
 * - Featured opportunities carousel/spotlight
 * - Dynamic statistics with animated counters
 * - Modern glassmorphism design with backdrop-blur
 * - Engaging call-to-action buttons
 * 
 * Includes data-tour attribute for onboarding tour integration.
 * 
 * @module components/home/Hero
 */
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ImageWithFallback } from '../ui/ImageWithFallback'
import { ArrowRight, Sparkles, TrendingUp, Clock, ChevronLeft, ChevronRight, Star, Loader2 } from 'lucide-react'
import styles from './Hero.module.css'
import { buildOpportunityPath } from '@/lib/opportunity-utils'
import { useLoadingState } from '@/contexts'

export interface FeaturedOpportunity {
  id: string
  title: string
  organization: string
  category: 'job' | 'scholarship' | 'internship' | 'fellowship'
  deadline: string
  isHot?: boolean
  slug?: string
}

type CategoryCounts = {
  jobs: number
  scholarships: number
  internships: number
  fellowships: number
  partners?: number
}

export interface HeroProps {
  featuredOpportunities?: FeaturedOpportunity[]
  counts?: CategoryCounts
}

const categoryColors: Record<FeaturedOpportunity['category'], string> = {
  job: 'from-yellow-400 to-amber-500',
  scholarship: 'from-purple-500 to-fuchsia-500',
  internship: 'from-blue-500 to-cyan-500',
  fellowship: 'from-emerald-500 to-green-500',
}

const categoryLabels: Record<FeaturedOpportunity['category'], string> = {
  job: 'Job Opportunity',
  scholarship: 'Scholarship',
  internship: 'Internship',
  fellowship: 'Fellowship',
}

export const Hero = ({ featuredOpportunities = [], counts }: HeroProps) => {
  const router = useRouter()
  const { isLoading, setLoading } = useLoadingState()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const totalSlides = featuredOpportunities.length
  const hasSlides = totalSlides > 0

  const currentFeatured = useMemo(
    () => (hasSlides ? featuredOpportunities[currentSlide] : undefined),
    [featuredOpportunities, currentSlide, hasSlides]
  )

  const handleExploreClick = () => {
    setLoading('explore-opportunities', true)
    router.push('/categories/jobs')
  }

  const handleViewDetailsClick = () => {
    const detailsKey = `view-details-${currentFeatured?.slug || currentFeatured?.id || 'featured'}`
    setLoading(detailsKey, true)
    router.push(buildOpportunityPath(currentFeatured?.category, currentFeatured?.slug))
  }

  const nextSlide = useCallback(() => {
    if (!hasSlides || isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
    setTimeout(() => setIsAnimating(false), 500)
  }, [hasSlides, isAnimating, totalSlides])

  const prevSlide = useCallback(() => {
    if (!hasSlides || isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    setTimeout(() => setIsAnimating(false), 500)
  }, [hasSlides, isAnimating, totalSlides])

  // Auto-advance carousel
  useEffect(() => {
    if (!hasSlides) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide, hasSlides])

  const totalActive =
    (counts?.jobs ?? 0) +
    (counts?.scholarships ?? 0) +
    (counts?.internships ?? 0) +
    (counts?.fellowships ?? 0)

  const particleIndices = useMemo(() => Array.from({ length: 20 }, (_, i) => i + 1), [])

  return (
    <header 
      data-tour="hero"
      className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Full-width Background Image with Dark Blue/Slate Gradient Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="/images/hero-bg.jpg"
          alt="Hero background"
          className="object-cover w-full h-full" // Use w-full h-full and object-cover for fill effect
        />
        {/* Dark blue/slate gradient overlay for text readability */}
        <div className="absolute inset-0 bg-slate-900/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-[#1E3A5F]/70 to-[#0F2847]/80" />
      </div>
      
      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[#2D8FDD] rounded-full mix-blend-multiply filter blur-[128px] animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-[#F5D300] rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#D52B2B] rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particleIndices.map((particleId) => {
          const particleKey = `particle${particleId}` as keyof typeof styles
          const particleClassName = [
            'absolute w-2 h-2 bg-white/20 rounded-full animate-float',
            styles.particle,
            styles[particleKey],
          ].join(' ')

          return (
            <div
              key={particleId}
              className={particleClassName}
            />
          )
        })}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC-18HptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC-6LjI2OCAxNC-14 14H0Z' stroke='#fff' stroke-opacity='.03'/></g></svg>')] opacity-40" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Branding & CTA */}
          <div className="text-center lg:text-left space-y-6">
            {/* Headline with gradient text */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm text-blue-200">
                <Sparkles size={16} className="text-[#F5D300]" />
                <span>Trusted by 1000+ refugee youth</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1]">
                Empowering{' '}
                <span className="relative">
                  <span className="bg-linear-to-r from-[#F5D300] via-[#FFE066] to-[#F5D300] bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
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
              <button 
                onClick={handleExploreClick}
                disabled={isLoading('explore-opportunities')}
                className="group relative inline-flex items-center gap-2 bg-linear-to-r from-[#F5D300] to-[#FFE066] text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#F5D300]/25 hover:shadow-xl hover:shadow-[#F5D300]/30 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading('explore-opportunities') ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Explore Opportunities</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
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
                  <div className="text-2xl font-bold text-white">{totalActive}+</div>
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
          
          {/* Right Column - Featured Opportunity Card with Glassmorphism */}
          <div className="relative">
            {/* Featured Opportunity Card */}
            <div className="relative">
              {/* Glow effect behind card */}
              <div className={`absolute -inset-4 bg-linear-to-r ${categoryColors[currentFeatured?.category || 'job']} rounded-3xl blur-2xl opacity-20 transition-all duration-500`} />
              
              {/* Main Card with clean Glassmorphism effect */}
              <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-white uppercase tracking-wider">Featured Opportunity</span>
                  </div>
                  {currentFeatured?.isHot && (
                    <div className="flex items-center gap-1 bg-linear-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                      🔥 Hot
                    </div>
                  )}
                </div>

                {/* Carousel Content */}
                <div className="min-h-50">
                  <div 
                    className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}
                  >
                    {/* Category Badge */}
                    <div className={`inline-flex items-center gap-2 bg-linear-to-r ${categoryColors[currentFeatured?.category || 'job']} px-4 py-2 rounded-xl text-white text-sm font-semibold mb-4`}>
                      {categoryLabels[currentFeatured?.category || 'job']}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                      {currentFeatured?.title ?? 'Featured opportunity'}
                    </h3>
                    
                    {/* Organization */}
                    <p className="text-blue-200 text-lg mb-4">
                      by <span className="text-white font-semibold">{currentFeatured?.organization ?? 'Unknown'}</span>
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

                {/* CTA Button - View Details linking to /opportunities/${slug} for better SEO */}
                <button 
                  onClick={handleViewDetailsClick}
                  disabled={!currentFeatured || isLoading(`view-details-${currentFeatured?.slug || currentFeatured?.id || 'featured'}`)}
                  className="group flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-4 rounded-2xl font-bold text-lg hover:bg-[#F5D300] transition-all duration-300 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading(`view-details-${currentFeatured?.slug || currentFeatured?.id || 'featured'}`) ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>View Details</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Carousel Controls */}
                {hasSlides && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex gap-2">
                      {featuredOpportunities.map((opportunity, index) => (
                        <button
                          key={opportunity.slug ?? opportunity.id}
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
                )}
              </div>
            </div>

            {/* Stats Cards - Floating with Glassmorphism */}
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
