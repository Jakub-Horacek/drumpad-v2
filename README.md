[![Vue 3.5.13](https://img.shields.io/badge/Vue-3.5.13-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Bun 1.2.5](https://img.shields.io/badge/Bun-1.2.5-000000?logo=bun&logoColor=white)](https://bun.sh/)
[![Vite 6.2.4](https://img.shields.io/badge/Vite-6.2.4-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript 5.8.0](https://img.shields.io/badge/TypeScript-5.8.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

# drumpad-v2

## About This Project

**Drumpad 2.0** is a modern recreation and upgrade of my original Drumpad project from high school. The original Drumpad was one of my earliest projects, created between December 2018 and April 2019 as my first official JavaScript project for my high school "Klauzurní Práce" (final project). Despite its age, the original project still works to this day!

You can find the old project code here: [github.com/Jakub-Horacek/drumpad](https://github.com/Jakub-Horacek/drumpad)  
It is also being hosted at: [jakub-horacek.github.io/drumpad](https://jakub-horacek.github.io/drumpad/)

This new version, Drumpad 2.0, is built using the Vue 3 framework with TypeScript, bringing the project up to date with modern web development practices. The core idea remains the same: you can play virtual drums by hitting keys, and the app will play corresponding drum sounds. It's a fun and interactive way to experiment with rhythm and sound.

> [!NOTE]  
> Drumpad 2.0 is still in development. Once this version is finished, I will probably archive the old project.

---

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

A modern, professional drum pad application built with Vue 3, TypeScript, and Vite. Features a responsive design, advanced audio engine, and recording capabilities. The codebase is fully documented with JSDoc comments for excellent developer experience and maintainability.

## Features

- 🥁 **9 Different Drum Sounds** - Each with 3 variants for realistic playing
- 🎵 **Advanced Audio Engine** - Web Audio API for low-latency, high-quality sound
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- 🎨 **Multiple Themes** - Dark, light, and cyber themes (extensible)
- 📹 **Recording & Playback** - Record your beats and play them back
- ⌨️ **Keyboard Support** - Full keyboard and numpad support
- 🎛️ **Customizable Settings** - Hi-hat open/close, snare/rimshot toggle, volume control
- 🚀 **Modern Architecture** - Vue 3 Composition API, Pinia state management, TypeScript
- 📚 **Comprehensive Documentation** - Full JSDoc documentation for all functions, classes, and components

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
├── assets/          # CSS and static assets
├── components/      # Vue components
│   ├── DrumPad.vue  # Main drumpad grid
│   └── PadTile.vue  # Individual drum pad
├── services/        # Business logic
│   └── AudioService.ts  # Audio management
├── stores/          # Pinia stores
│   └── drumpadStore.ts  # Main application state
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.vue          # Root component
└── main.ts          # Application entry point
```

## Key Controls

### Keyboard Shortcuts

- `1-9` or `Numpad 1-9` - Play drum sounds
- `-` or `Numpad -` - Toggle Hi-Hat open/closed
- `+` or `Numpad +` - Toggle Snare/Rimshot
- `Space` - Play/pause recording
- `Shift + Space` - Start/stop recording

### Drum Layout

```
7 - Crash    8 - Splash   9 - Ride
4 - Tom 1    5 - Tom 2    6 - Floor Tom
1 - Hi-Hat   2 - Snare    3 - Kick
```

## Audio Setup

The application uses the Web Audio API for optimal performance. Audio files should be placed in the `public/sounds/` directory with the following naming convention:

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

The application supports multiple themes through CSS custom properties. To add a new theme:

1. Add theme variables in `assets/main.css`
2. Update the theme selector in the settings
3. Themes are automatically applied via CSS classes

Current themes:

- **Dark** (default) - Modern dark interface
- **Light** - Clean light interface (ready for implementation)
- **Cyber** - Neon cyberpunk style (ready for implementation)

## Browser Compatibility

- Chrome 66+
- Firefox 60+
- Safari 14+
- Edge 79+

Requires Web Audio API support for optimal experience.

## Performance Optimizations

- **Audio Preloading** - All sounds loaded at startup
- **Web Audio API** - Low-latency audio processing
- **Component Lazy Loading** - Efficient memory usage
- **Modern Build Tools** - Vite for fast development and optimal production builds
- **Tree Shaking** - Unused code elimination

## Development

### Code Documentation

This project uses **JSDoc** for comprehensive code documentation. All functions, classes, interfaces, and Vue components are documented with:

- Function/class descriptions
- Parameter types and descriptions
- Return value documentation
- Usage examples where helpful
- Type annotations for better IDE support

The documentation follows modern JSDoc standards and provides excellent developer experience with IntelliSense support in most editors.

### Adding New Drum Sounds

1. Add audio files to `public/sounds/`
2. Update `DRUM_SAMPLES` in `types/index.ts`
3. Update the audio service to handle the new sounds

### Adding New Themes

1. Add CSS variables in `assets/main.css`
2. Update theme selection in settings
3. Test across all components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

- **Developer**: Jakub Horáček
- **Sounds**: KalacSound
- **Icons**: Heroicons (conceptual - replace with your preferred icon library)

## Future Enhancements

- [ ] BPM/metronome
- [ ] MIDI support
- [ ] Custom sound upload
- [ ] Advanced effects (reverb, delay)
- [ ] PWA capabilities
- [ ] Offline mode
