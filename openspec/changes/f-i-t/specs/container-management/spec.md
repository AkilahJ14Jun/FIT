## ADDED Requirements

### Requirement: Record container purchase
The system SHALL allow users to record bulk fish purchases in containers.

#### Scenario: Create container record
- **WHEN** user submits container entry with purchase date, quantity, supplier details, and description
- **THEN** system creates container record with unique identifier

#### Scenario: View container details
- **WHEN** user requests container by ID
- **THEN** system returns container details including date, quantity, supplier, and description

### Requirement: List container purchases
The system SHALL provide listing of all container purchases.

#### Scenario: View container list
- **WHEN** user requests container list
- **THEN** system returns paginated list of containers sorted by purchase date descending

#### Scenario: Filter by date range
- **WHEN** user requests containers within specific date range
- **THEN** system returns only containers purchased within that range

### Requirement: Update container record
The system SHALL allow modification of container details before boxes are dispatched.

#### Scenario: Update container before dispatch
- **WHEN** user updates container with no associated deliveries
- **THEN** system updates container record successfully

#### Scenario: Prevent update after dispatch
- **WHEN** user attempts to update container with associated deliveries
- **THEN** system prevents update and displays warning that boxes have been dispatched

### Requirement: Delete container record
The system SHALL allow deletion of erroneously entered containers.

#### Scenario: Delete unused container
- **WHEN** user deletes container with no associated deliveries
- **THEN** system removes container record

#### Scenario: Prevent delete with deliveries
- **WHEN** user attempts to delete container with associated deliveries
- **THEN** system prevents deletion and displays error message
