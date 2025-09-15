import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[fastScroll]'
})
export class FastScrollDirective {
  private scrollSpeed = 100;   // 🔥 جرّب تزود الرقم (كل ما زاد أسرع)
  private scrollZone = 50;    // المسافة من الحافة اللي يبدأ عندها الاسكرول

  constructor(private el: ElementRef) { }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    const container = this.el.nativeElement as HTMLElement;
    const { top, bottom } = container.getBoundingClientRect();
    const { clientY } = event;

    // لو الماوس قريب من فوق الـ div → scroll لأعلى
    if (clientY < top + this.scrollZone) {
      container.scrollTop -= this.scrollSpeed;
    }
    // لو الماوس قريب من تحت الـ div → scroll لأسفل
    else if (clientY > bottom - this.scrollZone) {
      container.scrollTop += this.scrollSpeed;
    }
  }
}
