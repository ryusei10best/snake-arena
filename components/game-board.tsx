"use client"

import { useState, useEffect, useRef } from "react"
import { PlayerSelection } from "@/components/player-selection"
import { GameControls } from "@/components/game-controls"
import { Snake } from "@/components/snake"
import { Food } from "@/components/food"
import { ScoreBoard } from "@/components/score-board"
import { GameOverModal } from "@/components/game-over-modal"
import { useToast } from "@/hooks/use-toast"

// Game constants
const BOARD_SIZE = 20
const FOOD_VALUE = 1

// Player colors
const PLAYER_COLORS = ["emerald", "sky", "amber", "purple", "pink", "red"]
const COLOR_CLASSES = {
  emerald: "bg-[#00ff9d]",
  sky: "bg-[#00d2ff]",
  amber: "bg-[#ffcc00]",
  purple: "bg-[#d580ff]",
  pink: "bg-[#ff80bf]",
  red: "bg-[#ff5555]",
}

// Direction constants
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

// Initial directions for each player
const INITIAL_DIRECTIONS = [DIRECTIONS.RIGHT, DIRECTIONS.RIGHT, DIRECTIONS.LEFT, DIRECTIONS.LEFT]

// Player controls
const PLAYER_CONTROLS = [
  { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" },
  { up: "w", down: "s", left: "a", right: "d" },
  { up: "i", down: "k", left: "j", right: "l" },
  { up: "t", down: "g", left: "f", right: "h" },
]

// Update the type definition
type MapType = "classic" | "death-star" | "kingdoms" | "lake"
type ColorOption = "random" | "emerald" | "sky" | "amber" | "purple" | "pink" | "red"

// Update the MAP_SPAWN_POSITIONS to include lake instead of pangea
const MAP_SPAWN_POSITIONS = {
  classic: [
    [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
    ],
    [
      { x: 2, y: BOARD_SIZE - 3 },
      { x: 1, y: BOARD_SIZE - 3 },
      { x: 0, y: BOARD_SIZE - 3 },
    ],
    [
      { x: BOARD_SIZE - 3, y: 2 },
      { x: BOARD_SIZE - 2, y: 2 },
      { x: BOARD_SIZE - 1, y: 2 },
    ],
    [
      { x: BOARD_SIZE - 3, y: BOARD_SIZE - 3 },
      { x: BOARD_SIZE - 2, y: BOARD_SIZE - 3 },
      { x: BOARD_SIZE - 1, y: BOARD_SIZE - 3 },
    ],
  ],
  "death-star": [
    [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ],
    [
      { x: 5, y: BOARD_SIZE - 6 },
      { x: 4, y: BOARD_SIZE - 6 },
      { x: 3, y: BOARD_SIZE - 6 },
    ],
    [
      { x: BOARD_SIZE - 6, y: 5 },
      { x: BOARD_SIZE - 5, y: 5 },
      { x: BOARD_SIZE - 4, y: 5 },
    ],
    [
      { x: BOARD_SIZE - 6, y: BOARD_SIZE - 6 },
      { x: BOARD_SIZE - 5, y: BOARD_SIZE - 6 },
      { x: BOARD_SIZE - 4, y: BOARD_SIZE - 6 },
    ],
  ],
  kingdoms: [
    [
      { x: 4, y: 4 },
      { x: 3, y: 4 },
      { x: 2, y: 4 },
    ],
    [
      { x: 4, y: 15 },
      { x: 3, y: 15 },
      { x: 2, y: 15 },
    ],
    [
      { x: 15, y: 4 },
      { x: 16, y: 4 },
      { x: 17, y: 4 },
    ],
    [
      { x: 15, y: 15 },
      { x: 16, y: 15 },
      { x: 17, y: 15 },
    ],
  ],
  lake: [
    [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
    ],
    [
      { x: 2, y: BOARD_SIZE - 3 },
      { x: 1, y: BOARD_SIZE - 3 },
      { x: 0, y: BOARD_SIZE - 3 },
    ],
    [
      { x: BOARD_SIZE - 3, y: 2 },
      { x: BOARD_SIZE - 2, y: 2 },
      { x: BOARD_SIZE - 1, y: 2 },
    ],
    [
      { x: BOARD_SIZE - 3, y: BOARD_SIZE - 3 },
      { x: BOARD_SIZE - 2, y: BOARD_SIZE - 3 },
      { x: BOARD_SIZE - 1, y: BOARD_SIZE - 3 },
    ],
  ],
}

// Death Star obstacle generation function - fixed to be a circle
const generateDeathStarObstacles = () => {
  const obstacles = []
  const centerX = BOARD_SIZE / 2 - 0.5
  const centerY = BOARD_SIZE / 2 - 0.5
  const radius = 9 // Large playable circle

  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
      if (distance > radius) {
        obstacles.push({ x, y })
      }
    }
  }
  return obstacles
}

// Update the Kingdoms obstacle generation function to make the middle bridge wider
const generateKingdomsObstacles = () => {
  const obstacles = []

  // Create walls for the four kingdoms
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      // Create walls but leave bridges in the middle and at the edges
      // Wider middle bridges (3 cells wide instead of 2)
      if (
        // Horizontal walls (leave bridges at middle and edges)
        ((y === 9 || y === 10) && !(x < 2 || (x >= 7 && x <= 12) || x > BOARD_SIZE - 3)) ||
        // Vertical walls (leave bridges at middle and edges)
        ((x === 9 || x === 10) && !(y < 2 || (y >= 7 && y <= 12) || y > BOARD_SIZE - 3))
      ) {
        obstacles.push({ x, y })
      }
    }
  }
  return obstacles
}

// Replace the Pangea obstacle generation with Lake obstacle generation
const generateLakeObstacles = () => {
  const obstacles = []

  // Create a trapezoid lake in the middle
  const topWidth = 10
  const bottomWidth = 6
  const height = 6

  const topStart = (BOARD_SIZE - topWidth) / 2
  const topEnd = topStart + topWidth
  const bottomStart = (BOARD_SIZE - bottomWidth) / 2
  const bottomEnd = bottomStart + bottomWidth

  const lakeTop = 7
  const lakeBottom = lakeTop + height

  for (let y = lakeTop; y < lakeBottom; y++) {
    // Calculate the left and right boundaries for this row
    const rowPosition = (y - lakeTop) / height
    const leftBoundary = Math.floor(topStart + (bottomStart - topStart) * rowPosition)
    const rightBoundary = Math.ceil(topEnd + (bottomEnd - topEnd) * rowPosition)

    // Add obstacles for this row of the lake
    for (let x = leftBoundary; x < rightBoundary; x++) {
      obstacles.push({ x, y })
    }
  }

  return obstacles
}

// Update the MAP_OBSTACLES object
const MAP_OBSTACLES = {
  classic: [],
  "death-star": generateDeathStarObstacles(),
  kingdoms: generateKingdomsObstacles(),
  lake: generateLakeObstacles(),
}

type PlayerType = "human" | "ai"
type Position = { x: number; y: number }
type Direction = { x: number; y: number }

interface GameSettings {
  playerTypes: PlayerType[]
  playerCount: number
  gameSpeed: number
  mapType: MapType
  playerColors: ColorOption[]
}

interface Player {
  type: PlayerType
  snake: Position[]
  direction: Direction
  nextDirection: Direction
  score: number
  alive: boolean
  color: string
  colorClass: string
}

// Function to get a random color that's not already used
const getRandomColor = (usedColors: string[]): string => {
  const availableColors = PLAYER_COLORS.filter((color) => !usedColors.includes(color))
  if (availableColors.length === 0) return PLAYER_COLORS[0] // Fallback
  return availableColors[Math.floor(Math.random() * availableColors.length)]
}

export function GameBoard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [food, setFood] = useState<Position[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<number | null>(null)
  const [speed, setSpeed] = useState(150)
  const [mapType, setMapType] = useState<MapType>("classic")
  const [obstacles, setObstacles] = useState<Position[]>([])
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Initialize players with color selection
  const initializePlayers = (playerTypes: PlayerType[], selectedMapType: MapType, playerColors: ColorOption[]) => {
    const usedColors: string[] = []

    const newPlayers = playerTypes.map((type, index) => {
      // Determine color
      let color: string
      if (playerColors[index] === "random") {
        color = getRandomColor(usedColors)
      } else {
        color = playerColors[index]
      }

      usedColors.push(color)

      return {
        type,
        snake: [...MAP_SPAWN_POSITIONS[selectedMapType][index]],
        direction: INITIAL_DIRECTIONS[index],
        nextDirection: INITIAL_DIRECTIONS[index],
        score: 0,
        alive: true,
        color,
        colorClass: COLOR_CLASSES[color as keyof typeof COLOR_CLASSES],
      }
    })

    setPlayers(newPlayers)
    generateFood(playerTypes.length, newPlayers)
  }

  // Generate food at random positions
  const generateFood = (count: number, currentPlayers: Player[] = players) => {
    const newFood: Position[] = []
    const occupiedPositions = new Set()

    // Mark all snake positions as occupied
    currentPlayers.forEach((player) => {
      player.snake.forEach((segment) => {
        occupiedPositions.add(`${segment.x},${segment.y}`)
      })
    })

    // Mark existing food as occupied
    food.forEach((f) => {
      occupiedPositions.add(`${f.x},${f.y}`)
    })

    // Mark obstacles as occupied
    obstacles.forEach((o) => {
      occupiedPositions.add(`${o.x},${o.y}`)
    })

    // Generate new food in unoccupied positions
    let attempts = 0
    while (newFood.length < count && attempts < 100) {
      attempts++
      const position = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      }

      const posKey = `${position.x},${position.y}`
      if (!occupiedPositions.has(posKey)) {
        newFood.push(position)
        occupiedPositions.add(posKey)
      }
    }

    setFood((prev) => [...prev, ...newFood])
  }

  // Start the game
  const startGame = (settings: GameSettings) => {
    setSpeed(settings.gameSpeed)
    setMapType(settings.mapType)
    setObstacles(MAP_OBSTACLES[settings.mapType] || [])
    initializePlayers(settings.playerTypes, settings.mapType, settings.playerColors)
    setGameStarted(true)
    setGameOver(false)
    setWinner(null)
    toast({
      title: "Game Started",
      description: `Map: ${settings.mapType.toUpperCase()} - Speed: ${settings.gameSpeed}ms`,
      className: "game-font",
    })
  }

  // Reset the game
  const resetGame = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }
    setPlayers([])
    setFood([])
    setGameStarted(false)
    setGamePaused(false)
    setGameOver(false)
    setWinner(null)
  }

  // Pause/resume the game
  const togglePause = () => {
    setGamePaused((prev) => !prev)
    if (gamePaused && gameLoopRef.current === null) {
      // Resume game
      startGameLoop()
    }
  }

  // Check if a position is valid (not out of bounds or colliding with a snake)
  const isValidPosition = (position: Position, playerIndex: number): boolean => {
    // Check if out of bounds
    if (position.x < 0 || position.x >= BOARD_SIZE || position.y < 0 || position.y >= BOARD_SIZE) {
      return false
    }

    // Check if colliding with obstacles
    for (const obstacle of obstacles) {
      if (position.x === obstacle.x && position.y === obstacle.y) {
        return false
      }
    }

    // Check if colliding with any snake
    for (let i = 0; i < players.length; i++) {
      if (!players[i].alive) continue

      for (let j = 0; j < players[i].snake.length; j++) {
        // Skip checking the tail of the current snake if it's moving
        if (i === playerIndex && j === players[i].snake.length - 1) continue

        const segment = players[i].snake[j]
        if (position.x === segment.x && position.y === segment.y) {
          return false
        }
      }
    }

    return true
  }

  // Get AI next direction
  const getAIDirection = (playerIndex: number): Direction => {
    const player = players[playerIndex]
    if (!player.alive) return player.direction

    const head = player.snake[0]
    const possibleDirections = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT].filter((dir) => {
      // Don't allow reversing
      return !(dir.x === -player.direction.x && dir.y === -player.direction.y)
    })

    // Filter valid directions
    const validDirections = possibleDirections.filter((dir) => {
      const newPos = { x: head.x + dir.x, y: head.y + dir.y }
      return isValidPosition(newPos, playerIndex)
    })

    if (validDirections.length === 0) {
      return player.direction // No valid moves, continue in same direction
    }

    // Aggressive behavior: try to intercept other players
    const otherPlayers = players.filter((p, i) => p.alive && i !== playerIndex)

    // 30% chance to be aggressive and target other players
    if (otherPlayers.length > 0 && Math.random() < 0.3) {
      // Find closest opponent
      let closestOpponent = null
      let minDistance = Number.POSITIVE_INFINITY

      otherPlayers.forEach((opponent, opponentIndex) => {
        const opponentHead = opponent.snake[0]
        const distance = Math.abs(opponentHead.x - head.x) + Math.abs(opponentHead.y - head.y)

        if (distance < minDistance) {
          minDistance = distance
          closestOpponent = opponent
        }
      })

      if (closestOpponent && minDistance < 10) {
        // Only be aggressive if opponent is nearby
        const opponentHead = closestOpponent.snake[0]

        // Try to predict where opponent is going based on their direction
        const predictedPos = {
          x: opponentHead.x + closestOpponent.direction.x,
          y: opponentHead.y + closestOpponent.direction.y,
        }

        // Try to intercept
        const interceptDirections = validDirections.filter((dir) => {
          const newPos = { x: head.x + dir.x, y: head.y + dir.y }
          const distanceToIntercept = Math.abs(predictedPos.x - newPos.x) + Math.abs(predictedPos.y - newPos.y)
          return distanceToIntercept < minDistance
        })

        if (interceptDirections.length > 0) {
          return interceptDirections[Math.floor(Math.random() * interceptDirections.length)]
        }
      }
    }

    // Find closest food
    let closestFood: Position | null = null
    let minDistance = Number.POSITIVE_INFINITY

    food.forEach((f) => {
      const distance = Math.abs(f.x - head.x) + Math.abs(f.y - head.y)
      if (distance < minDistance) {
        minDistance = distance
        closestFood = f
      }
    })

    if (closestFood) {
      // Try to move towards food
      const dirTowardsFood = validDirections.filter((dir) => {
        const newPos = { x: head.x + dir.x, y: head.y + dir.y }
        const newDistance = Math.abs(closestFood!.x - newPos.x) + Math.abs(closestFood!.y - newPos.y)
        return newDistance < minDistance
      })

      if (dirTowardsFood.length > 0) {
        return dirTowardsFood[Math.floor(Math.random() * dirTowardsFood.length)]
      }
    }

    // If no good direction towards food, pick a random valid direction
    return validDirections[Math.floor(Math.random() * validDirections.length)]
  }

  // Move snakes
  const moveSnakes = () => {
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers]

      // First, update directions for all players
      newPlayers.forEach((player, index) => {
        if (!player.alive) return

        // Update direction
        player.direction = player.nextDirection

        // For AI players, calculate next move
        if (player.type === "ai") {
          player.nextDirection = getAIDirection(index)
        }
      })

      // Then move all snakes
      newPlayers.forEach((player, playerIndex) => {
        if (!player.alive) return

        const head = player.snake[0]
        const newHead = {
          x: head.x + player.direction.x,
          y: head.y + player.direction.y,
        }

        // Check if the new position is valid
        if (!isValidPosition(newHead, playerIndex)) {
          player.alive = false
          return
        }

        // Add new head
        player.snake.unshift(newHead)

        // Check if snake eats food
        const foodIndex = food.findIndex((f) => f.x === newHead.x && f.y === newHead.y)

        if (foodIndex !== -1) {
          // Remove eaten food
          setFood((prev) => prev.filter((_, i) => i !== foodIndex))

          // Increase score
          player.score += FOOD_VALUE

          // Generate new food
          generateFood(1, newPlayers)

          // Don't remove tail (snake grows)
        } else {
          // Remove tail if no food was eaten
          player.snake.pop()
        }
      })

      // Check if game is over
      const alivePlayers = newPlayers.filter((p) => p.alive)
      if (alivePlayers.length <= 1 && alivePlayers.length < newPlayers.length) {
        if (alivePlayers.length === 1) {
          setWinner(newPlayers.findIndex((p) => p.alive))
        }
        setGameOver(true)
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current)
          gameLoopRef.current = null
        }
      }

      return newPlayers
    })
  }

  // Start game loop
  const startGameLoop = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }

    gameLoopRef.current = setInterval(() => {
      if (!gamePaused) {
        moveSnakes()
      }
    }, speed)
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gamePaused || gameOver) return

      const key = e.key.toLowerCase()

      players.forEach((player, index) => {
        if (player.type !== "human" || !player.alive) return

        const controls = PLAYER_CONTROLS[index]

        let newDirection = player.direction

        if (key === controls.up.toLowerCase() && player.direction.y !== 1) {
          newDirection = DIRECTIONS.UP
        } else if (key === controls.down.toLowerCase() && player.direction.y !== -1) {
          newDirection = DIRECTIONS.DOWN
        } else if (key === controls.left.toLowerCase() && player.direction.x !== 1) {
          newDirection = DIRECTIONS.LEFT
        } else if (key === controls.right.toLowerCase() && player.direction.x !== -1) {
          newDirection = DIRECTIONS.RIGHT
        } else {
          return
        }

        setPlayers((prev) => {
          const newPlayers = [...prev]
          newPlayers[index].nextDirection = newDirection
          return newPlayers
        })
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [players, gameStarted, gamePaused, gameOver])

  // Start game loop when game starts
  useEffect(() => {
    if (gameStarted && !gamePaused && !gameOver && gameLoopRef.current === null) {
      startGameLoop()
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }
  }, [gameStarted, gamePaused, gameOver])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-4xl game-font">
      {!gameStarted ? (
        <PlayerSelection onStart={startGame} />
      ) : (
        <div className="flex flex-col items-center gap-4 w-full">
          <ScoreBoard players={players} />

          <div
            className="relative w-full border-2 border-[#2a2a40] game-grid glow-border"
            style={{
              aspectRatio: "1/1",
              maxHeight: "calc(100vh - 220px)", // Adjust to prevent scrolling
              maxWidth: "calc(100vh - 220px)",
            }}
          >
            {/* Game board grid */}
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
              }}
            >
              {/* Render grid lines */}
              {Array.from({ length: BOARD_SIZE }).map((_, y) =>
                Array.from({ length: BOARD_SIZE }).map((_, x) => (
                  <div key={`${x}-${y}`} className="border border-[#1a1a30]" />
                )),
              )}
            </div>

            {/* Obstacles */}
            {obstacles.map((obstacle, index) => (
              <div
                key={`obstacle-${index}`}
                className="absolute bg-[#2a2a40]"
                style={{
                  left: `${(obstacle.x / BOARD_SIZE) * 100}%`,
                  top: `${(obstacle.y / BOARD_SIZE) * 100}%`,
                  width: `${100 / BOARD_SIZE}%`,
                  height: `${100 / BOARD_SIZE}%`,
                  zIndex: 15,
                }}
              />
            ))}

            {/* Food */}
            {food.map((f, index) => (
              <Food key={`food-${index}`} position={f} boardSize={BOARD_SIZE} />
            ))}

            {/* Snakes */}
            {players.map(
              (player, index) =>
                player.alive && (
                  <Snake
                    key={`snake-${index}`}
                    segments={player.snake}
                    colorClass={player.colorClass}
                    boardSize={BOARD_SIZE}
                  />
                ),
            )}
          </div>

          <GameControls onReset={resetGame} onPause={togglePause} isPaused={gamePaused} />

          {gameOver && (
            <GameOverModal
              winner={winner !== null ? players[winner] : null}
              players={players}
              onPlayAgain={resetGame}
            />
          )}
        </div>
      )}
    </div>
  )
}
