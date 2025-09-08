import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AreasService {
  private apiUrl = 'https://localhost:7053/api';

  constructor(private http: HttpClient) { }

  getDistribution(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Distribution`);
  }

  saveDistribution(areas: any[]): Observable<any> {
    return this.http.post(this.apiUrl, areas);
  }

  resetDistribution(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }
}
