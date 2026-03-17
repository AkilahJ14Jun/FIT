import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Delivery } from '../deliveries/delivery.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  shopName: string;

  @Column()
  address: string;

  @Column({ unique: true })
  mobileNumber: string;

  @OneToMany(() => Delivery, delivery => delivery.customer)
  deliveries: Delivery[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
