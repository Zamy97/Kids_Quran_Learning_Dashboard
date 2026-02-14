# Fatimah's Quran Journey 🌙

A child-friendly, interactive Quran learning application built with **Angular 17+**, designed for touchscreen/kiosk mode on Raspberry Pi, tablets, and desktop browsers. Full offline capability with PWA support.

## Tech Stack

- **Angular 17+** (standalone components)
- **TailwindCSS 3.x**
- **Angular Signals** for state management
- **HTML5 Audio API**
- **PWA** (Angular Service Worker ready)

## Quick Start

```bash
# Install dependencies (if needed)
npm install

# Development server
npm start
# Open http://localhost:4200

# Production build
npm run build:prod
# Output: dist/kids_quran_dashboard/
```

## Project Structure

- `src/app/core/` — Models, services, and static data (surahs, duas, hadiths, Arabic letters)
- `src/app/features/` — Home, Surahs (list + detail with Listen/Read modes), Duas, Hadith, Letters (alphabet, joining, words), Nasheeds
- `src/app/shared/` — Header, navigation, audio controls, back button, pipes, directives
- `src/assets/audio/` — Place MP3 files for surahs, duas, and nasheeds here

## Features

- **Home** — Welcome screen with progress summary and quick actions
- **Surahs** — Library with search; detail view with Listen (verse-by-verse) and Read (full text) modes and audio controls
- **Duas** — List by category; detail with Arabic, transliteration, translation, and explanation
- **Hadith** — Daily hadith with story and lesson
- **Letters** — Arabic alphabet, letter joining, and simple words
- **Nasheeds** — Placeholder for Islamic songs (add audio to `src/assets/audio/nasheeds/`)
- **Progress** — Memorized surahs and activity stored in `localStorage`

## Adding Audio

1. Add MP3 files under `src/assets/audio/surahs/`, `src/assets/audio/duas/`, or `src/assets/audio/nasheeds/`.
2. Reference them in the data files (e.g. `surahs.data.ts`) as `assets/audio/surahs/your-file.mp3`.

## Kiosk Mode (Raspberry Pi)

1. Build: `npm run build:prod`
2. Copy `dist/kids_quran_dashboard/` to the Pi (e.g. `/home/pi/quran-app/`).
3. Make the script executable: `chmod +x launch-kiosk.sh`
4. Run `./launch-kiosk.sh` or add to autostart (see spec for `~/.config/autostart/quran-app.desktop`).

**Note:** The build output path may be `dist/kids_quran_dashboard/browser/` — update `launch-kiosk.sh` with the correct path to `index.html` if needed.

## Scripts

| Script        | Description                |
|---------------|----------------------------|
| `npm start`   | Dev server                 |
| `npm run build` | Default build            |
| `npm run build:prod` | Production build      |
| `npm run watch` | Watch mode development |
