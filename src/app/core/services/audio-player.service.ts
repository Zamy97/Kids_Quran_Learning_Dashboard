import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  currentVerseIndex: number;
  loading: boolean;
}

export interface LoadAudioOptions {
  autoPlay?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private audio: HTMLAudioElement | null = null;

  private audioState = signal<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
    currentVerseIndex: 0,
    loading: false
  });

  /** Fires when the current audio finishes. Use for looping or auto-advance. */
  readonly onEnded = new Subject<void>();

  readonly state = this.audioState.asReadonly();

  loadAudio(url: string, options?: LoadAudioOptions): void {
    const autoPlay = options?.autoPlay ?? false;
    this.audioState.update(s => ({ ...s, loading: true }));

    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.audio = new Audio(url);

    this.audio.addEventListener('loadedmetadata', () => {
      this.audioState.update(s => ({
        ...s,
        duration: this.audio?.duration ?? 0,
        loading: false
      }));
      if (autoPlay) {
        this.audio?.play().then(() => {
          this.audioState.update(s => ({ ...s, isPlaying: true }));
        }).catch(() => {});
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      this.audioState.update(s => ({
        ...s,
        currentTime: this.audio?.currentTime ?? 0
      }));
    });

    this.audio.addEventListener('ended', () => {
      this.audioState.update(s => ({
        ...s,
        isPlaying: false,
        currentTime: 0
      }));
      this.onEnded.next();
    });

    this.audio.addEventListener('error', () => {
      this.audioState.update(s => ({
        ...s,
        loading: false,
        isPlaying: false
      }));
    });
  }

  play(): void {
    if (this.audio) {
      this.audio.play();
      this.audioState.update(s => ({ ...s, isPlaying: true }));
    }
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.audioState.update(s => ({ ...s, isPlaying: false }));
    }
  }

  togglePlay(): void {
    if (this.audioState().isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(time: number): void {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  setPlaybackRate(rate: number): void {
    if (this.audio) {
      this.audio.playbackRate = rate;
      this.audioState.update(s => ({ ...s, playbackRate: rate }));
    }
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    this.audioState.set({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      playbackRate: 1.0,
      currentVerseIndex: 0,
      loading: false
    });
  }
}
