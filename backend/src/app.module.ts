import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { BoxInventoryModule } from './box-inventory/box-inventory.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { DriversModule } from './drivers/drivers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ExternalSourcesModule } from './external-sources/external-sources.module';
import { ReportsModule } from './reports/reports.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'fish-trader.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: process.env.NODE_ENV === 'production',
    }),
    CustomersModule,
    BoxInventoryModule,
    DeliveriesModule,
    DriversModule,
    VehiclesModule,
    ExternalSourcesModule,
    ReportsModule,
    BillingModule,
  ],
})
export class AppModule {}
