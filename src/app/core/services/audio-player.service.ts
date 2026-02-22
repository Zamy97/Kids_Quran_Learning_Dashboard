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

export interface MediaSessionMetadata {
  title: string;
  artist?: string;
  album?: string;
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
    playbackRate: 0.75,
    currentVerseIndex: 0,
    loading: false
  });

  /** Fires when the current audio finishes. Use for looping or auto-advance. */
  readonly onEnded = new Subject<void>();

  readonly state = this.audioState.asReadonly();

  /**
   * Set Media Session metadata so the OS shows the current track and can keep playback
   * in background (lock screen / notification controls) on supported devices.
   */
  setMediaSessionMetadata(meta: MediaSessionMetadata | null): void {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    if (!meta) {
      navigator.mediaSession.metadata = null;
      return;
    }
    navigator.mediaSession.metadata = new MediaMetadata({
      title: meta.title,
      artist: meta.artist ?? '',
      album: meta.album ?? ''
    });
    navigator.mediaSession.setActionHandler('play', () => this.play());
    navigator.mediaSession.setActionHandler('pause', () => this.pause());
  }

  /** Update Media Session playback state (e.g. when play/pause changes). */
  setMediaSessionPlaybackState(playing: boolean): void {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }

  loadAudio(url: string, options?: LoadAudioOptions): void {
    const autoPlay = options?.autoPlay ?? false;
    this.audioState.update(s => ({ ...s, loading: true }));

    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.audio = new Audio(url);
    this.audio.playbackRate = this.audioState().playbackRate;

    this.audio.addEventListener('loadedmetadata', () => {
      this.audioState.update(s => ({
        ...s,
        duration: this.audio?.duration ?? 0,
        loading: false
      }));
      if (autoPlay) {
        this.audio?.play().then(() => {
          this.audioState.update(s => ({ ...s, isPlaying: true }));
          this.setMediaSessionPlaybackState(true);
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
      this.setMediaSessionPlaybackState(false);
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
      this.setMediaSessionPlaybackState(true);
    }
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.audioState.update(s => ({ ...s, isPlaying: false }));
      this.setMediaSessionPlaybackState(false);
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
    this.setMediaSessionMetadata(null);
    this.setMediaSessionPlaybackState(false);
    this.audioState.set({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      playbackRate: this.audioState().playbackRate,
      currentVerseIndex: 0,
      loading: false
    });
  }
}
