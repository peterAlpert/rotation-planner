import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';
import { AnnualReportDto, ReportService } from '../../report.service';

@Component({
  selector: 'app-yearly-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './yearly-report.component.html',
  styleUrls: ['./yearly-report.component.css']
})
export class YearlyReportComponent implements OnInit {
  year = new Date().getFullYear();
  loading = signal(false);
  data = signal<AnnualReportDto[]>([]);
  errorMsg = signal<string | null>(null);

  // إجمالي السطور (صف المجموع)
  totals = computed(() => {
    const rows = this.data();
    const sum = (fn: (r: AnnualReportDto) => number) => rows.reduce((a, r) => a + fn(r), 0);
    return {
      morning: sum(r => r.morningCount),
      stadium: sum(r => r.stadiumCount),
      garden: sum(r => r.gardenCount),
      lake: sum(r => r.lakeCount),
      all: sum(r => r.morningCount + r.stadiumCount + r.gardenCount + r.lakeCount)
    };
  });

  constructor(private report: ReportService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMsg.set(null);
    this.report.getAnnualReport(this.year).subscribe({
      next: res => {
        // ترتيب: المشرفين ثم الكنترول (اختياري)
        const sorted = [...res].sort((a, b) => a.role.localeCompare(b.role, 'ar'));
        this.data.set(sorted);
        this.loading.set(false);
      },
      error: err => {
        this.errorMsg.set('حصل خطأ في تحميل التقرير.');
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  exportToExcel(): void {
    // نحول الداتا لصيغة عربية جميلة
    const rows = this.data().map(r => ({
      'الاسم': r.name,
      'الوظيفة': r.role,
      'صباحي': r.morningCount,
      'الملاعب': r.stadiumCount,
      'الجاردن': r.gardenCount,
      'البحيرة': r.lakeCount,
      'الإجمالي': r.morningCount + r.stadiumCount + r.gardenCount + r.lakeCount
    }));

    // نضيف صف إجمالي تحت
    rows.push({
      'الاسم': 'الإجمالي',
      'الوظيفة': '',
      'صباحي': this.totals().morning,
      'الملاعب': this.totals().stadium,
      'الجاردن': this.totals().garden,
      'البحيرة': this.totals().lake,
      'الإجمالي': this.totals().all
    } as any);

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `تقرير ${this.year}`);

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `تقرير_السنوي_${this.year}.xlsx`);
  }
}
