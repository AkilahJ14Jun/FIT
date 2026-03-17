## ADDED Requirements

### Requirement: Create driver record
The system SHALL allow users to maintain driver information.

#### Scenario: Add new driver
- **WHEN** user submits driver form with name and contact number
- **THEN** system creates driver record

#### Scenario: View driver list
- **WHEN** user requests driver list
- **THEN** system returns all active drivers

### Requirement: Create vehicle record
The system SHALL allow users to maintain vehicle information.

#### Scenario: Add new vehicle
- **WHEN** user submits vehicle form with vehicle number and type
- **THEN** system creates vehicle record

#### Scenario: View vehicle list
- **WHEN** user requests vehicle list
- **THEN** system returns all registered vehicles

### Requirement: Associate driver and vehicle with delivery
The system SHALL link deliveries to specific drivers and vehicles.

#### Scenario: Assign driver to delivery
- **WHEN** user creates delivery and selects driver
- **THEN** system stores driver reference with delivery record

#### Scenario: Assign vehicle to delivery
- **WHEN** user creates delivery and selects vehicle
- **THEN** system stores vehicle reference with delivery record

### Requirement: View driver delivery history
The system SHALL provide driver-specific delivery reports.

#### Scenario: View deliveries by driver
- **WHEN** user requests deliveries for a specific driver within date range
- **THEN** system returns all deliveries assigned to that driver with customer and quantity details

#### Scenario: View vehicle usage
- **WHEN** user requests deliveries for a specific vehicle within date range
- **THEN** system returns all deliveries using that vehicle with driver and customer details

### Requirement: Update driver and vehicle records
The system SHALL allow modification of driver and vehicle information.

#### Scenario: Update driver details
- **WHEN** user updates driver contact information
- **THEN** system updates driver record and reflects in future deliveries

#### Scenario: Update vehicle details
- **WHEN** user updates vehicle information
- **THEN** system updates vehicle record and reflects in future deliveries
