import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from '../customers/customer.entity';
import { BoxType } from '../box-inventory/box-type.entity';
import { Driver } from '../drivers/driver.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { ExternalSource } from '../external-sources/external-source.entity';

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  billNumber: string;

  @Column()
  date: Date;

  @Column()
  customerId: number;

  @ManyToOne(() => Customer, customer => customer.deliveries)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  boxTypeId: number;

  @ManyToOne(() => BoxType, boxType => boxType.deliveries)
  @JoinColumn({ name: 'boxTypeId' })
  boxType: BoxType;

  @Column()
  quantitySent: number;

  @Column({ default: 0 })
  quantityReturned: number;

  @Column({ default: 0 })
  balance: number;

  @Column({ nullable: true })
  driverId: number;

  @ManyToOne(() => Driver, driver => driver.deliveries, { nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @Column({ nullable: true })
  vehicleId: number;

  @ManyToOne(() => Vehicle, vehicle => vehicle.deliveries, { nullable: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Column({ nullable: true })
  externalSourceId: number;

  @ManyToOne(() => ExternalSource, externalSource => externalSource.deliveries, { nullable: true })
  @JoinColumn({ name: 'externalSourceId' })
  externalSource: ExternalSource;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isOpeningBalance: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
