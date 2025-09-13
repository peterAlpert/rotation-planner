import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TableRow, TableCell, Paragraph, AlignmentType, Document, TextRun, WidthType, BorderStyle, Packer, Table } from 'docx';
import saveAs from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { cairoFont } from '../../../../public/assets/cairo';
import { Person } from '../../person';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

interface ShiftPeriod {
  supervisors: Person[];
  controllers: Person[];
}
interface Shift {
  sobhi: ShiftPeriod;
  between: ShiftPeriod;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private toastr: ToastrService) { }

  // القوائم الأساسية (نوع Person[])
  supervisors: Person[] = [
    { id: 1, name: "حسام حسن", role: "مشرف" },
    { id: 2, name: "شيرين اكرام", role: "مشرف" },
    { id: 3, name: "روماني مجدي", role: "مشرف" },
    { id: 4, name: "احمد جلال", role: "مشرف" }
  ];

  controllers: Person[] = [
    { id: 5, name: "بيتر كميل", role: "كنترول" },
    { id: 6, name: "محمد سيد", role: "كنترول" },
    { id: 7, name: "سيد حسن", role: "كنترول" },
    { id: 8, name: "مينا اشرف", role: "كنترول" },
    { id: 9, name: "مينا مخلص", role: "كنترول" },
    { id: 10, name: "محمود بهاء", role: "كنترول" },
    { id: 11, name: "بولا نبيل", role: "كنترول" },
    { id: 12, name: "بهاء عبدالمؤمن", role: "كنترول" },
    { id: 13, name: "ابانوب زكريا", role: "كنترول" },
    { id: 14, name: "محمود عطيه", role: "كنترول" },
    { id: 15, name: "محمد منصور", role: "كنترول" },
    { id: 16, name: "كيرلس صموئيل", role: "كنترول" },
    { id: 17, name: "كيرلس سامح", role: "كنترول" },
    { id: 18, name: "امير مجدي", role: "كنترول" },
    { id: 19, name: "جوزيف جمال", role: "كنترول" },
    { id: 20, name: "ابراهيم محمد", role: "كنترول" },
    { id: 21, name: "مدحت وصفي", role: "كنترول" },
    { id: 22, name: "يوسف ايمن", role: "كنترول" },
    { id: 23, name: "خالد خليفه", role: "كنترول" },
    { id: 24, name: "دعاء احمد", role: "كنترول" },
    { id: 25, name: "جالا جمال", role: "كنترول" },
    { id: 26, name: "اندرو عماد", role: "كنترول" },
    { id: 27, name: "مريم يني", role: "كنترول" },
    { id: 28, name: "مريان اميل", role: "كنترول" }
  ];

  // (لازلت محتفظ بمصفوفة الareas لأن فيها تصدير/تحميل/إكسل في كودك القديم)
  areas: {
    name: string;
    color: string;
    supervisors: Person[];
    controllers: Person[];
    image: string;
  }[] = [
      { name: "شيفت صباحي", color: "#6f42c1", supervisors: [], controllers: [], image: 'assets/1.jpg' },
      { name: "الملاعب", color: "#198754", supervisors: [], controllers: [], image: 'assets/2.jpg' },
      { name: "الجاردن", color: "#dc3545", supervisors: [], controllers: [], image: 'assets/2.jpg' },
      { name: "البحيرة", color: "#fd7e14", supervisors: [], controllers: [], image: 'assets/4.jpg' }
    ];

<<<<<<< HEAD
  // الهيكل الجديد للشيفتات — كل مصفوفة واضحة النوع Person[]
  shifts: { shift1: Shift; shift2: Shift } = {
    shift1: {
      sobhi: { supervisors: [], controllers: [] },
      between: { supervisors: [], controllers: [] }
    },
    shift2: {
      sobhi: { supervisors: [], controllers: [] },
      between: { supervisors: [], controllers: [] }
    }
  };

=======
>>>>>>> d983b1010e9864a691292e06cbf23b05a9759425
  connectedSupervisorLists: string[] = [];
  connectedControllerLists: string[] = [];

  ngOnInit() {
    this.connectedSupervisorLists = [
      'supervisors',
      'shift1-sobhi-sup', 'shift1-between-sup',
      'shift2-sobhi-sup', 'shift2-between-sup'
    ];
    this.connectedControllerLists = [
      'controllers',
      'shift1-sobhi-ctrl', 'shift1-between-ctrl',
      'shift2-sobhi-ctrl', 'shift2-between-ctrl'
    ];
  }

  // مُعامل الـ drop مضبوط على Person[]
  drop(event: CdkDragDrop<Person[]>) {
<<<<<<< HEAD
    // تأكيد النوع: item من نوع Person
    const draggedItem: Person = event.previousContainer.data[event.previousIndex];

    // حماية: لو مفيش data
    if (!event.container || !event.container.data) return;

    // منع أكثر من مشرف داخل أي صندوق مشرف (id يحتوي 'sup')
    if (event.container.id.includes('sup') && draggedItem.role === 'مشرف' && event.container.data.length >= 1) {
      // ممكن تضيف toastr لو حابب تخبر المستخدم
      this.toastr.warning('لا يمكن إضافة أكثر من مشرف.', 'تنبيه');
      return;
    }

    // لو نفس القائمة — ترتيب داخلي
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
=======
    const draggedItem = event.previousContainer.data[event.previousIndex];

    // لو المكان اللي سيب فيه العنصر مش قائمة صالحة → رجّعه تاني
    if (!event.container.data || !event.container.id) {
      // نرجعه مكانه
      event.previousContainer.data.splice(event.previousIndex, 0, draggedItem);
      return;
    }

    // منع إضافة أكثر من مشرف لكل منطقة
    if (event.container.id.endsWith('-sup') && draggedItem.role === 'مشرف' && event.container.data.length >= 1) {
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // إزالة من باقي المناطق لو مشرف/كنترول
      if (draggedItem.role === 'مشرف') {
        this.areas.forEach(area => {
          if (area.supervisors !== event.container.data) {
            area.supervisors = area.supervisors.filter(sup => sup.id !== draggedItem.id);
          }
        });
      }
      if (draggedItem.role === 'كنترول') {
        this.areas.forEach(area => {
          if (area.controllers !== event.container.data) {
            area.controllers = area.controllers.filter(ctrl => ctrl.id !== draggedItem.id);
          }
        });
      }
>>>>>>> d983b1010e9864a691292e06cbf23b05a9759425
    }

    // نقل العنصر بين القوائم
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // بعد النقل: شيل العنصر من كل الأماكن التانية عشان مايتكررش
    this.removePersonFromEverywhere(draggedItem);
  }

  // يزيل الشخص المنقول من باقي القوائم (شيفتات، مناطق، القوائم الأساسية إذا لزم)
  private removePersonFromEverywhere(p: Person) {
    // من الشيفتات
    Object.keys(this.shifts).forEach(shiftKey => {
      const shift = (this.shifts as any)[shiftKey] as Shift;
      // لكل فترة (sobhi / between)
      (['sobhi', 'between'] as Array<keyof Shift>).forEach(periodKey => {
        const period = shift[periodKey];
        period.supervisors = period.supervisors.filter(s => s.id !== p.id);
        period.controllers = period.controllers.filter(c => c.id !== p.id);
      });
    });

    // من المناطق (areas) — لو مستخدم في أماكن تانية
    this.areas.forEach(area => {
      area.supervisors = area.supervisors.filter(s => s.id !== p.id);
      area.controllers = area.controllers.filter(c => c.id !== p.id);
    });

<<<<<<< HEAD
    // من القوائم الأساسية (لو تم نقله هناك، نتركه فقط في المكان الحالي)
    // Reset القوائم الأساسية لتضمن عدم تكرار: نشيل الشخص لو موجود
    this.supervisors = this.supervisors.filter(s => s.id !== p.id);
    this.controllers = this.controllers.filter(c => c.id !== p.id);

    // بعد الحذف اعادة وضع العنصر في القوائم الأساسية غير مطلوبة هنا
    // لأن النقل تم transferArrayItem سابقاً — العنصر موجود في القائمة الهدف بالفعل
  }

  // ---------- باقي الدوال القديمة (export / save / load) بدون تغيير جوهري ----------
=======
>>>>>>> d983b1010e9864a691292e06cbf23b05a9759425
  exportToPDF() {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    // تحميل الخط
    doc.addFileToVFS("Cairo-Regular.ttf", cairoFont);
    doc.addFont("Cairo-Regular.ttf", "Cairo", "normal");
    doc.setFont("Cairo");

    doc.text("تجربة تصدير PDF بخط Cairo", 400, 40, { align: "right" });

    const data = this.areas.map(area => [
      area.name,
      area.supervisors.length ? area.supervisors[0].name : 'بدون مشرف',
      area.controllers.map(c => c.name).join(', ')
    ]);

    autoTable(doc, {
      head: [['المنطقة', 'المشرف', 'الكنترولات']],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [255, 193, 7] },
      styles: { font: "Cairo", fontSize: 12, halign: "right" },
      columnStyles: {
        0: { halign: 'right' },
        1: { halign: 'right' },
        2: { halign: 'right' }
      }
    });

    doc.save('توزيع_المشرفين_والكنترول.pdf');
  }

  saveDistribution() {
    localStorage.setItem('areasDistribution', JSON.stringify(this.areas));
    this.toastr.success('تم حفظ التوزيع بنجاح!', '💾 حفظ');
  }

  loadDistribution() {
    const saved = localStorage.getItem('areasDistribution');
    if (saved) {
      this.areas = JSON.parse(saved);
      this.resetLists();
      this.removeAssignedFromLists();
      this.connectedSupervisorLists = ['supervisors', ...this.areas.map(a => a.name + '-sup')];
      this.connectedControllerLists = ['controllers', ...this.areas.map(a => a.name + '-ctrl')];
      this.toastr.info('تم تحميل التوزيع بنجاح!', '📂 تحميل');
    } else {
      this.toastr.warning('لا يوجد توزيع محفوظ.', '⚠️ تحذير');
    }
  }

  resetDistribution() {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم مسح كل التوزيعات وإعادتها للوضع الافتراضي!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، إعادة!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetLists();
        this.areas.forEach(area => {
          area.supervisors = [];
          area.controllers = [];
        });
        this.connectedSupervisorLists = ['supervisors', ...this.areas.map(a => a.name + '-sup')];
        this.connectedControllerLists = ['controllers', ...this.areas.map(a => a.name + '-ctrl')];
        localStorage.removeItem('areasDistribution');
        this.toastr.error('تم إعادة التوزيع بالكامل!', '♻️ إعادة');
      }
    });
  }

  resetLists() {
    this.supervisors = [
      { id: 1, name: "حسام حسن", role: "مشرف" },
      { id: 2, name: "شيرين اكرام", role: "مشرف" },
      { id: 3, name: "روماني مجدي", role: "مشرف" },
      { id: 4, name: "احمد جلال", role: "مشرف" }
    ];

    this.controllers = [
      { id: 5, name: "بيتر كميل", role: "كنترول" },
      { id: 6, name: "محمد سيد", role: "كنترول" },
      { id: 7, name: "سيد حسن", role: "كنترول" },
      { id: 8, name: "مينا اشرف", role: "كنترول" },
      { id: 9, name: "مينا مخلص", role: "كنترول" },
      { id: 10, name: "محمود بهاء", role: "كنترول" },
      { id: 11, name: "بولا نبيل", role: "كنترول" },
      { id: 12, name: "بهاء عبدالمؤمن", role: "كنترول" },
      { id: 13, name: "ابانوب زكريا", role: "كنترول" },
      { id: 14, name: "محمود عطيه", role: "كنترول" },
      { id: 15, name: "محمد منصور", role: "كنترول" },
      { id: 16, name: "كيرلس صموئيل", role: "كنترول" },
      { id: 17, name: "كيرلس سامح", role: "كنترول" },
      { id: 18, name: "امير مجدي", role: "كنترول" },
      { id: 19, name: "جوزيف جمال", role: "كنترول" },
      { id: 20, name: "ابراهيم محمد", role: "كنترول" },
      { id: 21, name: "مدحت وصفي", role: "كنترول" },
      { id: 22, name: "يوسف ايمن", role: "كنترول" },
      { id: 23, name: "خالد خليفه", role: "كنترول" },
      { id: 24, name: "دعاء احمد", role: "كنترول" },
      { id: 25, name: "جالا جمال", role: "كنترول" },
      { id: 26, name: "اندرو عماد", role: "كنترول" },
      { id: 27, name: "مريم يني", role: "كنترول" },
      { id: 28, name: "مريان اميل", role: "كنترول" }
    ];
  }

  removeAssignedFromLists() {
    const assignedSupervisors = this.areas.flatMap(a => a.supervisors.map(s => s.id));
    const assignedControllers = this.areas.flatMap(a => a.controllers.map(c => c.id));

    this.supervisors = this.supervisors.filter(s => !assignedSupervisors.includes(s.id));
    this.controllers = this.controllers.filter(c => !assignedControllers.includes(c.id));
  }

  exportToWord() {
    const sections = this.areas.flatMap(item => {
      const rows: TableRow[] = [];

      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: item.supervisors.length ? item.supervisors.map(s => s.name).join(', ') : "بدون مشرف",
                  alignment: AlignmentType.CENTER,
                  bidirectional: true,
                }),
              ],
            }),
          ],
        })
      );

      if (item.controllers.length) {
        item.controllers.forEach(ctrl => {
          rows.push(
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      text: ctrl.name,
                      alignment: AlignmentType.CENTER,
                      bidirectional: true,
                    }),
                  ],
                }),
              ],
            })
          );
        });
      } else {
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: "كنترول",
                    alignment: AlignmentType.CENTER,
                    bidirectional: true,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: "بدون كنترول",
                    alignment: AlignmentType.CENTER,
                    bidirectional: true,
                  }),
                ],
              }),
            ],
          })
        );
      }

      const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        alignment: AlignmentType.CENTER,
        rows,
        borders: {
          top: { style: BorderStyle.SINGLE, size: 5, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 5, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 5, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 5, color: "000000" },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 3, color: "000000" },
          insideVertical: { style: BorderStyle.SINGLE, size: 3, color: "000000" },
        } as any
      });

      return [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          bidirectional: true,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: item.name, bold: true, size: 32 }),
          ],
        }),
        table,
        new Paragraph({ text: "", spacing: { after: 400 } }),
      ];
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              bidirectional: true,
              spacing: { after: 500 },
              children: [
                new TextRun({
                  text: "توزيعة شغل وادي دجلة",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            ...sections,
          ],
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "rotation.docx");
    });
  }
}
