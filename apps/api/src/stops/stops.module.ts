import { Module } from '@nestjs/common';
import { StopsService } from './stops.service';
import { StopsController } from './stops.controller';
@Module({ providers: [StopsService], controllers: [StopsController] })
export class StopsModule {}
