import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
const API = 'http://localhost:3005/api';
const KEY = 'trocha_token';
const USER = 'trocha_user';
export type Role = 'DISPATCHER' | 'COURIER';
export type StopStatus = 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
export interface User { id: string; email: string; name: string; role: Role; }
export interface DeliveryStop {
  id: string; code: string; address: string; recipient: string; notes: string; status: StopStatus;
  dispatcher?: { name: string; email: string }; courier?: { name: string; email: string } | null;
  createdAt: string; updatedAt: string;
}
export interface DayStats {
  date: string;
  total: number;
  open: number;
  delivered: number;
  failed: number;
  byStatus: Record<StopStatus, number>;
  researchBenchmarks: {
    courierStopsPerShift: { min: number; max: number };
    fleetStopsPerDay: { min: number; max: number };
    note: string;
  };
}
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  getToken() { return localStorage.getItem(KEY); }
  getUser(): User | null {
    const r = localStorage.getItem(USER);
    return r ? JSON.parse(r) : null;
  }
  logout() { localStorage.removeItem(KEY); localStorage.removeItem(USER); }
  private auth() {
    const t = this.getToken();
    return t ? { headers: new HttpHeaders({ Authorization: `Bearer ${t}` }) } : {};
  }
  login(email: string, password: string) {
    return this.http.post<{ accessToken: string; user: User }>(`${API}/auth/login`, { email, password }).pipe(
      tap((r) => {
        localStorage.setItem(KEY, r.accessToken);
        localStorage.setItem(USER, JSON.stringify(r.user));
      }),
    );
  }
  listStops(): Observable<DeliveryStop[]> { return this.http.get<DeliveryStop[]>(`${API}/stops`, this.auth()); }
  dayStats(): Observable<DayStats> { return this.http.get<DayStats>(`${API}/stops/stats/day`, this.auth()); }
  getStop(id: string): Observable<DeliveryStop> { return this.http.get<DeliveryStop>(`${API}/stops/${id}`, this.auth()); }
  createStop(body: { address: string; recipient: string; notes?: string; courierEmail?: string }) {
    return this.http.post<DeliveryStop>(`${API}/stops`, body, this.auth());
  }
  updateStatus(id: string, status: StopStatus) {
    return this.http.patch<DeliveryStop>(`${API}/stops/${id}/status`, { status }, this.auth());
  }
}
