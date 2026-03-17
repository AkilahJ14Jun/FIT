import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ExternalSourcesService } from './external-sources.service';
import { ExternalSource } from './external-source.entity';

@Controller('external-sources')
export class ExternalSourcesController {
  constructor(private readonly externalSourcesService: ExternalSourcesService) {}

  @Post()
  async create(@Body() externalSourceData: Partial<ExternalSource>): Promise<ExternalSource> {
    return this.externalSourcesService.create(externalSourceData);
  }

  @Get()
  async findAll(): Promise<ExternalSource[]> {
    return this.externalSourcesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ExternalSource> {
    return this.externalSourcesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() externalSourceData: Partial<ExternalSource>,
  ): Promise<ExternalSource> {
    return this.externalSourcesService.update(id, externalSourceData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.externalSourcesService.remove(id);
  }
}
