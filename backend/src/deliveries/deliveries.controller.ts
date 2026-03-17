import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { Delivery } from './delivery.entity';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  async create(@Body() deliveryData: Partial<Delivery>): Promise<Delivery> {
    return this.deliveriesService.create(deliveryData);
  }

  @Get()
  async findAll(
    @Query('customerId') customerId?: string,
    @Query('date') date?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Delivery[]> {
    if (customerId) {
      return this.deliveriesService.findByCustomer(parseInt(customerId));
    }
    if (date) {
      return this.deliveriesService.findByDate(new Date(date));
    }
    if (startDate && endDate) {
      return this.deliveriesService.findByDateRange(new Date(startDate), new Date(endDate));
    }
    return this.deliveriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Delivery> {
    return this.deliveriesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() deliveryData: Partial<Delivery>,
  ): Promise<Delivery> {
    return this.deliveriesService.update(id, deliveryData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.deliveriesService.remove(id);
  }

  @Post(':id/returns')
  async recordReturn(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity') quantity: number,
  ): Promise<Delivery> {
    return this.deliveriesService.recordReturn(id, quantity);
  }
}
