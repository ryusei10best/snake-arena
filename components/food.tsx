interface FoodProps {
  position: { x: number; y: number }
  boardSize: number
}

export function Food({ position, boardSize }: FoodProps) {
  // Use exact positioning to ensure visual and logical positions match
  return (
    <div
      className="absolute bg-red-500 rounded-full animate-pulse"
      style={{
        left: `${(position.x / boardSize) * 100}%`,
        top: `${(position.y / boardSize) * 100}%`,
        width: `${100 / boardSize}%`,
        height: `${100 / boardSize}%`,
        zIndex: 5,
        boxShadow: "0 0 8px rgba(255, 0, 0, 0.7)",
      }}
    />
  )
}
