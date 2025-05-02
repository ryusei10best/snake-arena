import { Card, CardContent } from "@/components/ui/card"
import { User, Cpu } from "lucide-react"

interface Player {
  type: "human" | "ai"
  score: number
  alive: boolean
  color: string
  colorClass: string
}

interface ScoreBoardProps {
  players: Player[]
}

export function ScoreBoard({ players }: ScoreBoardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {players.map((player, index) => (
        <Card key={index} className={`${!player.alive ? "opacity-50" : ""} bg-[#151525] border border-[#2a2a40]`}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${player.colorClass}`} />
              <span className="font-medium text-[#e0e0ff]">PLAYER {index + 1}</span>
              {player.type === "human" ? <User className="h-4 w-4" /> : <Cpu className="h-4 w-4" />}
            </div>
            <div className="font-bold text-[#00ff9d]">{player.score}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
