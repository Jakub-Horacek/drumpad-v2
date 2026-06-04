import { audioService } from './AudioService'
import { METRONOME_BPM_MAX, METRONOME_BPM_MIN } from '../types'

const SCHEDULE_AHEAD_SEC = 0.1
const LOOKAHEAD_MS = 25

type BeatListener = () => void

/**
 * Schedules metronome clicks using the shared Web Audio context.
 */
class MetronomeService {
  private bpm = 120
  private isRunning = false
  private nextNoteTime = 0
  private timerId: ReturnType<typeof setInterval> | null = null
  private beatListeners = new Set<BeatListener>()

  get running(): boolean {
    return this.isRunning
  }

  setBpm(bpm: number): void {
    this.bpm = clampBpm(bpm)
  }

  async start(): Promise<void> {
    if (this.isRunning) return

    await audioService.resumeContext()
    const ctx = audioService.getAudioContext()
    if (!ctx) return

    this.isRunning = true
    this.nextNoteTime = ctx.currentTime + 0.05
    this.timerId = setInterval(() => this.scheduler(), LOOKAHEAD_MS)
  }

  stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId)
      this.timerId = null
    }
    this.isRunning = false
  }

  async toggle(): Promise<void> {
    if (this.isRunning) {
      this.stop()
    } else {
      await this.start()
    }
  }

  /**
   * Subscribe to metronome beats (fired when each click is scheduled).
   *
   * @param listener - Called for each beat
   * @returns Unsubscribe function
   */
  onBeat(listener: BeatListener): () => void {
    this.beatListeners.add(listener)
    return () => {
      this.beatListeners.delete(listener)
    }
  }

  private emitBeat(): void {
    for (const listener of this.beatListeners) {
      listener()
    }
  }

  private scheduler(): void {
    const ctx = audioService.getAudioContext()
    if (!ctx || !this.isRunning) return

    while (this.nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_SEC) {
      audioService.playMetronomeClick(this.nextNoteTime)
      this.emitBeat()
      this.nextNoteTime += 60 / this.bpm
    }
  }
}

function clampBpm(bpm: number): number {
  return Math.min(METRONOME_BPM_MAX, Math.max(METRONOME_BPM_MIN, Math.round(bpm)))
}

export const metronomeService = new MetronomeService()
