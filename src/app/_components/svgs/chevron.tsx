import React from "react";

export default function Chevron({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke-width="1.5"
      stroke="currentColor"
      className={className}
      viewBox="7.5 3.75 9 16.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      ></path>
    </svg>
  );
}
