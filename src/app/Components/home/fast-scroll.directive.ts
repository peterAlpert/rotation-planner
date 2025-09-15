import { Directive, ElementRef, HostListener, NgZone } from '@angular/core';

@Directive({
  selector: '[fastScroll]',
  standalone: true
})
export class FastScrollDirective {
  private isDragging = false;
  private rafId = 0;
  private lastEvent: DragEvent | null = null;

  // قابل للتعديل:
  private maxSpeed = 40;   // أقصى بيكسل لكل إطار (زود عشان أسرع)
  private zone = 150;      // مسافة من الحافة تبدأ عندها الحركة

  constructor(private el: ElementRef<HTMLElement>, private ngZone: NgZone) { }

  // نفعّل حالة السحب عند بداية الـ drag
  @HostListener('document:dragstart', ['$event'])
  onDragStart(_: DragEvent) {
    this.isDragging = true;
  }

  // نوقف كل حاجة عند نهاية السحب
  @HostListener('document:dragend', ['$event'])
  onDragEnd(_: DragEvent) {
    this.isDragging = false;
    this.lastEvent = null;
    this.stopRaf();
  }

  // نحتفظ بآخر حدث dragover و نبدأ حلقة RAF لو مش شغالة
  @HostListener('document:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    if (!this.isDragging) return;
    this.lastEvent = event;
    if (!this.rafId) this.runRaf();
  }

  private runRaf() {
    // خارج Angular لتقليل الـ change detection overhead
    this.ngZone.runOutsideAngular(() => {
      const loop = () => {
        if (!this.isDragging || !this.lastEvent) {
          this.stopRaf();
          return;
        }

        const ev = this.lastEvent;
        const rect = this.el.nativeElement.getBoundingClientRect();

        // حساب المسافات من الحواف
        const topDist = ev.clientY - rect.top;
        const bottomDist = rect.bottom - ev.clientY;

        let delta = 0;
        if (topDist >= 0 && topDist < this.zone) {
          delta = -Math.round(((this.zone - topDist) / this.zone) * this.maxSpeed);
        } else if (bottomDist >= 0 && bottomDist < this.zone) {
          delta = Math.round(((this.zone - bottomDist) / this.zone) * this.maxSpeed);
        }

        if (delta !== 0) {
          const container: HTMLElement = this.el.nativeElement;
          const canScroll = container.scrollHeight > container.clientHeight;

          if (canScroll) {
            container.scrollTop += delta;
          } else {
            // لو العنصر مش قابل للسكرول نتحكم في نافذة الـ document
            window.scrollBy({ top: delta, behavior: 'auto' });
          }
        }

        this.rafId = requestAnimationFrame(loop);
      };

      this.rafId = requestAnimationFrame(loop);
    });
  }

  private stopRaf() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }
}
