import { Directive, ElementRef, Input, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[appAutoscroll]',
  standalone: true
})
export class AutoscrollDirective implements AfterViewChecked {
  @Input() appAutoscroll?: boolean;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewChecked(): void {
    if (this.appAutoscroll) {
      this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}
