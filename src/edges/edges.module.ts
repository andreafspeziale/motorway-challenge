import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Edge])],
})
export class EdgesModule {}
