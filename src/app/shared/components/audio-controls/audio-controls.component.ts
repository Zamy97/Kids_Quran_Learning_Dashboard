import { Component, computed, Input, OnInit, OnDestroy } from '@angular/core';
import { AudioPlayerService } from '../../../core/services/audio-player.service';

@Component({
  selector: 'app-audio-controls',
  standalone: true,
  template: `
    <div class="bg-gradient-to-r from-primary to-primary-light p-4 md:p-6 rounded-2xl shadow-lg">
      <div class="flex items-center gap-3 md:gap-4 mb-4">
        <button
          (click)="togglePlay()"
          [disabled]="audioState().loading"
          class="bg-white text-primary px-6 py-3 md:px-8 md:py-4 rounded-full
                 font-bold text-lg md:text-xl hover:scale-105 transition-all
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          @if (audioState().loading) {
            <span class="animate-spin">⏳</span>
          } @else if (audioState().isPlaying) {
            ⏸️ Pause
          } @else {
            ▶️ Play
          }
        </button>

        <input
          type="range"
          [value]="audioState().currentTime"
          [max]="audioState().duration || 100"
          (input)="onSeek($event)"
          class="flex-1 h-2 bg-white/30 rounded-full appearance-none cursor-pointer"
        />

        <span class="text-white font-semibold text-sm md:text-base min-w-[80px] text-right">
          {{ formatTime(audioState().currentTime) }} / {{ formatTime(audioState().duration) }}
        </span>

        <select
          [value]="audioState().playbackRate"
          (change)="onSpeedChange($event)"
          class="bg-white text-primary px-3 py-2 rounded-full font-semibold cursor-pointer"
        >
          <option [value]="0.75">0.75x</option>
          <option [value]="1.0">1x</option>
          <option [value]="1.25">1.25x</option>
          <option [value]="1.5">1.5x</option>
        </select>
      </div>

      <div class="text-white text-center text-sm">
        Progress: {{ progressPercent() }}%
      </div>
    </div>
  `,
  styles: [`
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
    }
  `]
})
export class AudioControlsComponent implements OnInit, OnDestroy {
  @Input() audioUrl?: string;

  audioState = this.audioService.state;

  progressPercent = computed(() => {
    const state = this.audioState();
    if (state.duration === 0) return 0;
    return Math.round((state.currentTime / state.duration) * 100);
  });

  constructor(private audioService: AudioPlayerService) {}

  ngOnInit(): void {
    if (this.audioUrl) {
      this.audioService.loadAudio(this.audioUrl);
    }
  }

  ngOnDestroy(): void {
    this.audioService.destroy();
  }

  togglePlay(): void {
    this.audioService.togglePlay();
  }

  onSeek(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.audioService.seek(value);
  }

  onSpeedChange(event: Event): void {
    const speed = parseFloat((event.target as HTMLSelectElement).value);
    this.audioService.setPlaybackRate(speed);
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
