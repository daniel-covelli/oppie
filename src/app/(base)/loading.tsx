import React from "react";

export default function LoadingPage() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="animate-pulse space-y-4">
      {/* Title skeleton */}
      <div className="h-8 w-1/4 rounded-md bg-slate-700"></div>

      {/* Subtitle skeleton */}
      <div className="h-4 w-1/6 rounded-md bg-slate-700"></div>
    </div>
  );
}
