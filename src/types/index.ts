export interface DrumSample {
  id: string
  name: string
  variants: number
  keyCode: string
  position: number
}

export interface RecordedEvent {
  timestamp: number
  drumId: string
  variant: number
}

export interface DrumPadConfig {
  hihatClosed: boolean
  useRimshot: boolean
  volume: number
  currentTheme: string
  currentView: ViewMode
}

export type ViewMode = 'drumpad' | 'guide' | 'settings'

export interface TipItem {
  id: number
  text: string
}

export const DRUM_SAMPLES: DrumSample[] = [
  { id: 'hihat', name: 'Hi-Hat', variants: 3, keyCode: '1', position: 7 },
  { id: 'snare', name: 'Snare', variants: 3, keyCode: '2', position: 8 },
  { id: 'kick', name: 'Kick', variants: 3, keyCode: '3', position: 9 },
  { id: 'tom1', name: 'Tom 1', variants: 3, keyCode: '4', position: 4 },
  { id: 'tom2', name: 'Tom 2', variants: 3, keyCode: '5', position: 5 },
  { id: 'floor', name: 'Floor Tom', variants: 3, keyCode: '6', position: 6 },
  { id: 'crash', name: 'Crash', variants: 3, keyCode: '7', position: 1 },
  { id: 'splash', name: 'Splash', variants: 3, keyCode: '8', position: 2 },
  { id: 'ride', name: 'Ride', variants: 3, keyCode: '9', position: 3 },
]

export const TIPS: TipItem[] = [
  { id: 1, text: 'Use numeric keypad for best experience' },
  { id: 2, text: 'Press - to toggle between closed/open hi-hat' },
  { id: 3, text: 'Press + to toggle between snare and rimshot' },
  { id: 4, text: 'Turn up your volume for better sound experience' },
  { id: 5, text: 'Use headphones for optimal audio quality' },
  { id: 6, text: 'Try recording and playing back your beats!' },
  { id: 7, text: 'Each drum has 3 different sound variants for realism' },
  { id: 8, text: 'Multiple pads can play at the same time - create complex beats!' },
]
