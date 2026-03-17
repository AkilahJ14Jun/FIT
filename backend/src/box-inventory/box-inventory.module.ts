import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoxType } from './box-type.entity';
import { Container } from './container.entity';
import { BoxInventoryController } from './box-inventory.controller';
import { BoxInventoryService } from './box-inventory.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoxType, Container])],
  controllers: [BoxInventoryController],
  providers: [BoxInventoryService],
  exports: [BoxInventoryService],
})
export class BoxInventoryModule {}
