'use client'

export function AnimatedBackground() {
  return (
    <div className="animated-background">
      {/* Gradient background */}
      <div className="bg-gradient" />

      {/* Floating blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      {/* Grid pattern overlay */}
      <div className="grid-pattern" />
    </div>
  )
}
