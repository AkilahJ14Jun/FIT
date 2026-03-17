## ADDED Requirements

### Requirement: Create customer record
The system SHALL allow users to create a new customer with name, shop name, address, and mobile number.

#### Scenario: Successful customer creation
- **WHEN** user submits customer form with valid name, shop name, address, and mobile number
- **THEN** system creates customer record and returns success confirmation

#### Scenario: Duplicate mobile number
- **WHEN** user submits customer form with a mobile number that already exists
- **THEN** system displays error message indicating mobile number is already registered

### Requirement: Retrieve customer details
The system SHALL allow users to view customer details by ID or list all customers.

#### Scenario: View single customer
- **WHEN** user requests customer by valid ID
- **THEN** system returns customer details including name, shop name, address, and mobile number

#### Scenario: List all customers
- **WHEN** user requests customer list
- **THEN** system returns paginated list of all customers sorted by name

#### Scenario: Search customers
- **WHEN** user searches by name or shop name
- **THEN** system returns matching customers filtered by search term

### Requirement: Update customer record
The system SHALL allow users to modify existing customer information.

#### Scenario: Successful customer update
- **WHEN** user submits updated customer information with valid ID
- **THEN** system updates customer record and returns success confirmation

#### Scenario: Update with duplicate mobile
- **WHEN** user updates customer with a mobile number belonging to another customer
- **THEN** system displays error message preventing duplicate mobile numbers

### Requirement: Delete customer record
The system SHALL allow users to delete customers that have no active transactions.

#### Scenario: Delete customer without transactions
- **WHEN** user deletes customer with no delivery records
- **THEN** system removes customer record and returns success confirmation

#### Scenario: Prevent delete with active transactions
- **WHEN** user attempts to delete customer with existing delivery records
- **THEN** system prevents deletion and displays error message indicating active transactions exist
