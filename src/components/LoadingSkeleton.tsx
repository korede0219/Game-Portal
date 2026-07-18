import { motion } from 'motion/react';

export function LoadingSkeleton() {
  const dummyTiles = Array.from({ length: 6 });

  return (
    <div className="min-h-screen bg-[#0a0a0d] px-8 py-10 space-y-12">
      {/* Hero Banner Shimmer */}
      <div className="h-[340px] bg-white/[0.01] border border-white/[0.02] rounded-2xl relative overflow-hidden flex flex-col justify-end p-8 space-y-4">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        
        <div className="h-4 w-28 bg-white/[0.03] rounded" />
        <div className="h-10 w-80 bg-white/[0.04] rounded" />
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-white/[0.04] rounded-lg" />
          <div className="h-10 w-24 bg-white/[0.04] rounded-lg" />
        </div>
      </div>

      {/* Grid Header Shimmer */}
      <div className="space-y-6">
        <div className="h-4 w-40 bg-white/[0.03] rounded" />
        
        {/* Tiles Grid Shimmer */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-6">
          {dummyTiles.map((_, i) => (
            <div 
              key={i} 
              className="aspect-[3/4] rounded-xl bg-white/[0.02] border border-white/[0.03] relative overflow-hidden flex items-end p-4"
            >
              {/* Shimmer Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              <div className="h-4 w-full bg-white/[0.03] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
