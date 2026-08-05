import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
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
    data: [
      { code: 'TR-0805-01', address: 'C/ Industria 12, 3ºB · 08025 Barcelona', recipient: 'Laura Vidal', notes: 'Timbre 3B · paquete frágil', status: 'ASSIGNED', dispatcherId: disp.id, courierId: cour.id },
      { code: 'TR-0805-02', address: 'Av. Parallel 88 · 08015 Barcelona', recipient: 'Botiga Nord', notes: 'Recoger firma', status: 'IN_TRANSIT', dispatcherId: disp.id, courierId: cour.id },
      { code: 'TR-0805-03', address: 'Passeig Gràcia 41 · 08007 Barcelona', recipient: 'Oficina Malla', notes: '', status: 'PENDING', dispatcherId: disp.id, courierId: null },
      { code: 'TR-0805-04', address: 'C/ Provença 201 · 08036 Barcelona', recipient: 'Marc Rius', notes: 'Dejar en conserjería', status: 'DELIVERED', dispatcherId: disp.id, courierId: cour.id },
    ],
  });
  console.log('TROCHA seed OK');
}
main().finally(() => prisma.$disconnect());
