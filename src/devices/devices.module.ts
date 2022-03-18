import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
})
export class DevicesModule {}
