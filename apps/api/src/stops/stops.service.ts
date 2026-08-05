import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, StopStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const STATUS_ORDER: StopStatus[] = ['IN_TRANSIT', 'ASSIGNED', 'PENDING', 'FAILED', 'DELIVERED'];

@Injectable()
export class StopsService {
  constructor(private prisma: PrismaService) {}

  private scopeWhere(userId: string, role: Role) {
    return role === 'DISPATCHER' ? { dispatcherId: userId } : { courierId: userId };
  }

  private dayBounds(d = new Date()) {
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  async list(userId: string, role: Role) {
    const rows = await this.prisma.deliveryStop.findMany({
      where: this.scopeWhere(userId, role),
      orderBy: { updatedAt: 'desc' },
      include: {
        dispatcher: { select: { id: true, name: true, email: true } },
        courier: { select: { id: true, name: true, email: true } },
      },
    });
    return rows.sort(
      (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || +new Date(b.updatedAt) - +new Date(a.updatedAt),
    );
  }

  /** Volumen del día calendario (ops: flota; courier: solo suyas). */
  async dayStats(userId: string, role: Role) {
    const { start, end } = this.dayBounds();
    const where = {
      ...this.scopeWhere(userId, role),
      createdAt: { gte: start, lte: end },
    };
    const rows = await this.prisma.deliveryStop.findMany({ where, select: { status: true } });
    const byStatus: Record<StopStatus, number> = {
      PENDING: 0,
      ASSIGNED: 0,
      IN_TRANSIT: 0,
      DELIVERED: 0,
      FAILED: 0,
    };
    for (const r of rows) byStatus[r.status] += 1;
    const total = rows.length;
    const delivered = byStatus.DELIVERED;
    const open = total - delivered - byStatus.FAILED;
    return {
      date: start.toISOString().slice(0, 10),
      total,
      open,
      delivered,
      failed: byStatus.FAILED,
      byStatus,
      /** Benchmark research: courier ~10–20; flota micro ~20–60 (ver docs/02). */
      researchBenchmarks: {
        courierStopsPerShift: { min: 10, max: 20 },
        fleetStopsPerDay: { min: 20, max: 60 },
        note: 'Secundario + supuestos de diseño; no telemetría de cliente real',
      },
    };
  }
  async get(id: string, userId: string, role: Role) {
    const s = await this.prisma.deliveryStop.findUnique({
      where: { id },
      include: {
        dispatcher: { select: { id: true, name: true, email: true } },
        courier: { select: { id: true, name: true, email: true } },
      },
    });
    if (!s) throw new NotFoundException();
    if (role === 'DISPATCHER' && s.dispatcherId !== userId) throw new ForbiddenException();
    if (role === 'COURIER' && s.courierId !== userId) throw new ForbiddenException();
    return s;
  }
  async create(dispatcherId: string, data: { address: string; recipient: string; notes?: string; courierEmail?: string }) {
    let courierId: string | null = null;
    let status: StopStatus = 'PENDING';
    if (data.courierEmail) {
      const c = await this.prisma.user.findUnique({ where: { email: data.courierEmail } });
      if (!c || c.role !== 'COURIER') throw new NotFoundException('Mensajero no encontrado');
      courierId = c.id;
      status = 'ASSIGNED';
    }
    const code = 'TR-' + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0') + '-' + String(Math.floor(Math.random() * 900) + 100);
    return this.prisma.deliveryStop.create({
      data: {
        code,
        address: data.address,
        recipient: data.recipient,
        notes: data.notes || '',
        dispatcherId,
        courierId,
        status,
      },
    });
  }
  async updateStatus(id: string, userId: string, role: Role, status: StopStatus) {
    const s = await this.prisma.deliveryStop.findUnique({ where: { id } });
    if (!s) throw new NotFoundException();
    if (role === 'DISPATCHER' && s.dispatcherId !== userId) throw new ForbiddenException();
    if (role === 'COURIER' && s.courierId !== userId) throw new ForbiddenException();
    if (role === 'COURIER' && !['IN_TRANSIT', 'DELIVERED', 'FAILED'].includes(status)) throw new ForbiddenException('Estado no permitido');
    return this.prisma.deliveryStop.update({ where: { id }, data: { status } });
  }
}
