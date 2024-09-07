export default function Options({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="208 48 96 416"
      fill="currentColor"
    >
      <circle cx="256" cy="256" r="48"></circle>
      <circle cx="256" cy="416" r="48"></circle>
      <circle cx="256" cy="96" r="48"></circle>
    </svg>
  );
}
