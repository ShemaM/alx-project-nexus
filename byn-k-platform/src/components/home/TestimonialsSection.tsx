/**
 * Testimonials Section Component
 * 
 * Displays success stories and testimonials from users who have
 * benefited from opportunities on the platform.
 * 
 * Features:
 * - Responsive card grid layout
 * - User photos and quotes
 * - WCAG accessibility compliant
 * 
 * @module components/home/TestimonialsSection
 */
'use client'

import React, { useState } from 'react'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  role: string
  quote: string
  image?: string
  opportunity?: string
}

// Default testimonials - can be replaced with API data
const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Jean Pierre M.",
    role: "Software Developer",
    quote: "Through this platform, I found a scholarship that changed my life. I am now studying computer science and working towards my dreams.",
    opportunity: "Tech Scholarship 2024"
  },
  {
    id: 2,
    name: "Marie C.",
    role: "Healthcare Worker",
    quote: "The verified job listings helped me find employment with a trusted organization. I'm now able to support my family and continue my education.",
    opportunity: "Healthcare Internship"
  },
  {
    id: 3,
    name: "Emmanuel N.",
    role: "Business Student",
    quote: "I was struggling to find opportunities that accepted my documentation. This platform connected me with organizations that understand our situation.",
    opportunity: "Business Fellowship"
  }
]

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  testimonials = defaultTestimonials 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section 
      className="py-16 bg-gradient-to-br from-[#2D8FDD]/5 via-white to-[#F5D300]/5"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            id="testimonials-heading"
            className="text-2xl md:text-3xl font-bold text-[#2D8FDD] mb-3"
          >
            Success Stories
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Hear from community members who have found opportunities through our platform
          </p>
        </div>

        {/* Testimonials Carousel for Mobile */}
        <div className="md:hidden relative">
          <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6">
            <Quote 
              size={32} 
              className="text-[#F5D300] mb-4" 
              aria-hidden="true"
            />
            <blockquote className="text-slate-700 text-lg mb-6 italic">
              &ldquo;{testimonials[currentIndex].quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2D8FDD] to-[#1E6BB8] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonials[currentIndex].name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-bold text-[#2D8FDD]">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-sm text-slate-500">
                  {testimonials[currentIndex].role}
                </p>
                {testimonials[currentIndex].opportunity && (
                  <p className="text-xs text-[#F5D300] font-medium mt-1">
                    {testimonials[currentIndex].opportunity}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2D8FDD] hover:bg-[#2D8FDD] hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-6 bg-[#2D8FDD]' 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2D8FDD] hover:bg-[#2D8FDD] hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonials Grid for Desktop */}
        <div 
          className="hidden md:grid md:grid-cols-3 gap-6"
          role="list"
          aria-label="Success stories"
        >
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6 hover:shadow-xl transition-shadow"
              role="listitem"
            >
              <Quote 
                size={28} 
                className="text-[#F5D300] mb-4" 
                aria-hidden="true"
              />
              <blockquote className="text-slate-700 mb-6 italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2D8FDD] to-[#1E6BB8] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {testimonial.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-bold text-[#2D8FDD]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {testimonial.role}
                  </p>
                  {testimonial.opportunity && (
                    <p className="text-xs text-[#F5D300] font-medium mt-1">
                      {testimonial.opportunity}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
