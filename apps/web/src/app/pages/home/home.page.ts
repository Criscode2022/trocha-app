import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true, imports: [RouterLink],
  template: `
  <header class="border-b border-border bg-surface/95">
    <div class="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
      <a routerLink="/" class="font-display text-2xl font-bold tracking-tight text-ink">TROCHA</a>
      <div class="flex items-center gap-4">
        <a routerLink="/login" class="text-sm font-semibold text-ink-muted hover:text-ink">Entrar</a>
        <a routerLink="/login" class="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-steel">Abrir consola</a>
      </div>
    </div>
  </header>
  <section class="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 md:grid-cols-2">
    <div>
      <p class="text-xs font-bold tracking-[0.14em] text-primary">ÚLTIMA MILLA · MICROFLOTA</p>
      <h1 class="mt-4 font-display text-4xl font-bold leading-[1.08] md:text-5xl">La ruta clara. El reparto, en trocha.</h1>
      <p class="mt-5 text-lg leading-relaxed text-ink-muted">Consola para despacho y mensajeros independientes. Asigna paradas, sigue el estado y deja el WhatsApp solo para imprevistos.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a routerLink="/login" class="rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white">Entrar como ops</a>
        <a href="#como" class="rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold">Cómo funciona</a>
      </div>
      <dl class="mt-10 grid grid-cols-3 gap-3 text-sm">
        <div class="rounded-2xl border border-border bg-surface p-4"><dt class="text-[11px] font-bold text-ink-muted">ROLES</dt><dd class="mt-1 font-semibold">Ops · Mensajero</dd></div>
        <div class="rounded-2xl border border-border bg-surface p-4"><dt class="text-[11px] font-bold text-ink-muted">PARADAS</dt><dd class="mt-1 font-semibold">Estado vivo</dd></div>
        <div class="rounded-2xl border border-border bg-surface p-4"><dt class="text-[11px] font-bold text-ink-muted">AUTH</dt><dd class="mt-1 font-semibold">JWT</dd></div>
      </dl>
    </div>
    <div class="overflow-hidden rounded-[20px] border border-border shadow-lg">
      <img src="assets/hero.jpg" alt="Mensajero en bicicleta de carga al amanecer" class="aspect-[4/3] w-full object-cover" />
    </div>
  </section>
  <section id="como" class="border-y border-border bg-primary-soft/40">
    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 class="font-display text-3xl font-bold">Cómo funciona</h2>
      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <article class="rounded-2xl border border-border bg-surface p-6"><p class="text-xs font-bold text-primary">01</p><h3 class="mt-2 font-semibold">Ops crea la parada</h3><p class="mt-2 text-sm text-ink-muted">Dirección, destinatario y notas. Opcional: asigna mensajero.</p></article>
        <article class="rounded-2xl border border-border bg-surface p-6"><p class="text-xs font-bold text-primary">02</p><h3 class="mt-2 font-semibold">Mensajero actualiza</h3><p class="mt-2 text-sm text-ink-muted">EN RUTA · ENTREGADO · FALLIDO desde el móvil.</p></article>
        <article class="rounded-2xl border border-border bg-surface p-6"><p class="text-xs font-bold text-primary">03</p><h3 class="mt-2 font-semibold">Ops ve la flota</h3><p class="mt-2 text-sm text-ink-muted">Lista filtrable. Menos llamadas. Más control.</p></article>
      </div>
    </div>
  </section>
  <footer class="bg-ink text-white"><div class="mx-auto max-w-6xl px-4 py-10 sm:px-6"><p class="font-display text-xl font-bold">TROCHA</p><p class="mt-2 text-sm text-white/60">Última milla para microflotas. Demo: ops&#64;trocha.log / ruta&#64;trocha.log · password123</p></div></footer>
  `,
})
export class HomePage {}
