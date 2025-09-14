import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { TableRow, TableCell, Paragraph, AlignmentType, Document, TextRun, WidthType, BorderStyle, Packer, Table } from 'docx';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Person } from '../../person';
import { CommonModule } from '@angular/common';
import { Area } from '../../Models/area';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private toastr: ToastrService) { }
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
    { id: 28, name: "مريان اميل", role: "كنترول" },
    { id: 28, name: "رنا خالد", role: "كنترول" }

  ];

  areas: Area[] = [
    {
      name: "شيفت صباحي",
      color: "#6f42c1",
      supervisors: [],
      controllers: [],
      shifts: [
        { name: "شفت 1 - من يوم 16 الي 31", sabahy: [], between: [] },
        { name: "شفت 2 - من يوم 1 الي 15", sabahy: [], between: [] }
      ]
    },
    {
      name: "الملاعب",
      color: "#198754",
      supervisors: [],
      controllers: [],
      shifts: [],
      image: 'assets/2.jpg'
    },
    {
      name: "الجاردن",
      color: "#dc3545",
      supervisors: [],
      controllers: [],
      shifts: [],
      image: 'assets/3.jpg'
    },
    {
      name: "البحيرة",
      color: "#fd7e14",
      supervisors: [],
      controllers: [],
      shifts: [],
      image: 'assets/4.jpg'
    }
  ];

  // القوائم المتصلة
  connectedSupervisorLists: string[] = [];
  connectedControllerLists: string[] = [];



  ngOnInit() {
    this.connectedSupervisorLists = this.areas.map(a => a.name + '-sup');
    this.connectedControllerLists = [
      ...this.areas.map(a => a.name + '-ctrl'),
      ...this.areas.flatMap(a =>
        a.shifts.flatMap(s => [
          s.name + '-sabahy',
          s.name + '-between'
        ])
      )
    ];
  }


  drop(event: CdkDragDrop<Person[]>) {
    const draggedItem = event.previousContainer.data[event.previousIndex];

    // لو المكان اللي سيب فيه العنصر مش قائمة صالحة → رجّعه تاني
    if (!event.container.data || !event.container.id) {
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
      // 🟢 لو العنصر كنترول وجاي من "شيفت صباحي" → انسخ بدل النقل
      if (
        draggedItem.role === 'كنترول' &&
        event.previousContainer.id.includes('sabahy')
      ) {
        if (!event.container.data.some(c => c.id === draggedItem.id)) {
          event.container.data.push({ ...draggedItem });
        }
      } else {
        // غير كده (مشرف أو كنترول من مناطق تانية) → قص ولصق
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );

        // 🔴 تأكد إن المشرف/الكنترول مش مكرر في باقي المناطق
        if (draggedItem.role === 'مشرف') {
          this.areas.forEach(area => {
            if (area.supervisors !== event.container.data) {
              area.supervisors = area.supervisors.filter(sup => sup.id !== draggedItem.id);
            }
          });
        }
        if (draggedItem.role === 'كنترول' && !event.previousContainer.id.includes('sabahy')) {
          this.areas.forEach(area => {
            if (area.controllers !== event.container.data) {
              area.controllers = area.controllers.filter(ctrl => ctrl.id !== draggedItem.id);
            }
          });
        }
      }
    }
  }

  // حفظ التوزيع في Local Storage

  saveDistribution() {
    localStorage.setItem('areasDistribution', JSON.stringify(this.areas));
    this.toastr.success('تم حفظ التوزيع بنجاح!', '💾 حفظ');
  }

  // تحميل التوزيع من Local Storage
  loadDistribution() {
    const saved = localStorage.getItem('areasDistribution');
    if (saved) {
      this.areas = JSON.parse(saved);

      // رجع القوائم الأصلية
      this.resetLists();

      // شيل أي مشرف/كنترول متوزع من القوائم الأصلية
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
        // رجع القوائم الأصلية
        this.resetLists();

        // فضي المناطق
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


  // دالة تساعدك ترجّع القوائم الأصلية
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
      { id: 28, name: "مريان اميل", role: "كنترول" },
      { id: 28, name: "رنا خالد", role: "كنترول" }
    ];
  }

  // دالة تشيل اللي متوزعين من القوائم
  removeAssignedFromLists() {
    const assignedSupervisors = this.areas.flatMap(a => a.supervisors.map(s => s.id));
    const assignedControllers = this.areas.flatMap(a => a.controllers.map(c => c.id));

    this.supervisors = this.supervisors.filter(s => !assignedSupervisors.includes(s.id));
    this.controllers = this.controllers.filter(c => !assignedControllers.includes(c.id));
  }

  removePerson(person: Person, area: Area, type: 'supervisor' | 'controller') {
    if (type === 'supervisor') {
      // رجع المشرف للقائمة الأصلية
      this.supervisors.push(person);
      // امسحه من المنطقة
      area.supervisors = area.supervisors.filter(s => s.id !== person.id);
    } else {
      // رجع الكنترول للقائمة الأصلية
      this.controllers.push(person);
      // امسحه من المنطقة
      area.controllers = area.controllers.filter(c => c.id !== person.id);

      // كمان لو الكنترول متوزع في أي شيفت جوه المنطقة → شيله
      area.shifts.forEach(shift => {
        shift.sabahy = shift.sabahy.filter(c => c.id !== person.id);
        shift.between = shift.between.filter(c => c.id !== person.id);
      });
    }
  }


  exportToWord() {
    const sections = this.areas.flatMap(item => {
      const rows: TableRow[] = [];

      // صف المشرف
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: item.supervisors.length
                    ? item.supervisors.map(s => s.name).join(', ')
                    : "بدون مشرف",
                  alignment: AlignmentType.CENTER,
                  bidirectional: true,
                }),
              ],
            }),
          ],
        })
      );

      // صفوف الكنترول
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

      // الجدول
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
        } as any // 🔑 ساعات لازم تتحط cast لو النسخة قديمة
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
        new Paragraph({ text: "", spacing: { after: 400 } }), // فاصل بعد كل جدول
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
