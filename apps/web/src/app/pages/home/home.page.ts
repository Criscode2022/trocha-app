import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true, imports: [RouterLink],
  template: `
  <header class="absolute inset-x-0 top-0 z-10">
    <div class="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
      <a routerLink="/" class="font-display text-2xl font-bold tracking-tight text-white">TROCHA</a>
      <a routerLink="/login" class="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-ink hover:bg-primary/90">Abrir consola</a>
    </div>
  </header>
  <section class="relative min-h-[88vh] overflow-hidden bg-ink">
    <img src="assets/hero.jpg" alt="Mensajero en bicicleta de carga al amanecer" class="absolute inset-0 h-full w-full object-cover opacity-50" />
    <div class="relative mx-auto flex min-h-[88vh] max-w-4xl flex-col items-start justify-center px-4 py-24 sm:px-6">
      <p class="text-xs font-bold tracking-[0.2em] text-primary">ÚLTIMA MILLA · MICROFLOTA</p>
      <h1 class="mt-5 font-display text-5xl font-bold leading-[0.95] text-white md:text-7xl">La ruta clara.<br />El reparto, en trocha.</h1>
      <p class="mt-6 max-w-xl text-lg text-white/80">Consola para despacho y mensajeros independientes. Asigna paradas, sigue el estado y deja el WhatsApp solo para imprevistos.</p>
      <div class="mt-10 flex flex-wrap gap-3">
        <a routerLink="/login" class="rounded-none bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-ink">Entrar como ops</a>
        <a href="#como" class="rounded-none border border-white/50 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white">Cómo funciona</a>
      </div>
    </div>
  </section>
  <section id="como" class="border-y border-border bg-bg">
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
