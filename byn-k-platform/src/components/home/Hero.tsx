export const Hero = () => (
  <header className="relative bg-[#0F4C81] py-20 overflow-hidden">
    {/* Decorative background element */}
    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
    
    <div className="max-w-7xl mx-auto px-4 relative z-10 text-center md:text-left md:flex items-center gap-12">
      <div className="md:w-3/5">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6">
          Verified Opportunities for <span className="text-[#F5A623]">Refugee Youth.</span>
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-xl leading-relaxed">
          The first platform designed specifically for Banyamulenge youth in Kenya. 
          Filter by Alien Card or CTD eligibility and find your next path.
        </p>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <button className="bg-[#F5A623] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#d98c1d] transition-all">
            Explore Jobs
          </button>
          <button className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
            Share an Opportunity
          </button>
        </div>
      </div>
      
      {/* Quick Stat Cards */}
      <div className="hidden md:grid grid-cols-2 gap-4 md:w-2/5">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="text-3xl font-bold text-[#F5A623]">50+</div>
          <div className="text-blue-100 text-sm">Verified Jobs</div>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="text-3xl font-bold text-[#F5A623]">20+</div>
          <div className="text-blue-100 text-sm">Scholarships</div>
        </div>
      </div>
    </div>
  </header>
)