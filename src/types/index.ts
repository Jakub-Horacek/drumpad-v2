/**
 * Interface representing a drum sample configuration.
 * Contains metadata about a drum sound including its variants and key mapping.
 */
export interface DrumSample {
  /** Unique identifier for the drum */
  id: string
  /** Display name of the drum */
  name: string
  /** Number of sound variants available (typically 3) */
  variants: number
  /** Keyboard key code for triggering this drum */
  keyCode: string
  /** Position in the drum pad grid (1-9) */
  position: number
}

/**
 * Interface representing a recorded drum event.
 * Used for playback functionality to recreate drum sequences.
 */
export interface RecordedEvent {
  /** Timestamp relative to recording start (in milliseconds) */
  timestamp: number
  /** ID of the drum that was played */
  drumId: string
  /** Variant number that was played (0-2) */
  variant: number
}

/**
 * Interface representing the drum pad configuration settings.
 * Contains all user-configurable options with persistence.
 */
export interface DrumPadConfig {
  /** Whether hi-hat is in closed mode (true) or open mode (false) */
  hihatClosed: boolean
  /** Whether to use rimshot (true) or normal snare (false) */
  useRimshot: boolean
  /** Master volume level (0-1) */
  volume: number
  /** Current theme name */
  currentTheme: string
  /** Current view mode */
  currentView: ViewMode
}

/**
 * Union type for available view modes in the application.
 */
export type ViewMode = 'drumpad' | 'guide' | 'settings'

/**
 * Interface representing a tip item for the help system.
 * Used to display rotating tips to users.
 */
export interface TipItem {
  /** Unique identifier for the tip */
  id: number
  /** Text content of the tip */
  text: string
}

/**
 * Array of all available drum samples with their configurations.
 * Defines the complete set of drums available in the drum pad.
 * Each drum has 3 variants for realistic sound variation.
 */
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

/**
 * Array of helpful tips for users.
 * Rotates through these tips to help users learn the application features.
 */
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
