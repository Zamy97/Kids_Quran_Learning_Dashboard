import { Injectable, signal, effect } from '@angular/core';

const STORAGE_KEY = 'theme';
const DARK = 'dark';
const LIGHT = 'light';
export type Theme = typeof DARK | typeof LIGHT;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isDark = signal<boolean>(this.readInitial());

  /** Whether dark mode is active. */
  readonly dark = this.isDark.asReadonly();

  constructor() {
    this.apply(this.isDark());
    effect(() => {
      const dark = this.isDark();
      this.apply(dark);
    });
  }

  toggle(): void {
    this.isDark.update((v) => !v);
    this.persist();
  }

  setDark(value: boolean): void {
    this.isDark.set(value);
    this.persist();
  }

  private readInitial(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === DARK) return true;
    if (stored === LIGHT) return false;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  private persist(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(STORAGE_KEY, this.isDark() ? DARK : LIGHT);
  }

  private apply(dark: boolean): void {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}
