import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Delivery } from '../deliveries/delivery.entity';

interface BillRecord {
  billNumber: string;
  customerId: number;
  customerName: string;
  customerShop: string;
  customerAddress: string;
  customerMobile: string;
  date: Date;
  deliveries: Delivery[];
  totalBoxes: number;
}

@Injectable()
export class BillingService {
  private bills: Map<string, BillRecord> = new Map();
  private billCounter = 1;

  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  async generateBill(deliveryIds: number[]): Promise<BillRecord> {
    if (!deliveryIds || deliveryIds.length === 0) {
      throw new HttpException('No deliveries specified', HttpStatus.BAD_REQUEST);
    }

    const deliveries = await this.deliveryRepository.find({
      where: { id: In(deliveryIds) },
      relations: ['customer', 'boxType', 'driver', 'vehicle'],
    });

    if (deliveries.length === 0) {
      throw new HttpException('No deliveries found', HttpStatus.NOT_FOUND);
    }

    const customer = deliveries[0].customer;
    const billNumber = this.generateBillNumber();

    const bill: BillRecord = {
      billNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerShop: customer.shopName,
      customerAddress: customer.address,
      customerMobile: customer.mobileNumber,
      date: new Date(),
      deliveries,
      totalBoxes: deliveries.reduce((sum, d) => sum + d.quantitySent, 0),
    };

    this.bills.set(billNumber, bill);
    return bill;
  }

  private generateBillNumber(): string {
    const prefix = 'BILL';
    const number = this.billCounter.toString().padStart(4, '0');
    this.billCounter++;
    return `${prefix}-${number}`;
  }

  async generatePdf(billNumber: string): Promise<Buffer> {
    const bill = this.bills.get(billNumber);
    if (!bill) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }

    // Simple HTML to PDF generation using puppeteer or similar would go here
    // For now, return a placeholder HTML that can be converted
    const html = this.generateBillHtml(bill);

    // In a real implementation, use puppeteer or pdfkit
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.setContent(html);
    // const pdf = await page.pdf({ format: 'A4' });
    // await browser.close();
    // return pdf;

    // Placeholder: return HTML as buffer
    return Buffer.from(html);
  }

  private generateBillHtml(bill: BillRecord): string {
    const deliveryRows = bill.deliveries
      .map(
        (d) => `
      <tr>
        <td>${d.billNumber}</td>
        <td>${d.date.toLocaleDateString()}</td>
        <td>${d.boxType.capacity} - ${d.boxType.description}</td>
        <td>${d.quantitySent}</td>
        <td>${d.driver?.name || 'N/A'}</td>
        <td>${d.vehicle?.vehicleNumber || 'N/A'}</td>
      </tr>
    `,
      )
      .join('');

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { text-align: center; }
            .header { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Fish Trader Bill</h1>
          <div class="header">
            <p><strong>Bill Number:</strong> ${bill.billNumber}</p>
            <p><strong>Date:</strong> ${bill.date.toLocaleDateString()}</p>
            <p><strong>Customer:</strong> ${bill.customerName}</p>
            <p><strong>Shop:</strong> ${bill.customerShop}</p>
            <p><strong>Address:</strong> ${bill.customerAddress}</p>
            <p><strong>Mobile:</strong> ${bill.customerMobile}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Bill Ref</th>
                <th>Date</th>
                <th>Box Type</th>
                <th>Quantity</th>
                <th>Driver</th>
                <th>Vehicle</th>
              </tr>
            </thead>
            <tbody>
              ${deliveryRows}
            </tbody>
          </table>
          <p class="total">Total Boxes: ${bill.totalBoxes}</p>
        </body>
      </html>
    `;
  }

  async getBillData(billNumber: string): Promise<BillRecord | null> {
    return this.bills.get(billNumber) || null;
  }

  async getBillHistory(customerId: number): Promise<BillRecord[]> {
    return Array.from(this.bills.values()).filter(
      (bill) => bill.customerId === customerId,
    );
  }

  async generateWhatsAppLink(billNumber: string, phoneNumber: string): Promise<string> {
    const bill = this.bills.get(billNumber);
    if (!bill) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }

    // Format phone number (remove non-numeric and add country code if needed)
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    const message = `Here is your bill ${billNumber} from Fish Trader. Total boxes: ${bill.totalBoxes}`;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  }
}
