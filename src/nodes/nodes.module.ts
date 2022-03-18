import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
})
export class NodesModule {}
