import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { StopStatus } from '@prisma/client';
import { StopsService } from './stops.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateStopDto {
  @IsString() @MinLength(5) address!: string;
  @IsString() @MinLength(2) recipient!: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsEmail() courierEmail?: string;
}
class StatusDto { @IsEnum(StopStatus) status!: StopStatus; }

@Controller('stops')
@UseGuards(JwtAuthGuard)
export class StopsController {
  constructor(private stops: StopsService) {}
  @Get()
  list(@Req() req: { user: { userId: string; role: 'DISPATCHER' | 'COURIER' } }) {
    return this.stops.list(req.user.userId, req.user.role);
  }
  /** Debe ir antes de :id para no capturar "stats". */
  @Get('stats/day')
  dayStats(@Req() req: { user: { userId: string; role: 'DISPATCHER' | 'COURIER' } }) {
    return this.stops.dayStats(req.user.userId, req.user.role);
  }
  @Get(':id')
  get(@Param('id') id: string, @Req() req: { user: { userId: string; role: 'DISPATCHER' | 'COURIER' } }) {
    return this.stops.get(id, req.user.userId, req.user.role);
  }
  @Post()
  create(@Body() dto: CreateStopDto, @Req() req: { user: { userId: string; role: string } }) {
    if (req.user.role !== 'DISPATCHER') throw new ForbiddenException();
    return this.stops.create(req.user.userId, dto);
  }
  @Patch(':id/status')
  status(@Param('id') id: string, @Body() dto: StatusDto, @Req() req: { user: { userId: string; role: 'DISPATCHER' | 'COURIER' } }) {
    return this.stops.updateStatus(id, req.user.userId, req.user.role, dto.status);
  }
}
