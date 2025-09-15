import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[fastScroll]'
})
export class FastScrollDirective {
  private scrollSpeed = 40; // كل tick يزود/ينقص (جرب تزودها)
  private scrollZone = 80;  // يبدأ يعمل scroll لما يقرب من الحافة بالبكسل

  constructor(private el: ElementRef) { }

  @HostListener('document:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    const container = this.el.nativeElement as HTMLElement;

    // لازم يكون عنده scroll
    if (container.scrollHeight <= container.clientHeight) return;

    const { top, bottom } = container.getBoundingClientRect();

    if (event.clientY < top + this.scrollZone) {
      container.scrollTop -= this.scrollSpeed;
    } else if (event.clientY > bottom - this.scrollZone) {
      container.scrollTop += this.scrollSpeed;
    }
  }
}
