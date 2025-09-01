interface AntIconProps {
  className?: string
  size?: number
}

export function AntIcon({ className = "", size = 24 }: AntIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Minimalist ant silhouette */}
      <path
        d="M12 4C13.1 4 14 4.9 14 6C14 7.1 13.1 8 12 8C10.9 8 10 7.1 10 6C10 4.9 10.9 4 12 4Z"
        fill="currentColor"
      />
      <ellipse cx="12" cy="12" rx="4" ry="2.5" fill="currentColor" />
      <ellipse cx="12" cy="18" rx="2.5" ry="1.5" fill="currentColor" />
      {/* Antennae */}
      <path d="M10.5 5L9 3M13.5 5L15 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Legs */}
      <path
        d="M8 11L6 13M8 13L6 15M16 11L18 13M16 13L18 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
