## ADDED Requirements

### Requirement: Create box type
The system SHALL allow users to define box types with capacity and description.

#### Scenario: Create box type with capacity
- **WHEN** user submits box type form with capacity (e.g., 10kg, 15kg) and description
- **THEN** system creates box type record and returns success confirmation

### Requirement: Record container purchase
The system SHALL allow users to record bulk container purchases with quantity and date.

#### Scenario: Record new container
- **WHEN** user submits container entry with quantity, date, and description
- **THEN** system creates container record and updates available box inventory

### Requirement: Track box inventory levels
The system SHALL maintain current box inventory counts across all locations.

#### Scenario: View current inventory
- **WHEN** user requests inventory status
- **THEN** system returns total boxes available, dispatched, and returned by box type

#### Scenario: Calculate opening balance
- **WHEN** user sets opening balance for a box type
- **THEN** system records opening balance quantity with date and description

### Requirement: Update box status
The system SHALL track box state transitions (available, dispatched, returned).

#### Scenario: Mark boxes as dispatched
- **WHEN** delivery is recorded for a customer
- **THEN** system reduces available count and increases dispatched count for the box type

#### Scenario: Mark boxes as returned
- **WHEN** box return is recorded for a customer
- **THEN** system increases available count and reduces dispatched count for the box type

### Requirement: View box transaction history
The system SHALL provide history of all box movements.

#### Scenario: View box ledger
- **WHEN** user requests transaction history for a box type
- **THEN** system returns chronological list of all receipts, dispatches, and returns with dates and quantities
