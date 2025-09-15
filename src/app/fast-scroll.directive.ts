import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[cdkDropList]' // 🔥 هيتطبق تلقائي على أي DropList
})
export class FastScrollDirective {
  private scrollSpeed = 50; // السرعة (غيّرها حسب راحتك)
  private scrollZone = 120; // المسافة اللي يبدأ عندها يعمل scroll

  constructor(private el: ElementRef) { }

  @HostListener('document:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    const container = this.el.nativeElement;
    if (!container) return;

    const { top, bottom } = container.getBoundingClientRect();

    if (event.clientY < top + this.scrollZone) {
      container.scrollTop -= this.scrollSpeed;
    } else if (event.clientY > bottom - this.scrollZone) {
      container.scrollTop += this.scrollSpeed;
    }
  }
}
