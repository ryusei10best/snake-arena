interface SnakeProps {
  segments: Array<{ x: number; y: number }>
  colorClass: string
  boardSize: number
}

export function Snake({ segments, colorClass, boardSize }: SnakeProps) {
  return (
    <>
      {segments.map((segment, index) => {
        const isHead = index === 0

        return (
          <div
            key={`segment-${index}`}
            className={`absolute ${colorClass} ${isHead ? "rounded-full" : "rounded-sm"}`}
            style={{
              left: `${(segment.x / boardSize) * 100}%`,
              top: `${(segment.y / boardSize) * 100}%`,
              width: `${100 / boardSize}%`,
              height: `${100 / boardSize}%`,
              zIndex: isHead ? 20 : 10,
              boxShadow: isHead ? `0 0 8px ${colorClass.replace("bg-", "")}` : "none",
            }}
          />
        )
      })}
    </>
  )
}
