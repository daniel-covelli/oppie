export default function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      viewBox="5.25 5.25 13.5 13.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      ></path>
    </svg>
  );
}
