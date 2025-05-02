"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, RefreshCw } from "lucide-react"

interface GameControlsProps {
  onReset: () => void
  onPause: () => void
  isPaused: boolean
}

export function GameControls({ onReset, onPause, isPaused }: GameControlsProps) {
  return (
    <div className="flex gap-4 game-font">
      <Button
        variant="outline"
        onClick={onReset}
        className="bg-[#151525] border border-[#2a2a40] text-[#00ff9d] hover:bg-[#1a1a30] hover:text-[#00ff9d] game-button"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        RESET
      </Button>
      <Button
        variant="outline"
        onClick={onPause}
        className="bg-[#151525] border border-[#2a2a40] text-[#00ff9d] hover:bg-[#1a1a30] hover:text-[#00ff9d] game-button"
      >
        {isPaused ? (
          <>
            <Play className="h-4 w-4 mr-2" />
            RESUME
          </>
        ) : (
          <>
            <Pause className="h-4 w-4 mr-2" />
            PAUSE
          </>
        )}
      </Button>
    </div>
  )
}
