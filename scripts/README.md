# Scripts

## build-surah-audio.mjs

Builds **one full MP3 per surah** by downloading each verse from [EveryAyah](https://everyayah.com/) (reciter: Saood ash-Shuraym, 128kbps) and concatenating them with **ffmpeg**. Output goes to `src/assets/audio/surahs-full/` (e.g. `al-fatiha.mp3`, `yasin.mp3`).

When **ffprobe** (from ffmpeg) is available, the script also writes **verse start times** to `src/assets/audio/surahs-full/<id>.json`. The app uses these to sync the displayed verse to the full-surah playback.

Use these full files in the app for continuous playback (e.g. better behavior when the browser tab is in the background).

### Requirements

- **Node 18+** (for `fetch`)
- **ffmpeg** on your PATH ([download](https://ffmpeg.org/download.html))

### Usage

```bash
# Build all surahs (can take a while; many HTTP requests)
npm run build:surah-audio

# Build one surah only
node scripts/build-surah-audio.mjs al-fatiha
```

### Note

EveryAyah provides recitations for educational and personal use. Please respect their terms. The script only downloads public URLs and does not redistribute beyond your local project.
