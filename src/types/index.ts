/**
 * Interface representing a drum sample configuration.
 * Contains metadata about a drum sound including its variants and key mapping.
 */
export interface DrumSample {
  /** Unique identifier for the drum */
  id: string
  /** Display name of the drum */
  name: string
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
/** Bumped when persisted config shape or defaults change */
export const CONFIG_STORE_VERSION = 3

export interface DrumPadConfig {
  /** Persisted config schema version (for migrations) */
  configVersion?: number
  /** Whether hi-hat is in closed mode (true) or open mode (false) */
  hihatClosed: boolean
  /** Whether to use rimshot (true) or normal snare (false) */
  useRimshot: boolean
  /** Overall output volume (0-1) */
  overallVolume: number
  /** Metronome click volume (0-1), scaled by overall */
  metronomeVolume: number
  /** Drum pad sample volume (0-1), scaled by overall */
  drumpadVolume: number
  /** Current theme name */
  currentTheme: string
  /** Current view mode */
  currentView: ViewMode
  /** Metronome tempo in beats per minute */
  metronomeBpm: number
}

/** Minimum metronome BPM */
export const METRONOME_BPM_MIN = 40

/** Maximum metronome BPM */
export const METRONOME_BPM_MAX = 300

/** Default metronome BPM */
export const METRONOME_BPM_DEFAULT = 120

/**
 * Union type for available view modes in the application.
 */
export type ViewMode = 'drumpad' | 'info' | 'settings'

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
  { id: 'hihat', name: 'Hi-Hat', keyCode: '1', position: 7 },
  { id: 'snare', name: 'Snare', keyCode: '2', position: 8 },
  { id: 'kick', name: 'Kick', keyCode: '3', position: 9 },
  { id: 'tom1', name: 'Tom 1', keyCode: '4', position: 4 },
  { id: 'tom2', name: 'Tom 2', keyCode: '5', position: 5 },
  { id: 'floor', name: 'Floor Tom', keyCode: '6', position: 6 },
  { id: 'crash', name: 'Crash', keyCode: '7', position: 1 },
  { id: 'splash', name: 'Splash', keyCode: '8', position: 2 },
  { id: 'ride', name: 'Ride', keyCode: '9', position: 3 },
]

/** Tips for mouse / keyboard (fine pointer) devices. */
export const TIPS_POINTER: TipItem[] = [
  { id: 1, text: 'Click pads with your mouse, or use Numpad 1–9 to play drums' },
  { id: 2, text: 'The top row is the metronome: / and * change BPM; hold them to step faster' },
  { id: 3, text: 'Press Space to start or stop the metronome — watch the beat dots pulse' },
  { id: 4, text: 'Press − or Numpad − to toggle hi-hat open/closed (default is closed)' },
  { id: 5, text: 'Press + or Numpad + to toggle snare/rimshot' },
  { id: 6, text: 'Press 0 or Numpad 0 to start/stop recording' },
  { id: 7, text: 'Press . or Numpad . to play/stop a recording' },
  { id: 8, text: 'Press Numpad Enter to clear a recording' },
  { id: 9, text: 'Playback starts at your first drum hit, not when you pressed Record' },
  { id: 10, text: 'Record, play, and clear buttons sit below the bottom drum row' },
  { id: 11, text: 'Each drum has 3 sound variants for a more natural feel' },
  { id: 12, text: 'Hit multiple pads at once to layer your beats' },
  { id: 13, text: 'Settings has separate sliders for overall, metronome, and drumpad volume' },
  { id: 14, text: 'Use “Reset volume to defaults” in Settings to restore all sliders to 70%' },
  { id: 15, text: 'Pick a theme in Settings — dark, light, cyber, or OG' },
  { id: 16, text: 'See all controls and credits on the Info page' },
]

/** Tips for touch-primary phones and tablets. */
export const TIPS_TOUCH: TipItem[] = [
  { id: 1, text: 'Tap drum pads to play — each pad is labeled with its drum name' },
  { id: 2, text: 'Hold BPM − or + to change tempo; release to stop stepping' },
  { id: 3, text: 'Tap the Metronome button to start or stop — watch the beat dots pulse' },
  { id: 4, text: 'Use the Hi-Hat button to toggle open/closed (default is closed)' },
  { id: 5, text: 'Use the Snare button to toggle normal sound or rimshot' },
  { id: 6, text: 'Tap Record to start or stop capturing your performance' },
  { id: 7, text: 'Tap Play to hear your recording; tap again to stop playback' },
  { id: 8, text: 'Tap Clear to wipe the current recording' },
  { id: 9, text: 'Playback starts at your first drum hit, not when you tapped Record' },
  { id: 10, text: 'Record, Play, and Clear sit below the bottom drum row; Hi-Hat and Snare are on the right' },
  { id: 11, text: 'Each drum has 3 sound variants for a more natural feel' },
  { id: 12, text: 'Tap multiple pads at once to layer your beats' },
  { id: 13, text: 'Settings has separate sliders for overall, metronome, and drumpad volume' },
  { id: 14, text: 'Use “Reset volume to defaults” in Settings to restore all sliders to 70%' },
  { id: 15, text: 'Pick a theme in Settings — dark, light, cyber, or OG' },
  { id: 16, text: 'See on-screen controls and credits on the Info page' },
]
