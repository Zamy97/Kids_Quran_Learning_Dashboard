import { Component, computed, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { AudioPlayerService } from '../../../core/services/audio-player.service';

@Component({
  selector: 'app-audio-controls',
  standalone: true,
  template: `
    <div
      class="bg-gradient-to-r from-primary to-primary-light text-white shadow-lg"
      [class.p-4]="!compact"
      [class.md:p-6]="!compact"
      [class.rounded-2xl]="!compact"
      [class.p-3]="compact"
      [class.rounded-none]="compact"
    >
      <div
        class="flex items-center gap-3 md:gap-4"
        [class.mb-4]="!compact"
        [class.flex-nowrap]="compact"
      >
        <button
          (click)="togglePlay()"
          [disabled]="audioState().loading"
          class="bg-white text-primary rounded-full font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          [class.px-6]="!compact"
          [class.py-3]="!compact"
          [class.md:px-8]="!compact"
          [class.md:py-4]="!compact"
          [class.text-lg]="!compact"
          [class.md:text-xl]="!compact"
          [class.px-4]="compact"
          [class.py-2]="compact"
          [class.text-base]="compact"
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
          class="flex-1 min-w-0 h-2 bg-white/30 rounded-full appearance-none cursor-pointer"
        />

        <span class="font-semibold text-right shrink-0" [class.min-w-[80px]]="!compact" [class.text-sm]="compact" [class.md:text-base]="!compact">
          {{ formatTime(audioState().currentTime) }} / {{ formatTime(audioState().duration) }}
        </span>

        <select
          [value]="audioState().playbackRate"
          (change)="onSpeedChange($event)"
          class="bg-white text-primary rounded-full font-semibold cursor-pointer shrink-0"
          [class.px-3]="!compact"
          [class.py-2]="!compact"
          [class.px-2]="compact"
          [class.py-1]="compact"
          [class.text-sm]="compact"
          title="Playback speed"
        >
          <option [value]="0.5">0.5x Slower</option>
          <option [value]="0.75">0.75x</option>
          <option [value]="1.0">1x Normal</option>
          <option [value]="1.25">1.25x</option>
          <option [value]="1.5">1.5x</option>
        </select>
      </div>

      @if (!compact) {
        <div class="text-white text-center text-sm">
          Progress: {{ progressPercent() }}%
        </div>
      }
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
export class AudioControlsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() audioUrl?: string;
  /** When true, playback starts automatically when the track is loaded. */
  @Input() autoPlay = false;
  /** When true, renders a slim single-row bar (e.g. for fixed bottom on surah page). */
  @Input() compact = false;

  audioState = this.audioService.state;

  progressPercent = computed(() => {
    const state = this.audioState();
    if (state.duration === 0) return 0;
    return Math.round((state.currentTime / state.duration) * 100);
  });

  constructor(private audioService: AudioPlayerService) {}

  ngOnInit(): void {
    if (this.audioUrl) {
      this.audioService.loadAudio(this.audioUrl, { autoPlay: this.autoPlay });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const urlChange = changes['audioUrl'];
    if (urlChange && this.audioUrl && urlChange.previousValue !== this.audioUrl) {
      this.audioService.loadAudio(this.audioUrl, { autoPlay: this.autoPlay });
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
