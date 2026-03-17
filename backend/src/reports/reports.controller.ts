import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('customer-date-range')
  async getCustomerDateRangeReport(
    @Query('customerId') customerId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getCustomerDateRangeReport(
      parseInt(customerId),
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('daily-dispatch')
  async getDailyDispatchReport(@Query('date') date: string) {
    return this.reportsService.getDailyDispatchReport(new Date(date));
  }

  @Get('customer-balances')
  async getCustomerBalances(@Query('threshold') threshold?: string) {
    return this.reportsService.getCustomerBalances(
      threshold ? parseInt(threshold) : undefined,
    );
  }

  @Get('inventory')
  async getInventoryReport() {
    return this.reportsService.getInventoryReport();
  }

  @Get('inventory-movement')
  async getInventoryMovementReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getInventoryMovementReport(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('driver-history')
  async getDriverHistory(
    @Query('driverId') driverId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getDriverHistory(
      parseInt(driverId),
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('vehicle-usage')
  async getVehicleUsage(
    @Query('vehicleId') vehicleId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getVehicleUsage(
      parseInt(vehicleId),
      new Date(startDate),
      new Date(endDate),
    );
  }
}
