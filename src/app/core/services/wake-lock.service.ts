import { Injectable, signal } from '@angular/core';

/** Uses the Screen Wake Lock API to keep the device screen on (e.g. during recitation). */
@Injectable({
  providedIn: 'root'
})
export class WakeLockService {
  private sentinel: WakeLockSentinel | null = null;
  private visibilityListener: (() => void) | null = null;

  /** True when a wake lock is currently held. */
  readonly isActive = signal(false);

  /** Whether the Wake Lock API is available (HTTPS, supported browser). */
  get isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  async request(): Promise<boolean> {
    if (!this.isSupported) return false;
    try {
      if (this.sentinel) return true;
      this.sentinel = await navigator.wakeLock.request('screen');
      this.isActive.set(true);
      this.sentinel.addEventListener('release', () => {
        this.sentinel = null;
        this.isActive.set(false);
      });
      this.visibilityListener = () => this.handleVisibilityChange();
      document.addEventListener('visibilitychange', this.visibilityListener);
      return true;
    } catch {
      this.isActive.set(false);
      return false;
    }
  }

  private async handleVisibilityChange(): Promise<void> {
    if (document.visibilityState === 'visible' && this.isActive() && !this.sentinel) {
      await this.request();
    }
  }

  async release(): Promise<void> {
    this.clearVisibilityListener();
    if (this.sentinel) {
      try {
        await this.sentinel.release();
      } catch {}
      this.sentinel = null;
    }
    this.isActive.set(false);
  }

  private clearVisibilityListener(): void {
    if (this.visibilityListener) {
      document.removeEventListener('visibilitychange', this.visibilityListener);
      this.visibilityListener = null;
    }
  }

  async toggle(): Promise<boolean> {
    if (this.isActive()) {
      await this.release();
      return false;
    }
    return this.request();
  }
}
