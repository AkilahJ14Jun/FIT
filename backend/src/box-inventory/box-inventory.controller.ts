import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BoxInventoryService } from './box-inventory.service';
import { BoxType } from './box-type.entity';
import { Container } from './container.entity';

@Controller('box-inventory')
export class BoxInventoryController {
  constructor(private readonly boxInventoryService: BoxInventoryService) {}

  // Box Type endpoints
  @Post('box-types')
  async createBoxType(@Body() boxTypeData: Partial<BoxType>): Promise<BoxType> {
    return this.boxInventoryService.createBoxType(boxTypeData);
  }

  @Get('box-types')
  async findAllBoxTypes(): Promise<BoxType[]> {
    return this.boxInventoryService.findAllBoxTypes();
  }

  @Get('box-types/:id')
  async findOneBoxType(@Param('id', ParseIntPipe) id: number): Promise<BoxType> {
    return this.boxInventoryService.findOneBoxType(id);
  }

  @Put('box-types/:id')
  async updateBoxType(
    @Param('id', ParseIntPipe) id: number,
    @Body() boxTypeData: Partial<BoxType>,
  ): Promise<BoxType> {
    return this.boxInventoryService.updateBoxType(id, boxTypeData);
  }

  @Delete('box-types/:id')
  async removeBoxType(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.boxInventoryService.removeBoxType(id);
  }

  // Container endpoints
  @Post('containers')
  async createContainer(@Body() containerData: Partial<Container>): Promise<Container> {
    return this.boxInventoryService.createContainer(containerData);
  }

  @Get('containers')
  async findAllContainers(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Container[]> {
    if (startDate && endDate) {
      return this.boxInventoryService.findContainersByDateRange(
        new Date(startDate),
        new Date(endDate),
      );
    }
    return this.boxInventoryService.findAllContainers();
  }

  @Get('containers/:id')
  async findOneContainer(@Param('id', ParseIntPipe) id: number): Promise<Container> {
    return this.boxInventoryService.findOneContainer(id);
  }

  @Put('containers/:id')
  async updateContainer(
    @Param('id', ParseIntPipe) id: number,
    @Body() containerData: Partial<Container>,
  ): Promise<Container> {
    return this.boxInventoryService.updateContainer(id, containerData);
  }

  @Delete('containers/:id')
  async removeContainer(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.boxInventoryService.removeContainer(id);
  }

  // Inventory status
  @Get('status')
  async getInventoryStatus(): Promise<any> {
    return this.boxInventoryService.getInventoryStatus();
  }
}
