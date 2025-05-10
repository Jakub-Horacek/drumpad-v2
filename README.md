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

> **Note:** Drumpad 2.0 is still in development. Once this version is finished, I will probably archive the old project.

---

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

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
