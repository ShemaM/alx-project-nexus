interface GmailIconProps {
  className?: string
}

/** Lightweight Gmail icon used to stylize contact links. */
const GmailIcon = ({ className = 'h-5 w-5' }: GmailIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    role="img"
    aria-hidden="true"
    className={className}
  >
    <rect width="24" height="24" rx="6" fill="#FFFFFF" />
    <path
      d="M4 6.5C4 5.671 4.671 5 5.5 5h13c.829 0 1.5.671 1.5 1.5v11c0 .829-.671 1.5-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Z"
      fill="#D52B2B"
    />
    <path
      d="M20 6.5 12 12.5 4 6.5V18c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5v-11Z"
      fill="#F5D300"
    />
    <path
      d="m4 6.5 8.808 6.004a1 1 0 0 0 1.184 0L20 6.5"
      stroke="#091336"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default GmailIcon
