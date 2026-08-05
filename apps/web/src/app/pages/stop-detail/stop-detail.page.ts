import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, DeliveryStop, StopStatus, User } from '../../core/api.service';
@Component({
  standalone: true, imports: [NgIf, NgFor, RouterLink],
  template: `
  <div class="min-h-screen" *ngIf="stop">
    <header class="bg-ink text-white">
      <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <a routerLink="/app/stops" class="text-sm text-white/70">← Paradas</a>
        <span class="font-display font-bold">{{ stop.code }}</span>
        <span class="text-sm text-white/70">{{ user?.role }}</span>
      </div>
    </header>
    <main class="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-[1fr_280px]">
      <section class="rounded-2xl border border-border bg-surface p-6">
        <span class="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase">{{ label(stop.status) }}</span>
        <h1 class="mt-4 font-display text-3xl font-bold">{{ stop.recipient }}</h1>
        <p class="mt-3 text-ink-muted">{{ stop.address }}</p>
        <p class="mt-4 text-sm" *ngIf="stop.notes"><span class="font-semibold">Notas:</span> {{ stop.notes }}</p>
        <p class="mt-6 text-sm text-ink-muted" *ngIf="stop.courier">Mensajero: {{ stop.courier?.name }}</p>
        <p class="text-sm text-ink-muted" *ngIf="stop.dispatcher">Ops: {{ stop.dispatcher?.name }}</p>
      </section>
      <aside class="rounded-2xl border border-border bg-surface p-5">
        <p class="text-xs font-bold tracking-wide text-ink-muted">CAMBIAR ESTADO</p>
        <div class="mt-3 flex flex-col gap-2">
          <button *ngFor="let st of allowed" type="button" (click)="setStatus(st)"
            class="rounded-xl px-3 py-2.5 text-left text-sm font-semibold"
            [class.bg-ink]="stop.status===st" [class.text-white]="stop.status===st"
            [class.bg-bg]="stop.status!==st">{{ label(st) }}</button>
        </div>
        <p *ngIf="msg" class="mt-3 text-sm text-green-800">{{ msg }}</p>
        <p *ngIf="error" class="mt-3 text-sm text-red-700">{{ error }}</p>
      </aside>
    </main>
  </div>
  `,
})
export class StopDetailPage implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  stop: DeliveryStop | null = null; user: User | null = null; msg = ''; error = '';
  allowed: StopStatus[] = [];
  ngOnInit() {
    this.user = this.api.getUser();
    if (!this.api.getToken()) { this.router.navigate(['/login']); return; }
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getStop(id).subscribe({
      next: (s) => {
        this.stop = s;
        this.allowed = this.user?.role === 'COURIER'
          ? ['IN_TRANSIT', 'DELIVERED', 'FAILED']
          : ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];
      },
      error: () => this.router.navigate(['/app/stops']),
    });
  }
  label(s: string) {
    return ({ PENDING: 'Pendiente', ASSIGNED: 'Asignada', IN_TRANSIT: 'En ruta', DELIVERED: 'Entregada', FAILED: 'Fallida' } as Record<string,string>)[s] ?? s;
  }
  setStatus(status: StopStatus) {
    if (!this.stop) return;
    this.api.updateStatus(this.stop.id, status).subscribe({
      next: (s) => { this.stop = s; this.msg = 'Estado actualizado'; this.error = ''; },
      error: () => { this.error = 'No se pudo actualizar'; this.msg = ''; },
    });
  }
}
