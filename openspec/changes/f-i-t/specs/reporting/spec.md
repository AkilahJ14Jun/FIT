## ADDED Requirements

### Requirement: Generate boxes sent report by customer and date range
The system SHALL generate a report showing boxes sent to a specific customer within a date range.

#### Scenario: Generate customer date range report
- **WHEN** user selects customer, start date, and end date
- **THEN** system returns report with all deliveries to that customer within the range including bill numbers, dates, quantities sent, quantities returned, and balances

#### Scenario: Report with no data
- **WHEN** user requests report for date range with no deliveries
- **THEN** system returns empty result with message indicating no records found

### Requirement: Generate boxes sent report by specific date
The system SHALL generate a report showing all boxes sent on a specific date.

#### Scenario: Generate daily dispatch report
- **WHEN** user selects a specific date
- **THEN** system returns report with all deliveries on that date including customer names, bill numbers, quantities, drivers, and vehicles

#### Scenario: Daily report with customer filter
- **WHEN** user selects specific date and customer
- **THEN** system returns deliveries for that customer on that specific date

### Requirement: Generate customer balance summary
The system SHALL provide a summary of outstanding box balances for all customers.

#### Scenario: Generate balance summary
- **WHEN** user requests customer balance summary
- **THEN** system returns list of all customers with current outstanding box balances sorted by balance amount

#### Scenario: Filter by balance threshold
- **WHEN** user requests customers with balance above specified threshold
- **THEN** system returns only customers with outstanding balances exceeding the threshold

### Requirement: Generate box inventory report
The system SHALL provide reports on box inventory status.

#### Scenario: Generate current inventory report
- **WHEN** user requests inventory report
- **THEN** system returns current available, dispatched, and total counts by box type

#### Scenario: Generate inventory movement report
- **WHEN** user requests inventory movement for date range
- **THEN** system returns opening balance, receipts, dispatches, returns, and closing balance by box type

### Requirement: Export reports
The system SHALL allow exporting reports in printable format.

#### Scenario: Export to PDF
- **WHEN** user requests PDF export of any report
- **THEN** system generates PDF file with formatted report data

#### Scenario: Export to print
- **WHEN** user selects print option
- **THEN** system formats report for printer output with proper pagination
