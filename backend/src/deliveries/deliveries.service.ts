import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Delivery } from './delivery.entity';
import { BoxInventoryService } from '../box-inventory/box-inventory.service';
import { ExternalSourcesService } from '../external-sources/external-sources.service';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    private boxInventoryService: BoxInventoryService,
    private externalSourcesService: ExternalSourcesService,
  ) {}

  async create(deliveryData: Partial<Delivery>): Promise<Delivery> {
    // Check bill number uniqueness
    const existingDelivery = await this.deliveryRepository.findOne({
      where: { billNumber: deliveryData.billNumber },
    });
    if (existingDelivery) {
      throw new HttpException('Bill number already exists', HttpStatus.CONFLICT);
    }

    // Calculate initial balance
    const balance = deliveryData.quantitySent;

    const delivery = this.deliveryRepository.create({
      ...deliveryData,
      balance,
    });

    const savedDelivery = await this.deliveryRepository.save(delivery);

    // Update inventory if not opening balance and not external source
    if (!deliveryData.isOpeningBalance && !deliveryData.externalSourceId) {
      await this.boxInventoryService.dispatchBoxes(
        deliveryData.boxTypeId,
        deliveryData.quantitySent,
      );
    }

    // Update external source if applicable
    if (deliveryData.externalSourceId) {
      await this.externalSourcesService.updateBoxCount(
        deliveryData.externalSourceId,
        deliveryData.quantitySent,
        0,
      );
    }

    return this.findOne(savedDelivery.id);
  }

  async findAll(): Promise<Delivery[]> {
    return this.deliveryRepository.find({
      relations: ['customer', 'boxType', 'driver', 'vehicle', 'externalSource'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
      relations: ['customer', 'boxType', 'driver', 'vehicle', 'externalSource'],
    });
    if (!delivery) {
      throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
    }
    return delivery;
  }

  async findByCustomer(customerId: number): Promise<Delivery[]> {
    return this.deliveryRepository.find({
      where: { customerId },
      relations: ['customer', 'boxType', 'driver', 'vehicle', 'externalSource'],
      order: { date: 'DESC' },
    });
  }

  async findByDate(date: Date): Promise<Delivery[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.deliveryRepository.find({
      where: { date: Between(startOfDay, endOfDay) },
      relations: ['customer', 'boxType', 'driver', 'vehicle', 'externalSource'],
      order: { date: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Delivery[]> {
    return this.deliveryRepository.find({
      where: { date: Between(startDate, endDate) },
      relations: ['customer', 'boxType', 'driver', 'vehicle', 'externalSource'],
      order: { date: 'DESC' },
    });
  }

  async update(id: number, deliveryData: Partial<Delivery>): Promise<Delivery> {
    const delivery = await this.findOne(id);

    // Recalculate balance if quantity sent changed
    if (deliveryData.quantitySent !== undefined) {
      deliveryData.balance = deliveryData.quantitySent - delivery.quantityReturned;
    }

    await this.deliveryRepository.update(id, deliveryData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const delivery = await this.findOne(id);

    // Return boxes to inventory if not opening balance and not external
    if (!delivery.isOpeningBalance && !delivery.externalSourceId) {
      await this.boxInventoryService.returnBoxes(
        delivery.boxTypeId,
        delivery.quantitySent - delivery.quantityReturned,
      );
    }

    await this.deliveryRepository.delete(id);
  }

  async recordReturn(id: number, quantity: number): Promise<Delivery> {
    const delivery = await this.findOne(id);

    if (quantity > delivery.balance) {
      throw new HttpException('Return quantity exceeds balance', HttpStatus.BAD_REQUEST);
    }

    delivery.quantityReturned += quantity;
    delivery.balance = delivery.quantitySent - delivery.quantityReturned;

    await this.deliveryRepository.save(delivery);

    // Update inventory if not external source
    if (!delivery.externalSourceId) {
      await this.boxInventoryService.returnBoxes(delivery.boxTypeId, quantity);
    } else {
      await this.externalSourcesService.updateBoxCount(
        delivery.externalSourceId,
        0,
        quantity,
      );
    }

    return this.findOne(id);
  }

  async getCustomerBalance(customerId: number): Promise<number> {
    const deliveries = await this.deliveryRepository.find({ where: { customerId } });
    return deliveries.reduce((sum, d) => sum + d.balance, 0);
  }
}
