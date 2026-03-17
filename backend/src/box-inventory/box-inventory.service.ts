import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { BoxType } from './box-type.entity';
import { Container } from './container.entity';

@Injectable()
export class BoxInventoryService {
  constructor(
    @InjectRepository(BoxType)
    private boxTypeRepository: Repository<BoxType>,
    @InjectRepository(Container)
    private containerRepository: Repository<Container>,
  ) {}

  // Box Type methods
  async createBoxType(boxTypeData: Partial<BoxType>): Promise<BoxType> {
    const boxType = this.boxTypeRepository.create(boxTypeData);
    return this.boxTypeRepository.save(boxType);
  }

  async findAllBoxTypes(): Promise<BoxType[]> {
    return this.boxTypeRepository.find();
  }

  async findOneBoxType(id: number): Promise<BoxType> {
    const boxType = await this.boxTypeRepository.findOne({ where: { id } });
    if (!boxType) {
      throw new HttpException('Box type not found', HttpStatus.NOT_FOUND);
    }
    return boxType;
  }

  async updateBoxType(id: number, boxTypeData: Partial<BoxType>): Promise<BoxType> {
    await this.boxTypeRepository.update(id, boxTypeData);
    return this.findOneBoxType(id);
  }

  async removeBoxType(id: number): Promise<void> {
    await this.boxTypeRepository.delete(id);
  }

  // Container methods
  async createContainer(containerData: Partial<Container>): Promise<Container> {
    const container = this.containerRepository.create(containerData);
    return this.containerRepository.save(container);
  }

  async findAllContainers(): Promise<Container[]> {
    return this.containerRepository.find({ order: { purchaseDate: 'DESC' } });
  }

  async findContainersByDateRange(startDate: Date, endDate: Date): Promise<Container[]> {
    return this.containerRepository.find({
      where: { purchaseDate: Between(startDate, endDate) },
      order: { purchaseDate: 'DESC' },
    });
  }

  async findOneContainer(id: number): Promise<Container> {
    const container = await this.containerRepository.findOne({ where: { id } });
    if (!container) {
      throw new HttpException('Container not found', HttpStatus.NOT_FOUND);
    }
    return container;
  }

  async updateContainer(id: number, containerData: Partial<Container>): Promise<Container> {
    await this.containerRepository.update(id, containerData);
    return this.findOneContainer(id);
  }

  async removeContainer(id: number): Promise<void> {
    await this.containerRepository.delete(id);
  }

  // Inventory status
  async getInventoryStatus(): Promise<any> {
    const boxTypes = await this.boxTypeRepository.find();
    return boxTypes.map(bt => ({
      id: bt.id,
      capacity: bt.capacity,
      description: bt.description,
      available: bt.availableQuantity,
      dispatched: bt.dispatchedQuantity,
      total: bt.availableQuantity + bt.dispatchedQuantity,
    }));
  }

  // Update box quantities
  async dispatchBoxes(boxTypeId: number, quantity: number): Promise<void> {
    const boxType = await this.findOneBoxType(boxTypeId);
    if (boxType.availableQuantity < quantity) {
      throw new HttpException('Insufficient boxes available', HttpStatus.BAD_REQUEST);
    }
    boxType.availableQuantity -= quantity;
    boxType.dispatchedQuantity += quantity;
    await this.boxTypeRepository.save(boxType);
  }

  async returnBoxes(boxTypeId: number, quantity: number): Promise<void> {
    const boxType = await this.findOneBoxType(boxTypeId);
    boxType.availableQuantity += quantity;
    boxType.dispatchedQuantity -= quantity;
    await this.boxTypeRepository.save(boxType);
  }
}
