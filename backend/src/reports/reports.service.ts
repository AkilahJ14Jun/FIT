import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Delivery } from '../deliveries/delivery.entity';
import { Customer } from '../customers/customer.entity';
import { BoxType } from '../box-inventory/box-type.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(BoxType)
    private boxTypeRepository: Repository<BoxType>,
  ) {}

  async getCustomerDateRangeReport(customerId: number, startDate: Date, endDate: Date) {
    const deliveries = await this.deliveryRepository.find({
      where: {
        customerId,
        date: Between(startDate, endDate),
      },
      relations: ['customer', 'boxType', 'driver', 'vehicle'],
      order: { date: 'DESC' },
    });

    const totalSent = deliveries.reduce((sum, d) => sum + d.quantitySent, 0);
    const totalReturned = deliveries.reduce((sum, d) => sum + d.quantityReturned, 0);
    const totalBalance = deliveries.reduce((sum, d) => sum + d.balance, 0);

    return {
      customer: deliveries[0]?.customer || await this.customerRepository.findOne({ where: { id: customerId } }),
      startDate,
      endDate,
      deliveries,
      summary: {
        totalSent,
        totalReturned,
        totalBalance,
      },
    };
  }

  async getDailyDispatchReport(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const deliveries = await this.deliveryRepository.find({
      where: { date: Between(startOfDay, endOfDay) },
      relations: ['customer', 'boxType', 'driver', 'vehicle'],
      order: { date: 'DESC' },
    });

    const totalBoxes = deliveries.reduce((sum, d) => sum + d.quantitySent, 0);

    return {
      date,
      deliveries,
      summary: {
        totalDeliveries: deliveries.length,
        totalBoxes,
      },
    };
  }

  async getCustomerBalances(threshold?: number) {
    const customers = await this.customerRepository.find();
    const balances = await Promise.all(
      customers.map(async (customer) => {
        const deliveries = await this.deliveryRepository.find({
          where: { customerId: customer.id },
        });
        const balance = deliveries.reduce((sum, d) => sum + d.balance, 0);
        return { customer, balance };
      }),
    );

    const filteredBalances = threshold
      ? balances.filter((b) => b.balance > threshold)
      : balances;

    return filteredBalances.sort((a, b) => b.balance - a.balance);
  }

  async getInventoryReport() {
    const boxTypes = await this.boxTypeRepository.find();
    return boxTypes.map((bt) => ({
      id: bt.id,
      capacity: bt.capacity,
      description: bt.description,
      available: bt.availableQuantity,
      dispatched: bt.dispatchedQuantity,
      total: bt.availableQuantity + bt.dispatchedQuantity,
    }));
  }

  async getInventoryMovementReport(startDate: Date, endDate: Date) {
    const boxTypes = await this.boxTypeRepository.find();
    const movements = await Promise.all(
      boxTypes.map(async (boxType) => {
        const deliveries = await this.deliveryRepository.find({
          where: {
            boxTypeId: boxType.id,
            date: Between(startDate, endDate),
          },
        });

        const dispatched = deliveries
          .filter((d) => !d.isOpeningBalance)
          .reduce((sum, d) => sum + d.quantitySent, 0);
        const returned = deliveries.reduce((sum, d) => sum + d.quantityReturned, 0);

        return {
          boxType: {
            id: boxType.id,
            capacity: boxType.capacity,
            description: boxType.description,
          },
          openingBalance: boxType.availableQuantity + boxType.dispatchedQuantity - dispatched + returned,
          dispatched,
          returned,
          closingBalance: boxType.availableQuantity + boxType.dispatchedQuantity,
        };
      }),
    );

    return {
      startDate,
      endDate,
      movements,
    };
  }

  async getDriverHistory(driverId: number, startDate: Date, endDate: Date) {
    const deliveries = await this.deliveryRepository.find({
      where: {
        driverId,
        date: Between(startDate, endDate),
      },
      relations: ['customer', 'boxType', 'vehicle'],
      order: { date: 'DESC' },
    });

    return {
      driverId,
      startDate,
      endDate,
      deliveries,
      summary: {
        totalDeliveries: deliveries.length,
        totalBoxes: deliveries.reduce((sum, d) => sum + d.quantitySent, 0),
      },
    };
  }

  async getVehicleUsage(vehicleId: number, startDate: Date, endDate: Date) {
    const deliveries = await this.deliveryRepository.find({
      where: {
        vehicleId,
        date: Between(startDate, endDate),
      },
      relations: ['customer', 'boxType', 'driver'],
      order: { date: 'DESC' },
    });

    return {
      vehicleId,
      startDate,
      endDate,
      deliveries,
      summary: {
        totalDeliveries: deliveries.length,
        totalBoxes: deliveries.reduce((sum, d) => sum + d.quantitySent, 0),
      },
    };
  }
}
