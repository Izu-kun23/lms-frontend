import * as React from "react"

type AvatarProps = React.ComponentProps<"span"> & {
  src?: string
  alt?: string
  fallback?: string
}

export function Avatar({ src, alt, fallback = "U", className = "", ...props }: AvatarProps) {
  return (
    <span
      className={
        "inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-muted text-sm " +
        className
      }
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-foreground/70">{fallback}</span>
      )}
    </span>
  )
}


