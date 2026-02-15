import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private queue: { text: string; lang: string }[] = [];
  private isSpeaking = false;

  /** Whether the browser supports speech synthesis. */
  get supported(): boolean {
    return !!this.synth;
  }

  /** Whether we are currently speaking. */
  get speaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Speak a single phrase. Returns a promise that resolves when done.
   */
  speak(text: string, lang: string = 'en'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth || !text?.trim()) {
        resolve();
        return;
      }
      this.synth.cancel();
      const u = new SpeechSynthesisUtterance(text.trim());
      u.lang = lang;
      u.rate = 0.85;
      u.onend = () => {
        this.isSpeaking = false;
        resolve();
      };
      u.onerror = () => {
        this.isSpeaking = false;
        resolve();
      };
      this.isSpeaking = true;
      this.synth.speak(u);
    });
  }

  /**
   * Speak multiple phrases in order (e.g. Arabic then English).
   * Uses a short pause between them.
   */
  async speakSequence(parts: { text: string; lang: string }[]): Promise<void> {
    if (!this.synth) return;
    this.cancel();
    for (const part of parts) {
      if (!part.text?.trim()) continue;
      await this.speak(part.text, part.lang);
      if (parts.indexOf(part) < parts.length - 1) {
        await this.delay(400);
      }
    }
  }

  cancel(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
  }
}
