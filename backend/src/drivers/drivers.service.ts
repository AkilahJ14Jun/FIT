import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) {}

  async create(driverData: Partial<Driver>): Promise<Driver> {
    const driver = this.driverRepository.create(driverData);
    return this.driverRepository.save(driver);
  }

  async findAll(): Promise<Driver[]> {
    return this.driverRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Driver> {
    const driver = await this.driverRepository.findOne({ where: { id } });
    if (!driver) {
      throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
    }
    return driver;
  }

  async update(id: number, driverData: Partial<Driver>): Promise<Driver> {
    await this.driverRepository.update(id, driverData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.driverRepository.delete(id);
  }
}
