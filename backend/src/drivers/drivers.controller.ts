import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Driver } from './driver.entity';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  async create(@Body() driverData: Partial<Driver>): Promise<Driver> {
    return this.driversService.create(driverData);
  }

  @Get()
  async findAll(): Promise<Driver[]> {
    return this.driversService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Driver> {
    return this.driversService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() driverData: Partial<Driver>,
  ): Promise<Driver> {
    return this.driversService.update(id, driverData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.driversService.remove(id);
  }
}
