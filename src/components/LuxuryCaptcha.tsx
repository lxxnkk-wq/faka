import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export const LuxuryCaptcha = ({ onVerify }: { onVerify: (valid: boolean) => void }) => {
  const [sliderPos, setSliderPos] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const targetPos = 85; // Target position percentage

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderPos(val);
    if (Math.abs(val - targetPos) < 5) {
      setIsVerified(true);
      onVerify(true);
    } else {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
      <div className="flex justify-between items-center mb-2">
        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Human Verification</p>
        {isVerified && <span className="text-[9px] font-bold text-brand uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={10} /> Verified</span>}
      </div>
      <div className="relative h-12 bg-black/40 rounded-full border border-white/5 flex items-center px-2">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-[8px] font-bold text-white/10 uppercase tracking-[0.3em]">Slide to the Golden Mark</p>
        </div>
        <div 
          className="absolute h-8 w-1 bg-brand/30 rounded-full" 
          style={{ left: `${targetPos}%` }}
        />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderPos} 
          onChange={handleSliderChange}
          className="w-full appearance-none bg-transparent cursor-pointer relative z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand/20 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface"
        />
      </div>
    </div>
  );
};
