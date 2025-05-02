"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Gamepad2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PlayerType = "human" | "ai"
type MapType = "classic" | "death-star" | "kingdoms" | "lake"
type ColorOption = "random" | "emerald" | "sky" | "amber" | "purple" | "pink" | "red"

interface GameSettings {
  playerTypes: PlayerType[]
  playerCount: number
  gameSpeed: number
  mapType: MapType
  playerColors: ColorOption[]
}

interface PlayerSelectionProps {
  onStart: (settings: GameSettings) => void
}

// Color display names
const COLOR_NAMES: Record<ColorOption, string> = {
  random: "RANDOM",
  emerald: "GREEN",
  sky: "BLUE",
  amber: "YELLOW",
  purple: "PURPLE",
  pink: "PINK",
  red: "RED",
}

// Color preview classes
const COLOR_PREVIEW_CLASSES: Record<ColorOption, string> = {
  random: "bg-gradient-to-r from-[#00ff9d] via-[#00d2ff] to-[#ffcc00]",
  emerald: "bg-[#00ff9d]",
  sky: "bg-[#00d2ff]",
  amber: "bg-[#ffcc00]",
  purple: "bg-[#d580ff]",
  pink: "bg-[#ff80bf]",
  red: "bg-[#ff5555]",
}

export function PlayerSelection({ onStart }: PlayerSelectionProps) {
  const [playerTypes, setPlayerTypes] = useState<PlayerType[]>(["human", "ai", "ai", "ai"])
  const [playerCount, setPlayerCount] = useState<number>(4)
  const [gameSpeed, setGameSpeed] = useState<number>(150)
  const [mapType, setMapType] = useState<MapType>("classic")
  const [playerColors, setPlayerColors] = useState<ColorOption[]>(["random", "random", "random", "random"])

  const handlePlayerTypeChange = (index: number, type: PlayerType) => {
    const newPlayerTypes = [...playerTypes]
    newPlayerTypes[index] = type
    setPlayerTypes(newPlayerTypes)
  }

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count)
  }

  const handleGameSpeedChange = (speed: number) => {
    setGameSpeed(speed)
  }

  const handleMapTypeChange = (map: MapType) => {
    setMapType(map)
  }

  const handlePlayerColorChange = (index: number, color: ColorOption) => {
    const newPlayerColors = [...playerColors]
    newPlayerColors[index] = color
    setPlayerColors(newPlayerColors)
  }

  const handleStartGame = () => {
    // Only use the number of players selected
    const activePlayerTypes = playerTypes.slice(0, playerCount)
    const activePlayerColors = playerColors.slice(0, playerCount)

    onStart({
      playerTypes: activePlayerTypes,
      playerCount,
      gameSpeed,
      mapType,
      playerColors: activePlayerColors,
    })
  }

  // Get available colors for a specific player
  const getAvailableColors = (playerIndex: number): ColorOption[] => {
    const usedColors = playerColors
      .filter((_, index) => index !== playerIndex && index < playerCount)
      .filter((color) => color !== "random")

    return ["random", "emerald", "sky", "amber", "purple", "pink", "red"].filter(
      (color) => color === "random" || !usedColors.includes(color as ColorOption),
    ) as ColorOption[]
  }

  // Map preview components
  const MapPreviews = {
    classic: <div className="w-full h-12 bg-[#151525] border border-[#2a2a40] rounded-sm"></div>,
    "death-star": (
      <div className="w-full h-12 bg-[#151525] border border-[#2a2a40] rounded-sm flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#a0a0c0]"></div>
      </div>
    ),
    kingdoms: (
      <div className="w-full h-12 bg-[#151525] border border-[#2a2a40] rounded-sm relative overflow-hidden">
        <div className="grid grid-cols-2 grid-rows-2 gap-1 p-1 absolute inset-0">
          <div className="bg-[#1a1a30] rounded-sm"></div>
          <div className="bg-[#1a1a30] rounded-sm"></div>
          <div className="bg-[#1a1a30] rounded-sm"></div>
          <div className="bg-[#1a1a30] rounded-sm"></div>
        </div>
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#a0a0c0] -ml-0.5"></div>
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#a0a0c0] -mt-0.5"></div>
      </div>
    ),
    lake: (
      <div className="w-full h-12 bg-[#151525] border border-[#2a2a40] rounded-sm flex items-center justify-center">
        <svg width="80%" height="80%" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#1a1a30" />
          <path d="M30,30 L70,30 L60,60 L40,60 Z" fill="#151525" stroke="#a0a0c0" strokeWidth="2" />
        </svg>
      </div>
    ),
  }

  return (
    <Card className="w-full max-w-4xl bg-[#151525] border border-[#2a2a40] glow-border game-font">
      <CardHeader className="pb-2">
        <div className="flex justify-center">
          <Gamepad2 className="h-12 w-12 text-[#00ff9d]" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Player Settings */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-[#00ff9d]">NUMBER OF PLAYERS</h3>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map((count) => (
                  <Button
                    key={count}
                    variant={playerCount === count ? "default" : "outline"}
                    onClick={() => handlePlayerCountChange(count)}
                    className={
                      playerCount === count
                        ? "bg-[#00ff9d] text-[#151525] hover:bg-[#00cc7d]"
                        : "bg-[#1a1a30] text-[#e0e0ff] hover:bg-[#2a2a40] hover:text-[#00ff9d]"
                    }
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-[#00ff9d]">PLAYER SETTINGS</h3>
              {Array.from({ length: playerCount }).map((_, index) => (
                <div key={index} className="flex flex-col gap-2 p-2 bg-[#1a1a30] rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#e0e0ff]">PLAYER {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <ToggleGroup
                        type="single"
                        value={playerTypes[index]}
                        onValueChange={(value) => {
                          if (value) handlePlayerTypeChange(index, value as PlayerType)
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem
                          value="human"
                          aria-label="Human player"
                          className="data-[state=on]:bg-[#00ff9d] data-[state=on]:text-[#151525] text-[#e0e0ff] h-8 px-2"
                        >
                          HUMAN
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="ai"
                          aria-label="AI player"
                          className="data-[state=on]:bg-[#00ff9d] data-[state=on]:text-[#151525] text-[#e0e0ff] h-8 px-2"
                        >
                          AI
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#a0a0c0] text-sm">COLOR:</span>
                    <Select
                      value={playerColors[index]}
                      onValueChange={(value) => handlePlayerColorChange(index, value as ColorOption)}
                    >
                      <SelectTrigger className="w-32 h-8 bg-[#151525] border-[#2a2a40] text-[#e0e0ff]">
                        <SelectValue placeholder="Select color" className="text-[#e0e0ff]" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#151525] border-[#2a2a40]">
                        {getAvailableColors(index).map((color) => (
                          <SelectItem
                            key={color}
                            value={color}
                            className="text-[#e0e0ff] hover:bg-[#2a2a40] focus:bg-[#2a2a40] focus:text-[#e0e0ff]"
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${COLOR_PREVIEW_CLASSES[color]}`}></div>
                              <span>{COLOR_NAMES[color]}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Map, Speed, Start Button */}
          <div className="flex flex-col justify-between h-full">
            {/* Map Selection */}
            <div className="space-y-4 mb-4">
              <h3 className="font-medium text-[#00ff9d]">MAP TYPE</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "classic", name: "CLASSIC" },
                  { id: "death-star", name: "DEATH STAR" },
                  { id: "kingdoms", name: "KINGDOMS" },
                  { id: "lake", name: "LAKE" },
                ].map((map) => (
                  <Button
                    key={map.id}
                    variant={mapType === map.id ? "default" : "outline"}
                    onClick={() => handleMapTypeChange(map.id as MapType)}
                    className={`h-auto flex flex-col items-center p-2 ${
                      mapType === map.id
                        ? "bg-[#00ff9d] text-[#151525] hover:bg-[#00cc7d]"
                        : "bg-[#1a1a30] text-[#e0e0ff] hover:bg-[#2a2a40] hover:text-[#00ff9d]"
                    }`}
                  >
                    <span className="font-bold mb-1">{map.name}</span>
                    <div className={`w-full ${mapType === map.id ? "opacity-70" : "opacity-100"}`}>
                      {MapPreviews[map.id as MapType]}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Game Speed */}
            <div className="space-y-4 mb-4">
              <h3 className="font-medium text-[#00ff9d]">GAME SPEED</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 50, label: "INSANE" },
                  { value: 100, label: "FAST" },
                  { value: 150, label: "NORMAL" },
                  { value: 200, label: "SLOW" },
                ].map((speed) => (
                  <Button
                    key={speed.value}
                    variant={gameSpeed === speed.value ? "default" : "outline"}
                    onClick={() => handleGameSpeedChange(speed.value)}
                    className={
                      gameSpeed === speed.value
                        ? "bg-[#00ff9d] text-[#151525] hover:bg-[#00cc7d]"
                        : "bg-[#1a1a30] text-[#e0e0ff] hover:bg-[#2a2a40] hover:text-[#00ff9d]"
                    }
                  >
                    {speed.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Start Game Button */}
            <Button
              onClick={handleStartGame}
              className="w-full bg-[#00ff9d] text-[#151525] hover:bg-[#00cc7d] game-button h-12 text-lg"
            >
              START GAME
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
