export default function Plus({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke-width="1.5"
      stroke="currentColor"
      className={className}
      viewBox="3.75 3.75 16.5 16.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      ></path>
    </svg>
  );
}
