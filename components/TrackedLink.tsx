"use client"

import Link from "next/link"
import { trackCtaClick } from "@/lib/analytics"

type TrackedLinkProps = React.ComponentProps<typeof Link> & {
  /** Label for analytics (e.g. "Back to Blog", "GitHub") */
  gaLabel: string
  /** Optional location (e.g. "blog_post_header", "footer") */
  gaLocation?: string
}

export function TrackedLink({
  gaLabel,
  gaLocation,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackCtaClick(gaLabel, gaLocation)
        onClick?.(e)
      }}
    />
  )
}
