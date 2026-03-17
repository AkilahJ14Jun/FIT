import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalSource } from './external-source.entity';

@Injectable()
export class ExternalSourcesService {
  constructor(
    @InjectRepository(ExternalSource)
    private externalSourceRepository: Repository<ExternalSource>,
  ) {}

  async create(externalSourceData: Partial<ExternalSource>): Promise<ExternalSource> {
    const externalSource = this.externalSourceRepository.create(externalSourceData);
    return this.externalSourceRepository.save(externalSource);
  }

  async findAll(): Promise<ExternalSource[]> {
    return this.externalSourceRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<ExternalSource> {
    const externalSource = await this.externalSourceRepository.findOne({ where: { id } });
    if (!externalSource) {
      throw new HttpException('External source not found', HttpStatus.NOT_FOUND);
    }
    return externalSource;
  }

  async update(id: number, externalSourceData: Partial<ExternalSource>): Promise<ExternalSource> {
    await this.externalSourceRepository.update(id, externalSourceData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.externalSourceRepository.delete(id);
  }

  async updateBoxCount(id: number, sent: number, returned: number): Promise<void> {
    const externalSource = await this.findOne(id);
    externalSource.boxesSent += sent;
    externalSource.boxesReturned += returned;
    await this.externalSourceRepository.save(externalSource);
  }
}
