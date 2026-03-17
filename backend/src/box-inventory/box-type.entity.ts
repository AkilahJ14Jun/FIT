import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Delivery } from '../deliveries/delivery.entity';

@Entity('box_types')
export class BoxType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  capacity: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  availableQuantity: number;

  @Column({ default: 0 })
  dispatchedQuantity: number;

  @OneToMany(() => Delivery, delivery => delivery.boxType)
  deliveries: Delivery[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
