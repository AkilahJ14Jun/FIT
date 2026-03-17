import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Delivery } from '../deliveries/delivery.entity';

@Entity('external_sources')
export class ExternalSource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  contactDetails: string;

  @Column({ default: 0 })
  boxesSent: number;

  @Column({ default: 0 })
  boxesReturned: number;

  @OneToMany(() => Delivery, delivery => delivery.externalSource)
  deliveries: Delivery[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
