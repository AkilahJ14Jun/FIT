import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './delivery.entity';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { BoxInventoryModule } from '../box-inventory/box-inventory.module';
import { ExternalSourcesModule } from '../external-sources/external-sources.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery]),
    BoxInventoryModule,
    ExternalSourcesModule,
  ],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
  exports: [DeliveriesService],
})
export class DeliveriesModule {}
