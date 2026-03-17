import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from '../deliveries/delivery.entity';
import { Customer } from '../customers/customer.entity';
import { BoxType } from '../box-inventory/box-type.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, Customer, BoxType])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
