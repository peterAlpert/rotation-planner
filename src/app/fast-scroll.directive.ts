import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[fastScroll]'
})
export class FastScrollDirective {
  private scrollSpeed = 60;   // 🔥 سرعة الاسكرول (جرب تزود الرقم)
  private scrollZone = 100;   // يبدأ يـ scroll لو قربت 100px من الحافة

  @HostListener('document:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    const { clientY } = event;
    const windowHeight = window.innerHeight;

    // لو الماوس قريب من فوق الصفحة → scroll لأعلى
    if (clientY < this.scrollZone) {
      window.scrollBy({ top: -this.scrollSpeed, behavior: 'smooth' });
    }
    // لو الماوس قريب من تحت الصفحة → scroll لأسفل
    else if (clientY > windowHeight - this.scrollZone) {
      window.scrollBy({ top: this.scrollSpeed, behavior: 'smooth' });
    }
  }
}
