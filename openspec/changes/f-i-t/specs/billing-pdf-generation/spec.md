## ADDED Requirements

### Requirement: Generate customer bill PDF
The system SHALL generate PDF bills for customer deliveries.

#### Scenario: Generate bill from delivery
- **WHEN** user selects delivery and requests bill generation
- **THEN** system creates PDF with customer details, bill number, date, item descriptions, quantities, and totals

#### Scenario: Generate consolidated bill
- **WHEN** user selects multiple deliveries for a customer and requests consolidated bill
- **THEN** system creates single PDF combining all selected deliveries

### Requirement: Include required bill fields
The system SHALL include all necessary fields on the generated bill.

#### Scenario: Bill with all fields
- **WHEN** PDF bill is generated
- **THEN** document includes: trader business name, customer name and shop, bill number, bill date, description of goods, quantity, box details, driver name, vehicle number, and any applicable terms

### Requirement: Preview bill before generation
The system SHALL allow previewing bill before final PDF creation.

#### Scenario: Preview bill
- **WHEN** user requests bill preview
- **THEN** system displays formatted preview of bill content for verification

#### Scenario: Edit before finalizing
- **WHEN** user is in preview mode
- **THEN** user can modify details before generating final PDF

### Requirement: Share bill via WhatsApp
The system SHALL provide WhatsApp sharing functionality for generated bills.

#### Scenario: Share to customer WhatsApp
- **WHEN** user selects "Share via WhatsApp" for generated bill
- **THEN** system opens WhatsApp with customer mobile number pre-filled and PDF attached (or link if direct attachment not available)

#### Scenario: WhatsApp not available
- **WHEN** WhatsApp is not installed or configured
- **THEN** system provides alternative sharing options (email, download)

### Requirement: Store bill history
The system SHALL maintain history of generated bills.

#### Scenario: View generated bills
- **WHEN** user requests bill history for a customer
- **THEN** system returns list of previously generated bills with dates and download links

#### Scenario: Regenerate bill
- **WHEN** user requests regeneration of existing bill
- **THEN** system recreates PDF with original data

### Requirement: Bill numbering
The system SHALL maintain sequential bill numbering.

#### Scenario: Auto-generate bill number
- **WHEN** new bill is created
- **THEN** system assigns next sequential bill number in format configurable by user

#### Scenario: Custom bill number
- **WHEN** user specifies custom bill number
- **THEN** system validates uniqueness and uses provided number
