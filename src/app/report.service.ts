import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnnualReportDto {
  name: string;
  role: string; // "مشرف" | "كنترول"
  morningCount: number;
  stadiumCount: number;
  gardenCount: number;
  lakeCount: number;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly baseUrl = 'https://localhost:7053/api'; // عدّلها لو عنوانك مختلف

  constructor(private http: HttpClient) { }

  getAnnualReport(year: number): Observable<AnnualReportDto[]> {
    return this.http.get<AnnualReportDto[]>(`${this.baseUrl}/Report/annual/${year}`);
    // أو لو endpointك: /api/report/annual?year=2025
    // return this.http.get<AnnualReportDto[]>(`${this.baseUrl}/report/annual`, { params: { year }});
  }
}
