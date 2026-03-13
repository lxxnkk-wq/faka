import React from 'react';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
);

export const ProductSkeleton = () => (
  <div className="flex flex-col gap-4 border border-white/5 p-4">
    <Skeleton className="aspect-square w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <div className="flex justify-between items-center mt-4">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);
