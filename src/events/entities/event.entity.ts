import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Device } from '../../devices/entities';
import { Node } from '../../nodes/entities';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => Device, (device) => device.events, { eager: true })
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @ManyToOne(() => Node, (node) => node.events, { eager: true })
  @JoinColumn({ name: 'node_id' })
  node: Node;
}
