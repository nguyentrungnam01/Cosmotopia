export function PinkEllipse() {
  return (
    <div
      className="absolute w-96 h-96 rounded-full opacity-60 blur-3xl"
      style={{
        background: "radial-gradient(ellipse at center, #FFB6C1 0%, #FFC0CB 30%, #FFE4E1 70%, transparent 100%)",
      }}
    />
  )
}

export function PurpleEllipse() {
  return (
    <div
      className="absolute w-96 h-96 rounded-full opacity-50 blur-3xl"
      style={{
        background: "radial-gradient(ellipse at center, #DDA0DD 0%, #E6E6FA 30%, #F0F8FF 70%, transparent 100%)",
      }}
    />
  )
}

export function EllipseBackground() {
  return (
    <div className="flex inset-0 overflow-hidden pointer-events-none">
      {/* Pink ellipse - top left */}
      <PinkEllipse />

      {/* Purple ellipse - bottom right */}
      <div className="absolute bottom-0 right-0">
        <PurpleEllipse />
      </div>

      {/* Additional ellipses for more depth */}
      <div className="absolute top-1/3 right-1/4">
        <PinkEllipse />
      </div>

      <div className="absolute bottom-1/3 left-1/4">
        <PurpleEllipse />
      </div>
    </div>
  )
}
