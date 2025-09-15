import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[fastScroll]',
  standalone: true
})
export class FastScrollDirective {
  private scrollSpeed = 200;   // 🔥 زود الرقم لسرعة أكبر
  private scrollZone = 50;     // المنطقة اللي يبدأ عندها يعمل scroll

  constructor(private el: ElementRef) { }

  @HostListener('document:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    const container = this.el.nativeElement;
    const { top, bottom } = container.getBoundingClientRect();
    const { clientY } = event;

    // scroll لأعلى
    if (clientY < top + this.scrollZone) {
      container.scrollTop -= this.scrollSpeed;
    }
    // scroll لأسفل
    else if (clientY > bottom - this.scrollZone) {
      container.scrollTop += this.scrollSpeed;
    }
  }
}
