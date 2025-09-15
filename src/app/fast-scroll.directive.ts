import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[fastScroll]'
})
export class FastScrollDirective {
  private scrollSpeed = 100; // 🔥 زود الرقم لتسريع

  constructor(private el: ElementRef) { }

  @HostListener('document:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    const { top, bottom } = this.el.nativeElement.getBoundingClientRect();
    const scrollZone = 10; // المسافة اللي يبدأ عندها يعمل scroll
    const container = this.el.nativeElement;

    if (event.clientY < top + scrollZone) {
      container.scrollTop -= this.scrollSpeed;
    } else if (event.clientY > bottom - scrollZone) {
      container.scrollTop += this.scrollSpeed;
    }
  }
}
