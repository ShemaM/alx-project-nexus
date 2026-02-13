export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-md flex items-center justify-center z-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#2D8FDD]/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-[#F5D300]/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="flex flex-col items-center gap-6 relative">
        {/* Stylish branded loader */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute -inset-3 bg-gradient-to-r from-[#2D8FDD] via-[#F5D300] to-[#D52B2B] rounded-full opacity-20 blur-xl animate-pulse"></div>
          
          {/* Main spinner */}
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 animate-spin" style={{ animationDuration: '1.5s' }}>
              <defs>
                <linearGradient id="loading-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2D8FDD" />
                  <stop offset="50%" stopColor="#F5D300" />
                  <stop offset="100%" stopColor="#D52B2B" />
                </linearGradient>
              </defs>
              <circle 
                cx="40" 
                cy="40" 
                r="36" 
                fill="none" 
                stroke="url(#loading-gradient)" 
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="150 75"
              />
            </svg>
            
            {/* Inner logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2D8FDD] to-[#1E6BB8] rounded-xl shadow-lg shadow-[#2D8FDD]/20 flex items-center justify-center">
                <span className="text-white font-bold text-sm">BYN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <p className="text-lg font-semibold bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8] bg-clip-text text-transparent animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

