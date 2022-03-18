import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Node } from '../../nodes/entities';

@Entity('edges')
export class Edge {
  @PrimaryGeneratedColumn('uuid')
  from: string;

  @PrimaryGeneratedColumn('uuid')
  to: string;

  @Column()
  weight: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @OneToOne(() => Node, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'from' }, { name: 'to' }])
  node: Node;
}
