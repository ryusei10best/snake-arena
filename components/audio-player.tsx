"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
  isPlaying?: boolean // Made optional since we'll play automatically
}

export function AudioPlayer({ isPlaying = true }: AudioPlayerProps) {
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    const audio = new Audio("/snake-theme.mp3")
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio

    // Try to play immediately when the component mounts
    if (!isMuted) {
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented. User interaction required.")
        })
      }
    }

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying && !isMuted) {
      // Try to play the audio
      const playPromise = audioRef.current.play()

      // Handle autoplay restrictions
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented. User interaction required.")
        })
      }
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, isMuted])

  const toggleMute = () => {
    setIsMuted((prev) => {
      if (audioRef.current) {
        if (!prev) {
          audioRef.current.pause()
        } else if (isPlaying) {
          audioRef.current.play().catch((error) => {
            console.log("Play prevented. User interaction required.")
          })
        }
      }
      return !prev
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMute}
        className="bg-[#151525] border border-[#2a2a40] text-[#00ff9d] hover:bg-[#1a1a30] hover:text-[#00ff9d] game-button"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </Button>
    </div>
  )
}
