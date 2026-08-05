import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService, DeliveryStop, User } from '../../core/api.service';
@Component({
  standalone: true, imports: [NgFor, NgIf, DatePipe, RouterLink],
  template: `
  <div class="min-h-screen">
    <header class="bg-ink text-white">
      <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <a routerLink="/app/stops" class="font-display text-xl font-bold">TROCHA</a>
        <div class="flex items-center gap-4 text-sm">
          <span class="rounded-full bg-steel px-3 py-1 text-[11px] font-bold tracking-wide">{{ user?.role }}</span>
          <span class="text-white/70">{{ user?.name }}</span>
          <a *ngIf="user?.role==='DISPATCHER'" routerLink="/app/stops/new" class="rounded-full bg-primary px-4 py-2 font-semibold text-ink">+ Parada</a>
          <button type="button" class="text-white/60 hover:text-white" (click)="logout()">Salir</button>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-10">
      <p class="text-xs font-bold tracking-[0.12em] text-primary">{{ user?.role==='DISPATCHER' ? 'CONSOLA OPS' : 'MI RUTA' }}</p>
      <h1 class="mt-2 font-display text-3xl font-bold">{{ user?.role==='DISPATCHER' ? 'Paradas del día' : 'Mis entregas' }}</h1>
      <p *ngIf="error" class="mt-4 text-red-700">{{ error }}</p>
      <p *ngIf="!loading && !items.length" class="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-ink-muted">
        No hay paradas todavía.
        <a *ngIf="user?.role==='DISPATCHER'" routerLink="/app/stops/new" class="mt-2 block font-semibold text-ink">Crear la primera →</a>
      </p>
      <ul class="mt-8 space-y-3">
        <li *ngFor="let s of items">
          <a [routerLink]="['/app/stops', s.id]" class="block rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary/50">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p class="text-xs font-bold tracking-wide text-primary">{{ s.code }}</p>
                <h2 class="mt-1 text-lg font-semibold">{{ s.recipient }}</h2>
                <p class="mt-1 text-sm text-ink-muted">{{ s.address }}</p>
                <p class="mt-2 text-xs text-ink-muted">{{ s.updatedAt | date:'short' }}
                  <span *ngIf="user?.role==='DISPATCHER' && s.courier"> · {{ s.courier?.name }}</span>
                </p>
              </div>
              <span class="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase text-ink">{{ label(s.status) }}</span>
            </div>
          </a>
        </li>
      </ul>
    </main>
  </div>
  `,
})
export class StopsPage implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  items: DeliveryStop[] = []; user: User | null = null; loading = true; error = '';
  ngOnInit() {
    this.user = this.api.getUser();
    if (!this.api.getToken()) { this.router.navigate(['/login']); return; }
    this.api.listStops().subscribe({
      next: (c) => { this.items = c; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar las paradas.'; this.loading = false; },
    });
  }
  label(s: string) {
    return ({ PENDING: 'Pendiente', ASSIGNED: 'Asignada', IN_TRANSIT: 'En ruta', DELIVERED: 'Entregada', FAILED: 'Fallida' } as Record<string,string>)[s] ?? s;
  }
  logout() { this.api.logout(); this.router.navigate(['/login']); }
}
