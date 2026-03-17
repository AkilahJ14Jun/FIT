import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from '../deliveries/delivery.entity';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery])],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
