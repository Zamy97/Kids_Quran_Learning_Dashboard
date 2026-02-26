# Full surah audio (one MP3 per surah)

This folder holds **one concatenated MP3 per surah** (built from [EveryAyah](https://everyayah.com/) verse files). The app uses these for continuous playback (e.g. when the browser tab is in the background). When you run the build script with **ffprobe** available, it also generates `<id>.json` files with verse start times so the displayed verse stays in sync with the audio.

## Adding files to the repo

1. From the project root, run:
   ```bash
   npm run build:surah-audio
   ```
   Or build specific surahs: `node scripts/build-surah-audio.mjs al-fatiha yusuf`

   To download **full surahs for Juz 29 and Surah Yusuf** only:
   ```bash
   node scripts/build-surah-audio.mjs yusuf al-mulk al-qalam al-haqqah al-maarij nuh al-jinn al-muzzammil al-muddaththir al-qiyamah al-insan al-mursalat an-naba
   ```

2. Commit the generated `.mp3` files:
   ```bash
   git add src/assets/audio/surahs-full/*.mp3
   git commit -m "Add full surah audio (EveryAyah)"
   git push
   ```

Anyone who clones the repo will then have the audio without running the build script. Repo size will increase (roughly a few MB depending on how many surahs you build). If you prefer to keep the repo small, leave this folder empty and have each environment run `npm run build:surah-audio` when needed.

**Note:** Audio is from EveryAyah (reciter: Saood ash-Shuraym). Please respect their terms of use when redistributing.
