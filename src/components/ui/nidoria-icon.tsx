interface NidoriaIconProps {
  size?: number
  className?: string
}

export function NidoriaIcon({ size = 24, className = "" }: NidoriaIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Modern geometric colony design */}
      <circle cx="50" cy="50" r="45" fill="currentColor" fillOpacity="0.1" />
      <circle cx="50" cy="35" r="12" fill="currentColor" />
      <circle cx="35" cy="55" r="8" fill="currentColor" fillOpacity="0.8" />
      <circle cx="65" cy="55" r="8" fill="currentColor" fillOpacity="0.8" />
      <circle cx="50" cy="70" r="6" fill="currentColor" fillOpacity="0.6" />
      <circle cx="25" cy="70" r="4" fill="currentColor" fillOpacity="0.4" />
      <circle cx="75" cy="70" r="4" fill="currentColor" fillOpacity="0.4" />

      {/* Connection lines */}
      <path
        d="M50 47 L35 47 M50 47 L65 47 M50 58 L50 64 M35 63 L25 66 M65 63 L75 66"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.6"
      />
    </svg>
  )
}
