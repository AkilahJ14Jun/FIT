import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalSource } from './external-source.entity';
import { ExternalSourcesController } from './external-sources.controller';
import { ExternalSourcesService } from './external-sources.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExternalSource])],
  controllers: [ExternalSourcesController],
  providers: [ExternalSourcesService],
  exports: [ExternalSourcesService],
})
export class ExternalSourcesModule {}
