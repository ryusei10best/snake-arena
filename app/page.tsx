import { GameBoard } from "@/components/game-board"
import { ThemeProvider } from "@/components/theme-provider"
import { AudioPlayer } from "@/components/audio-player"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="snake-theme">
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0f0f1a] text-foreground game-font">
        <h1 className="text-4xl font-bold mb-4 text-center text-[#00ff9d] game-title glow-text">SNAKE ARENA</h1>
        <GameBoard />
        <AudioPlayer />
      </main>
    </ThemeProvider>
  )
}
