## ADDED Requirements

### Requirement: Create delivery record
The system SHALL allow users to record box dispatches to customers.

#### Scenario: Record box dispatch
- **WHEN** user submits delivery with customer ID, bill number, date, box type, quantity sent, driver, and vehicle
- **THEN** system creates delivery record and updates customer box balance

#### Scenario: Validate bill number uniqueness
- **WHEN** user submits delivery with duplicate bill number
- **THEN** system displays error indicating bill number already exists

### Requirement: Record box returns
The system SHALL allow users to record boxes returned by customers.

#### Scenario: Record partial return
- **WHEN** user submits return entry with delivery reference, date, and quantity returned
- **THEN** system updates delivery record with return quantity and recalculates balance

#### Scenario: Record full return
- **WHEN** user marks all boxes as returned for a delivery
- **THEN** system sets balance to zero and updates box inventory

### Requirement: Calculate box balance
The system SHALL automatically calculate outstanding box balance per customer.

#### Scenario: Calculate running balance
- **WHEN** delivery is created or updated with returns
- **THEN** system calculates balance as (total sent - total returned) for that customer

#### Scenario: View customer balance
- **WHEN** user views customer details
- **THEN** system displays current outstanding box balance across all deliveries

### Requirement: Support opening balance entries
The system SHALL allow recording of opening balances from previous periods.

#### Scenario: Record opening balance
- **WHEN** user creates delivery with description marked as "opening balance"
- **THEN** system records balance without affecting inventory counts

#### Scenario: Record balance forward
- **WHEN** user creates delivery with description marked as "balance forward"
- **THEN** system carries forward previous period balance

### Requirement: View delivery history
The system SHALL provide complete delivery transaction history.

#### Scenario: View customer deliveries
- **WHEN** user requests delivery history for a customer
- **THEN** system returns all deliveries with bill numbers, dates, quantities, returns, and balances

#### Scenario: View all deliveries by date
- **WHEN** user requests deliveries for a specific date
- **THEN** system returns all deliveries dispatched on that date
