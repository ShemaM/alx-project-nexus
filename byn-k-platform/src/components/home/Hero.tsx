/**
 * Hero Component
 * 
 * Main hero section for the homepage featuring:
 * - Platform branding and logo
 * - Call-to-action buttons
 * - Live statistics for opportunities and partners
 * 
 * Includes data-tour attribute for onboarding tour integration.
 * 
 * @module components/home/Hero
 */
import Link from 'next/link'
import Image from 'next/image'

export interface HeroProps {
  counts?: {
    jobs: number
    scholarships: number
    internships: number
    partners: number
  }
}

export const Hero = ({ counts }: HeroProps) => (
  <header 
    data-tour="hero"
    className="relative bg-gradient-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] py-16 md:py-24 overflow-hidden"
  >
    {/* Decorative background elements with brand colors */}
    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[#F5D300]/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-72 h-72 bg-[#D52B2B]/15 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
    
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      {/* Main Hero Content */}
      <div className="text-center mb-12">
        {/* Logo Section with animation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-xl hover-scale">
            <Image 
              src="/images/logo.png" 
              alt="BANYAMULENGE YOUTH KENYA Logo" 
              width={100} 
              height={100}
              className="w-20 h-20 md:w-24 md:h-24"
              priority
            />
          </div>
        </div>
        
        {/* Animated headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fade-in">
          Empowering <span className="text-[#F5D300]">Banyamulenge</span> Youth
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
          Your gateway to verified jobs, scholarships, internships, and opportunities designed for refugee youth in Kenya.
        </p>
        
        {/* CTA Buttons with brand colors and hover effects */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link 
            href="/categories/jobs"
            className="bg-[#F5D300] text-[#1E6BB8] px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#D4B500] hover:shadow-xl transition-all transform hover:scale-105 focus-ring"
          >
            Explore Jobs
          </Link>
          <Link 
            href="/categories/scholarships"
            className="bg-white/10 text-white border-2 border-white/30 backdrop-blur-md px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all focus-ring"
          >
            View Scholarships
          </Link>
        </div>
      </div>
      
      {/* Stats Grid with hover animations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <Link 
          href="/categories/jobs" 
          className="bg-white/10 p-5 md:p-6 rounded-2xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all group text-center hover-lift"
        >
          <div className="text-3xl md:text-4xl font-bold text-[#F5D300] group-hover:scale-110 transition-transform">
            {counts?.jobs ?? 0}
          </div>
          <div className="text-blue-100 text-sm mt-1">Verified Jobs</div>
        </Link>
        <Link 
          href="/categories/scholarships" 
          className="bg-white/10 p-5 md:p-6 rounded-2xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all group text-center hover-lift"
        >
          <div className="text-3xl md:text-4xl font-bold text-[#F5D300] group-hover:scale-110 transition-transform">
            {counts?.scholarships ?? 0}
          </div>
          <div className="text-blue-100 text-sm mt-1">Scholarships</div>
        </Link>
        <Link 
          href="/categories/internships" 
          className="bg-white/10 p-5 md:p-6 rounded-2xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all group text-center hover-lift"
        >
          <div className="text-3xl md:text-4xl font-bold text-[#F5D300] group-hover:scale-110 transition-transform">
            {counts?.internships ?? 0}
          </div>
          <div className="text-blue-100 text-sm mt-1">Internships</div>
        </Link>
        <Link 
          href="/partners" 
          className="bg-white/10 p-5 md:p-6 rounded-2xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all group text-center hover-lift"
        >
          <div className="text-3xl md:text-4xl font-bold text-[#F5D300] group-hover:scale-110 transition-transform">
            {counts?.partners ?? 0}
          </div>
          <div className="text-blue-100 text-sm mt-1">Partners</div>
        </Link>
      </div>
    </div>
  </header>
)