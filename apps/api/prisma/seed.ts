import { PrismaClient, StopStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

/** Volumen demo del día alineado a research (courier ~10–20; flota micro 20–60). */
const STOPS: { code: string; address: string; recipient: string; notes: string; status: StopStatus; withCourier: boolean }[] = [
  { code: 'TR-0805-01', address: 'C/ Industria 12, 3ºB · 08025 Barcelona', recipient: 'Laura Vidal', notes: 'Timbre 3B · frágil', status: 'ASSIGNED', withCourier: true },
  { code: 'TR-0805-02', address: 'Av. Parallel 88 · 08015 Barcelona', recipient: 'Botiga Nord', notes: 'Recoger firma', status: 'IN_TRANSIT', withCourier: true },
  { code: 'TR-0805-03', address: 'Passeig Gràcia 41 · 08007 Barcelona', recipient: 'Oficina Malla', notes: '', status: 'PENDING', withCourier: false },
  { code: 'TR-0805-04', address: 'C/ Provença 201 · 08036 Barcelona', recipient: 'Marc Rius', notes: 'Conserjería', status: 'DELIVERED', withCourier: true },
  { code: 'TR-0805-05', address: 'C/ Mallorca 312 · 08037 Barcelona', recipient: 'Clínica Serra', notes: 'Recepción 1ª planta', status: 'ASSIGNED', withCourier: true },
  { code: 'TR-0805-06', address: 'Rambla Catalunya 55 · 08007 Barcelona', recipient: 'Café Lumen', notes: 'Antes de 12:00', status: 'IN_TRANSIT', withCourier: true },
  { code: 'TR-0805-07', address: 'C/ Aragó 180 · 08011 Barcelona', recipient: 'Taller Volt', notes: 'Taller fondo patio', status: 'PENDING', withCourier: false },
  { code: 'TR-0805-08', address: 'C/ Consell de Cent 290 · 08007 Barcelona', recipient: 'Ana Puig', notes: '', status: 'DELIVERED', withCourier: true },
  { code: 'TR-0805-09', address: 'C/ Diputació 220 · 08007 Barcelona', recipient: 'Estudio Kite', notes: 'Portero automático', status: 'FAILED', withCourier: true },
  { code: 'TR-0805-10', address: 'C/ València 175 · 08011 Barcelona', recipient: 'Farmacia Sol', notes: 'Frío · no dejar fuera', status: 'ASSIGNED', withCourier: true },
  { code: 'TR-0805-11', address: 'C/ Girona 88 · 08009 Barcelona', recipient: 'Paula Neri', notes: '4º 2ª', status: 'PENDING', withCourier: false },
  { code: 'TR-0805-12', address: 'C/ Bruc 50 · 08010 Barcelona', recipient: 'Librería Atlas', notes: 'Bulto libro', status: 'DELIVERED', withCourier: true },
  { code: 'TR-0805-13', address: 'C/ Casp 33 · 08010 Barcelona', recipient: 'Hotel Minor', notes: 'Conserjería 24h', status: 'IN_TRANSIT', withCourier: true },
  { code: 'TR-0805-14', address: 'C/ Ausiàs March 12 · 08010 Barcelona', recipient: 'Jordi Camps', notes: 'No contesta por la mañana', status: 'ASSIGNED', withCourier: true },
];

async function main() {
  await prisma.deliveryStop.deleteMany();
  await prisma.user.deleteMany();
  const hash = await bcrypt.hash('password123', 10);
  const disp = await prisma.user.create({
    data: { email: 'ops@trocha.log', passwordHash: hash, name: 'Nora Aguilar', role: 'DISPATCHER' },
  });
  const cour = await prisma.user.create({
    data: { email: 'ruta@trocha.log', passwordHash: hash, name: 'Hugo Serra', role: 'COURIER' },
  });
  await prisma.deliveryStop.createMany({
    data: STOPS.map((s) => ({
      code: s.code,
      address: s.address,
      recipient: s.recipient,
      notes: s.notes,
      status: s.status,
      dispatcherId: disp.id,
      courierId: s.withCourier ? cour.id : null,
    })),
  });
  console.log(`TROCHA seed OK · ${STOPS.length} paradas del día (research volume demo)`);
}
main().finally(() => prisma.$disconnect());
