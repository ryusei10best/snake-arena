"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Trophy } from "lucide-react"

interface Player {
  type: "human" | "ai"
  score: number
  alive: boolean
  color: string
  colorClass: string
}

interface GameOverModalProps {
  winner: Player | null
  players: Player[]
  onPlayAgain: () => void
}

export function GameOverModal({ winner, players, onPlayAgain }: GameOverModalProps) {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md bg-[#151525] border border-[#2a2a40] game-font">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-[#00ff9d] game-title glow-text">GAME OVER</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {winner ? (
            <div className="flex flex-col items-center mb-6">
              <Trophy className={`h-16 w-16 ${winner.colorClass.replace("bg-", "text-")} mb-2`} />
              <p className="text-xl font-bold text-[#00ff9d]">
                PLAYER {players.findIndex((p) => p === winner) + 1} WINS!
              </p>
              <p className="text-sm text-[#a0a0c0]">{winner.type === "human" ? "HUMAN" : "AI"} PLAYER</p>
            </div>
          ) : (
            <p className="text-center mb-6 text-[#00ff9d]">IT'S A TIE!</p>
          )}

          <div className="space-y-2">
            <h3 className="font-medium text-center mb-2 text-[#00ff9d]">FINAL SCORES</h3>
            {sortedPlayers.map((player, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded bg-[#1a1a30]">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${player.colorClass}`} />
                  <span className="text-[#e0e0ff]">
                    PLAYER {players.findIndex((p) => p === player) + 1}({player.type === "human" ? "HUMAN" : "AI"})
                  </span>
                </div>
                <span className="font-bold text-[#00ff9d]">{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onPlayAgain} className="w-full bg-[#00ff9d] text-[#151525] hover:bg-[#00cc7d] game-button">
            PLAY AGAIN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
