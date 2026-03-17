import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(customerData: Partial<Customer>): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne({
      where: { mobileNumber: customerData.mobileNumber },
    });
    if (existingCustomer) {
      throw new HttpException('Mobile number already exists', HttpStatus.CONFLICT);
    }
    const customer = this.customerRepository.create(customerData);
    return this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { id } });
  }

  async update(id: number, customerData: Partial<Customer>): Promise<Customer> {
    if (customerData.mobileNumber) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { mobileNumber: customerData.mobileNumber },
      });
      if (existingCustomer && existingCustomer.id !== id) {
        throw new HttpException('Mobile number already exists', HttpStatus.CONFLICT);
      }
    }
    await this.customerRepository.update(id, customerData);
    const customer = await this.findOne(id);
    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  async remove(id: number): Promise<void> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['deliveries'],
    });
    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    if (customer.deliveries && customer.deliveries.length > 0) {
      throw new HttpException('Cannot delete customer with active deliveries', HttpStatus.BAD_REQUEST);
    }
    await this.customerRepository.delete(id);
  }

  async search(query: string): Promise<Customer[]> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.name LIKE :query', { query: `%${query}%` })
      .orWhere('customer.shopName LIKE :query', { query: `%${query}%` })
      .orderBy('customer.name', 'ASC')
      .getMany();
  }
}
