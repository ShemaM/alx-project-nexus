export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#2D8FDD]/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-[#2D8FDD] rounded-full absolute top-0 left-0 animate-spin"></div>
        </div>
        {/* Loading text */}
        <p className="text-lg font-medium text-slate-600 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

