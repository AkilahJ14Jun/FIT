## Why

A fish trader currently manages bulk container purchases, retail box sales, customer deliveries, and box returns through manual processes. This leads to tracking errors, difficulty reconciling box balances, and time-consuming report generation. A modular digital solution will streamline operations, provide real-time visibility into box inventory across customers, and automate reporting and billing.

## What Changes

- **New modular web and mobile application** built with React, NestJS, and SQLite
- **Customer Master module** for managing customer profiles with shop details and contact information
- **Box Inventory module** for tracking boxes of varying capacities across the supply chain
- **Container Management module** for recording bulk purchases
- **Delivery Tracking module** for capturing box dispatches, returns, and balance calculations per customer
- **External Box Sources module** for tracking third-party boxes sent to customers with source attribution
- **Driver & Vehicle module** for associating deliveries with transportation details
- **Reporting module** for generating date-range box dispatch reports and customer-specific summaries
- **Billing module** for PDF bill generation and WhatsApp sharing

## Capabilities

### New Capabilities
- `customer-management`: Create, read, update, and delete customer records with fields for name, shop name, address, and mobile number
- `box-inventory`: Manage box types with varying capacities, track box states (available, dispatched, returned), and maintain opening balances
- `container-management`: Record bulk container purchases with quantity, date, and description
- `delivery-tracking`: Capture box dispatch transactions including bill number, date, boxes sent, boxes returned, balance calculation, driver, and vehicle details
- `external-box-sources`: Track boxes sourced externally with source details and associate them with customer deliveries
- `driver-vehicle-management`: Maintain driver names and vehicle numbers for delivery association
- `reporting`: Generate reports for boxes sent within date ranges to specific customers and boxes sent on specific dates
- `billing-pdf-generation`: Generate PDF bills and share via WhatsApp integration

### Modified Capabilities
- None (new system implementation)

## Impact

- **Frontend**: React web application with responsive design for mobile compatibility
- **Backend**: NestJS API with modular architecture for easy feature addition/modification
- **Database**: SQLite for local deployment and simplicity
- **Integrations**: WhatsApp sharing API for bill distribution
- **Deployment**: Standalone application with potential for future cloud migration
