[![Vue 3.5.13](https://img.shields.io/badge/Vue-3.5.13-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Bun 1.2.5](https://img.shields.io/badge/Bun-1.2.5-000000?logo=bun&logoColor=white)](https://bun.sh/)
[![Vite 6.2.4](https://img.shields.io/badge/Vite-6.2.4-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript 5.8.0](https://img.shields.io/badge/TypeScript-5.8.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

# drumpad-v2

## About This Project

**Drumpad 2.0** is a modern recreation and upgrade of my original Drumpad project from high school. The original Drumpad was one of my earliest projects, created between December 2018 and April 2019 as my first official JavaScript project for my high school "Klauzurní Práce" (final project). Despite its age, the original project still works to this day!

You can find the old project code here: [github.com/Jakub-Horacek/drumpad](https://github.com/Jakub-Horacek/drumpad)  
It is also being hosted at: [jakub-horacek.github.io/drumpad](https://jakub-horacek.github.io/drumpad/)

This new version, Drumpad 2.0, is built using the Vue 3 framework with TypeScript, bringing the project up to date with modern web development practices. The core idea remains the same: you can play virtual drums by hitting keys or clicking pads, and the app plays corresponding drum sounds. It's a fun and interactive way to experiment with rhythm and sound.

> [!NOTE]  
> Drumpad 2.0 is still in development. Once this version is finished, I will probably archive the old project.

---

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

A modern drum pad application built with Vue 3, TypeScript, and Vite. Features a numpad-style layout, metronome, recording, separate volume controls, and multiple themes.

## Features

- 🥁 **9 drum sounds** — Each with 3 variants for realistic playing
- 🎵 **Web Audio engine** — Low-latency playback via the Web Audio API
- ⏱️ **Metronome** — Adjustable BPM (`/` and `*`, hold to step faster), visual beat bar, Space to start/stop
- 📹 **Recording & playback** — Record beats; playback starts at your first hit (leading silence is trimmed)
- ⌨️ **Numpad layout** — Grid mirrors a keyboard numpad; full mouse and keyboard support
- 🎛️ **Drum modes** — Hi-hat open/closed (default closed), snare/rimshot toggles beside the grid
- 🔊 **Volume mix** — Separate sliders for overall, metronome, and drumpad output
- 🎨 **Themes** — Dark, light, cyber, and OG
- 📱 **Responsive UI** — Works on mobile, tablet, and desktop
- 🚀 **Vue 3 + Pinia + TypeScript** — Persisted settings, documented codebase

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Type-Check, Compile and Minify for Production

```sh
bun run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun lint
```

## Project Structure

```
src/
├── assets/              # Global CSS
├── components/          # Vue components (DrumPad, Settings, Info, …)
├── composables/         # Shared composables (e.g. accelerating hold)
├── services/            # AudioService, MetronomeService, DebugService
├── stores/              # Pinia stores (drumpad, config)
├── themes/              # Theme CSS (dark, light, cyber, og)
├── types/               # TypeScript types and tips
├── App.vue
└── main.ts
public/sounds/           # Drum sample MP3s
```

## Key Controls

### Keyboard shortcuts

| Key | Action |
| --- | --- |
| `1`–`9` / `Numpad 1`–`9` | Play drums |
| `-` / `Numpad -` | Toggle hi-hat open / closed |
| `+` / `Numpad +` | Toggle snare / rimshot |
| `0` / `Numpad 0` | Start / stop recording |
| `.` / `Numpad .` | Play / stop recording |
| `Numpad Enter` | Clear recording |
| `/` / `Numpad /` | Decrease metronome BPM (hold to repeat) |
| `*` / `Numpad *` | Increase metronome BPM (hold to repeat) |
| `Space` | Start / stop metronome |

Mouse clicks on pads work the same as number keys. On-screen buttons mirror record, play, clear, metronome, and BPM controls.

### Numpad layout (on-screen grid)

```
[ / ]    [ BPM ]    [ * ]     ← metronome row
7        8        9        [−]   ← hi-hat toggle
4        5        6        [+]   ← snare toggle
1        2        3     [Enter]  ← clear (tall key)
[ 0 Record ]  [ . Play ]         ← bottom row
[ Space — metronome start/stop ]  ← full width below grid
```

Drum mapping:

```
7 - Crash    8 - Splash   9 - Ride
4 - Tom 1    5 - Tom 2    6 - Floor Tom
1 - Hi-Hat   2 - Snare    3 - Kick
```

### Recording

- Press **Record** (`0`) when ready; play your pattern.
- Stop recording with **Record** again. Timestamps are trimmed so the first drum hit is at 0 ms.
- **Play** (`.`) starts playback from that first hit, without a long silent intro.
- **Clear** (`Numpad Enter`) removes the recording.

### Settings

- **Overall volume** — Master output level
- **Metronome volume** — Click loudness (scaled by overall)
- **Drumpad volume** — Drum sample loudness (scaled by overall)
- **Reset volume to defaults** — Sets all three sliders to 70%
- **Theme** — Dark, light, cyber, or OG

## Audio Setup

Place samples in `public/sounds/` using this naming convention:

```
HIHAT_1.mp3, HIHAT_2.mp3, HIHAT_3.mp3       # Closed hi-hat
HIHAT_O_1.mp3, HIHAT_O_2.mp3, HIHAT_O_3.mp3 # Open hi-hat
SNARE_1.mp3, SNARE_2.mp3, SNARE_3.mp3       # Snare drum
RIMSHOT_1.mp3, RIMSHOT_2.mp3, RIMSHOT_3.mp3 # Rimshot
KICK_1.mp3, KICK_2.mp3, KICK_3.mp3          # Kick drum
TOM1_1.mp3, TOM1_2.mp3, TOM1_3.mp3          # Tom 1
TOM2_1.mp3, TOM2_2.mp3, TOM2_3.mp3          # Tom 2
FLOOR_1.mp3, FLOOR_2.mp3, FLOOR_3.mp3       # Floor tom
CRASH_1.mp3, CRASH_2.mp3, CRASH_3.mp3       # Crash cymbal
SPLASH_1.mp3, SPLASH_2.mp3, SPLASH_3.mp3    # Splash cymbal
RIDE_1.mp3, RIDE_2.mp3, RIDE_3.mp3          # Ride cymbal
```

## Theme System

Themes live in `src/themes/` and are loaded via `src/themes/index.ts`. Each theme defines CSS custom properties (background, accent, metronome colors, etc.). The active theme class is applied on the root app element (`theme-dark`, `theme-light`, `theme-cyber`, `theme-og`).

## Browser Compatibility

- Chrome 66+
- Firefox 60+
- Safari 14+
- Edge 79+

Requires Web Audio API support for optimal experience.

## Performance

- Parallel audio preloading at startup
- Web Audio API scheduling for metronome clicks
- Vite production builds with tree shaking

## Development

### Code documentation

The project uses JSDoc on services, stores, and major components for IDE hints and maintainability.

### Adding new drum sounds

1. Add MP3 files to `public/sounds/`
2. Update `DRUM_SAMPLES` in `src/types/index.ts`
3. Add the type to the preload list in `AudioService.ts`

### Adding a new theme

1. Add a CSS file under `src/themes/`
2. Register it in `src/themes/index.ts`
3. Add the theme id to the theme selector in Settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License — feel free to use this project for personal or commercial purposes.

## Credits

- **Developer**: Jakub Horáček
- **Sounds**: KalacSound

## Future Enhancements

- [ ] MIDI support
- [ ] Custom sound upload
- [ ] Advanced effects (reverb, delay)
- [ ] PWA / offline mode
