export default function CheckMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      viewBox="3.75 4.5 16.5 15"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      ></path>
    </svg>
  );
}
