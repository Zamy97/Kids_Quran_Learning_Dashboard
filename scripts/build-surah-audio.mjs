#!/usr/bin/env node
/**
 * Build one full MP3 per surah by downloading each verse from EveryAyah and
 * concatenating with ffmpeg. Outputs to src/assets/audio/surahs-full/
 *
 * Requirements: Node 18+ (for fetch), ffmpeg on PATH
 * Usage: node scripts/build-surah-audio.mjs [surah-id]
 *   With no args, builds all surahs. With one arg (e.g. al-fatiha), builds that surah only.
 *
 * EveryAyah: https://everyayah.com/ — please respect their terms and use for personal/educational purposes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://everyayah.com/data/Saood_ash-Shuraym_128kbps';
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'audio', 'surahs-full');
const TEMP_BASE = path.join(ROOT, 'tmp-surah-build');

const SURAHS = [
  { id: 'al-fatiha', number: 1, verses: 7 },
  { id: 'yasin', number: 36, verses: 83 },
  { id: 'al-qalam', number: 68, verses: 52 },
  { id: 'al-adiyat', number: 100, verses: 11 },
  { id: 'al-qariah', number: 101, verses: 11 },
  { id: 'at-takathur', number: 102, verses: 8 },
  { id: 'al-asr', number: 103, verses: 3 },
  { id: 'al-humazah', number: 104, verses: 9 },
  { id: 'al-fil', number: 105, verses: 5 },
  { id: 'quraysh', number: 106, verses: 4 },
  { id: 'al-maun', number: 107, verses: 7 },
  { id: 'al-kawthar', number: 108, verses: 3 },
  { id: 'al-kafirun', number: 109, verses: 6 },
  { id: 'an-nasr', number: 110, verses: 3 },
  { id: 'al-masad', number: 111, verses: 5 },
  { id: 'al-ikhlas', number: 112, verses: 4 },
  { id: 'al-falaq', number: 113, verses: 5 },
  { id: 'an-nas', number: 114, verses: 6 },
];

function pad3(n) {
  return String(n).padStart(3, '0');
}

function verseUrl(surahNum, verseNum) {
  return `${BASE_URL}/${pad3(surahNum)}${pad3(verseNum)}.mp3`;
}

function download(url) {
  return fetch(url, { redirect: 'follow' }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
    return r.arrayBuffer();
  });
}

function ffmpegAvailable() {
  return new Promise((resolve) => {
    const proc = spawn('ffmpeg', ['-version'], { stdio: 'ignore' });
    proc.on('error', () => resolve(false));
    proc.on('close', (code) => resolve(code === 0));
  });
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (c) => { stderr += c; });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}\n${stderr}`));
    });
    proc.on('error', (err) => {
      if (err.code === 'ENOENT') {
        reject(new Error('ffmpeg not found. Install it from https://ffmpeg.org/download.html or use the built-in fallback (no ffmpeg).'));
      } else reject(err);
    });
  });
}

/** Get duration in seconds of an audio file via ffprobe. Returns null if ffprobe not available or fails. */
function getDuration(filePath) {
  return new Promise((resolve) => {
    const proc = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      filePath,
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    proc.stdout?.on('data', (c) => { out += c; });
    proc.stderr?.on('data', (c) => { out += c; });
    proc.on('error', () => resolve(null));
    proc.on('close', (code) => {
      if (code !== 0) return resolve(null);
      const d = parseFloat(out.trim());
      resolve(Number.isFinite(d) ? d : null);
    });
  });
}

/** Build verseStartTimes array (start time in seconds of each verse) and write to OUT_DIR/id.json. */
async function writeVerseStartTimes(workDir, surahNum, verses, id) {
  const times = [];
  let sum = 0;
  for (let v = 1; v <= verses; v++) {
    times.push(sum);
    const filepath = path.join(workDir, `${pad3(surahNum)}${pad3(v)}.mp3`);
    const d = await getDuration(filepath);
    if (d == null) return false;
    sum += d;
  }
  const jsonPath = path.join(OUT_DIR, `${id}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify({ verseStartTimes: times }, null, 0), 'utf8');
  console.log(`[${id}] -> ${jsonPath} (verse times)`);
  return true;
}

/** Concatenate MP3 files by raw byte append; works when all files are same format (e.g. same EveryAyah source). */
function concatMp3Files(workDir, surahNum, verses) {
  const chunks = [];
  for (let v = 1; v <= verses; v++) {
    const filename = `${pad3(surahNum)}${pad3(v)}.mp3`;
    chunks.push(fs.readFileSync(path.join(workDir, filename)));
  }
  return Buffer.concat(chunks);
}

async function buildSurah(surah, useFfmpeg) {
  const { id, number, verses } = surah;
  const workDir = path.join(TEMP_BASE, id);
  fs.mkdirSync(workDir, { recursive: true });

  console.log(`[${id}] Downloading ${verses} verses...`);
  for (let v = 1; v <= verses; v++) {
    const url = verseUrl(number, v);
    const filename = `${pad3(number)}${pad3(v)}.mp3`;
    const filepath = path.join(workDir, filename);
    try {
      const buf = await download(url);
      fs.writeFileSync(filepath, Buffer.from(buf));
    } catch (e) {
      throw new Error(`${id} verse ${v}: ${e.message}`);
    }
  }

  const outFile = path.join(OUT_DIR, `${id}.mp3`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  if (useFfmpeg) {
    const listPath = path.join(workDir, 'list.txt');
    const listLines = [];
    for (let v = 1; v <= verses; v++) {
      listLines.push(`file '${pad3(number)}${pad3(v)}.mp3'`);
    }
    fs.writeFileSync(listPath, listLines.join('\n'), 'utf8');
    console.log(`[${id}] Concatenating with ffmpeg...`);
    await runFfmpeg([
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', listPath,
      '-c', 'copy',
      outFile,
    ]);
  } else {
    console.log(`[${id}] Concatenating (raw MP3)...`);
    fs.writeFileSync(outFile, concatMp3Files(workDir, number, verses));
  }

  const wroteTimes = await writeVerseStartTimes(workDir, number, verses, id);
  if (!wroteTimes) {
    console.warn(`[${id}] Could not write verse times (install ffmpeg/ffprobe for verse sync).`);
  }

  console.log(`[${id}] -> ${outFile}`);
}

async function main() {
  const filter = process.argv[2];
  const list = filter
    ? SURAHS.filter((s) => s.id === filter)
    : SURAHS;
  if (list.length === 0) {
    console.error('No surah found. Use a surah id from the list, e.g. al-fatiha');
    process.exit(1);
  }

  const useFfmpeg = await ffmpegAvailable();
  if (!useFfmpeg) {
    console.warn('ffmpeg not found on PATH. Using raw MP3 concatenation (works fine for same-source files).');
    console.warn('Install ffmpeg for optional cleaner output: https://ffmpeg.org/download.html\n');
  }

  try {
    for (const surah of list) {
      await buildSurah(surah, useFfmpeg);
    }
    fs.rmSync(TEMP_BASE, { recursive: true, force: true });
    console.log('Done.');
  } catch (e) {
    console.error(e.message || e);
    process.exit(1);
  }
}

main();
