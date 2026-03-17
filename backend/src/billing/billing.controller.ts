import { Controller, Get, Post, Param, ParseIntPipe, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('generate')
  async generateBill(@Body() body: { deliveryIds: number[] }): Promise<any> {
    return this.billingService.generateBill(body.deliveryIds);
  }

  @Get('pdf/:billNumber')
  async downloadPdf(
    @Param('billNumber') billNumber: string,
    @Res() res: Response,
  ): Promise<void> {
    const pdfBuffer = await this.billingService.generatePdf(billNumber);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=bill-${billNumber}.pdf`);
    res.send(pdfBuffer);
  }

  @Get('preview/:billNumber')
  async previewBill(@Param('billNumber') billNumber: string): Promise<any> {
    return this.billingService.getBillData(billNumber);
  }

  @Get('history/:customerId')
  async getBillHistory(@Param('customerId', ParseIntPipe) customerId: number): Promise<any[]> {
    return this.billingService.getBillHistory(customerId);
  }

  @Get('whatsapp-link/:billNumber')
  async getWhatsAppLink(
    @Param('billNumber') billNumber: string,
    @Body('phoneNumber') phoneNumber: string,
  ): Promise<{ link: string }> {
    const link = await this.billingService.generateWhatsAppLink(billNumber, phoneNumber);
    return { link };
  }
}
