import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../../core/api.service';
@Component({
  standalone: true, imports: [ReactiveFormsModule, NgIf, RouterLink],
  template: `
  <div class="min-h-screen">
    <header class="bg-ink text-white">
      <div class="mx-auto flex h-16 max-w-xl items-center justify-between px-4">
        <a routerLink="/app/stops" class="text-sm text-white/70">← Paradas</a>
        <span class="font-display font-bold">Nueva parada</span>
        <span></span>
      </div>
    </header>
    <main class="mx-auto max-w-xl px-4 py-10">
      <form class="space-y-4 rounded-2xl border border-border bg-surface p-6" [formGroup]="form" (ngSubmit)="submit()">
        <div>
          <label class="mb-1 block text-sm font-semibold">Destinatario</label>
          <input formControlName="recipient" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold">Dirección</label>
          <input formControlName="address" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold">Notas</label>
          <textarea formControlName="notes" rows="3" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm"></textarea>
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold">Email mensajero (opcional)</label>
          <input formControlName="courierEmail" class="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm" placeholder="ruta@trocha.log" />
        </div>
        <p *ngIf="error" class="text-sm text-red-700">{{ error }}</p>
        <button type="submit" [disabled]="form.invalid || loading" class="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white disabled:opacity-50">Crear parada</button>
      </form>
    </main>
  </div>
  `,
})
export class StopNewPage {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  loading = false; error = '';
  form = this.fb.nonNullable.group({
    recipient: ['', [Validators.required, Validators.minLength(2)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    notes: [''],
    courierEmail: [''],
  });
  submit() {
    this.loading = true; this.error = '';
    const v = this.form.getRawValue();
    this.api.createStop({
      recipient: v.recipient,
      address: v.address,
      notes: v.notes || undefined,
      courierEmail: v.courierEmail || undefined,
    }).subscribe({
      next: (s) => { this.loading = false; this.router.navigate(['/app/stops', s.id]); },
      error: () => { this.loading = false; this.error = 'No se pudo crear (¿email mensajero válido?)'; },
    });
  }
}
