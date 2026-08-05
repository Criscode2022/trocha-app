import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, StopStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StopsService {
  constructor(private prisma: PrismaService) {}
  list(userId: string, role: Role) {
    const where = role === 'DISPATCHER' ? { dispatcherId: userId } : { courierId: userId };
    return this.prisma.deliveryStop.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        dispatcher: { select: { id: true, name: true, email: true } },
        courier: { select: { id: true, name: true, email: true } },
      },
    });
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
