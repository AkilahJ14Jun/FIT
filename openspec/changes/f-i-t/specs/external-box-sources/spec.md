## ADDED Requirements

### Requirement: Record external box source
The system SHALL allow users to record boxes obtained from external sources.

#### Scenario: Create external source entry
- **WHEN** user submits external box entry with source name, contact details, quantity, and date obtained
- **THEN** system creates external source record with unique identifier

#### Scenario: View external sources
- **WHEN** user requests list of external sources
- **THEN** system returns all external box sources with contact information

### Requirement: Associate external boxes with deliveries
The system SHALL track when externally sourced boxes are sent to customers.

#### Scenario: Mark delivery as using external boxes
- **WHEN** user creates delivery and specifies external source for boxes
- **THEN** system links delivery to external source and tracks quantity

#### Scenario: Track external box attribution
- **WHEN** user views delivery details
- **THEN** system displays whether boxes were from own inventory or external source

### Requirement: Report external box usage
The system SHALL provide reporting on external box utilization.

#### Scenario: View external boxes by source
- **WHEN** user requests report filtered by external source
- **THEN** system returns all deliveries using boxes from that source with dates and quantities

#### Scenario: View external boxes by customer
- **WHEN** user requests external boxes sent to specific customer
- **THEN** system returns all external box deliveries for that customer with source attribution

### Requirement: Track external box returns
The system SHALL track returns of externally sourced boxes separately.

#### Scenario: Record external box return
- **WHEN** boxes from external source are returned
- **THEN** system updates external source balance and marks return in delivery record

#### Scenario: Calculate external source balance
- **WHEN** user views external source details
- **THEN** system displays outstanding boxes to be returned to that source
