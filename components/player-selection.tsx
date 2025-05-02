"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { User, Cpu, Gamepad2 } from "lucide-react"

type PlayerType = "human" | "ai"

interface PlayerSelectionProps {
  onStart: (playerTypes: PlayerType[]) => void
}

export function PlayerSelection({ onStart }: PlayerSelectionProps) {
  const [playerTypes, setPlayerTypes] = useState<PlayerType[]>(["human", "ai", "ai", "ai"])

  const handlePlayerTypeChange = (index: number, type: PlayerType) => {
    const newPlayerTypes = [...playerTypes]
    newPlayerTypes[index] = type
    setPlayerTypes(newPlayerTypes)
  }

  return (
    <Card className="w-full max-w-md bg-[#151525] border border-[#2a2a40] glow-border game-font">
      <CardHeader className="pb-2">
        <div className="flex justify-center mb-2">
          <Gamepad2 className="h-12 w-12 text-[#00ff9d]" />
        </div>
        <CardTitle className="text-2xl text-center text-[#00ff9d] game-title">SELECT PLAYERS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {playerTypes.map((type, index) => (
          <div key={index} className="space-y-2">
            <h3 className="font-medium text-[#00ff9d]">PLAYER {index + 1}</h3>
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={(value) => {
                if (value) handlePlayerTypeChange(index, value as PlayerType)
              }}
              className="justify-start"
            >
              <ToggleGroupItem
                value="human"
                aria-label="Human player"
                className="data-[state=on]:bg-[#00ff9d] data-[state=on]:text-[#151525]"
              >
                <User className="h-4 w-4 mr-2" />
                HUMAN
              </ToggleGroupItem>
              <ToggleGroupItem
                value="ai"
                aria-label="AI player"
                className="data-[state=on]:bg-[#00ff9d] data-[state=on]:text-[#151525]"
              >
                <Cpu className="h-4 w-4 mr-2" />
                AI
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onStart(playerTypes)}
          className="w-full bg-[#00ff9d] text-[#151525] hover:bg-[#00cc7d] game-button"
        >
          START GAME
        </Button>
      </CardFooter>
    </Card>
  )
}
