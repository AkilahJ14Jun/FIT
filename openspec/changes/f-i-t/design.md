## Context

This is a new system for a fish trader to manage their business operations. The trader purchases fish in bulk containers and sells in retail boxes of varying capacities. Currently, tracking is manual and error-prone. The solution requires a modular architecture to allow easy addition of new features and modification of existing ones.

**Current State**: Manual tracking using paper/books
**Target State**: Digital system with web and mobile interfaces
**Constraints**:
- SQLite for simplicity and local deployment
- Modular design for extensibility
- React for frontend (web + mobile responsive)
- NestJS for backend with module-based architecture

## Goals / Non-Goals

**Goals:**
- Create a modular, extensible system architecture
- Implement customer master management
- Track box inventory across the supply chain (containers → boxes → customers)
- Record delivery transactions with driver/vehicle details
- Support external box sources with attribution
- Generate date-range reports for box dispatches
- Create PDF bills with WhatsApp sharing capability
- Ensure mobile-responsive design for field use

**Non-Goals:**
- Real-time synchronization across multiple devices
- Multi-user role-based access control (initial version)
- Integration with external accounting software
- Online payment processing
- Inventory valuation/costing (focus on quantity tracking)

## Decisions

### Modular Architecture with NestJS Modules
**Decision**: Use NestJS module system with clear boundaries between domains.
**Rationale**: Each capability (customer, inventory, delivery, etc.) becomes a separate module with its own controller, service, and entity. This allows adding/modifying features without affecting others.
**Alternative Considered**: Monolithic approach - rejected due to difficulty in maintenance and extension.

### SQLite Database
**Decision**: Use SQLite for data persistence.
**Rationale**: Single-file database requires no server setup, perfect for small business local deployment. TypeORM provides abstraction if migration to PostgreSQL is needed later.
**Alternative Considered**: PostgreSQL - rejected due to deployment complexity for a single-user system.

### Shared Database Schema with Foreign Key Relationships
**Decision**: Use relational schema with foreign keys linking customers, deliveries, boxes, and drivers.
**Rationale**: Ensures data integrity for balance calculations and reporting. Delivery records reference customers, box types, and drivers.

### React SPA with Responsive Design
**Decision**: Single-page application with mobile-first responsive design.
**Rationale**: One codebase serves both web and mobile users. React with a component library (e.g., Material-UI or Ant Design) provides rapid development.
**Alternative Considered**: Separate React Native app - rejected to reduce development time and maintenance.

### PDF Generation on Backend
**Decision**: Generate PDFs server-side using libraries like Puppeteer or PDFKit.
**Rationale**: Consistent rendering across devices, easier to implement WhatsApp sharing via backend API.

## Risks / Trade-offs

**Risk**: SQLite concurrency limitations with multiple users → **Mitigation**: Document as single-user system; future migration path to PostgreSQL documented.

**Risk**: Mobile browser limitations vs native app experience → **Mitigation**: Use PWA features (service worker, offline storage) for better mobile experience.

**Risk**: WhatsApp API integration complexity → **Mitigation**: Use WhatsApp Web link scheme (wa.me) as fallback if official API is too complex.

**Trade-off**: Modularity adds initial complexity → **Benefit**: Long-term maintainability and feature addition speed.

## Migration Plan

1. **Phase 1**: Deploy backend with core modules (customer, box inventory, delivery tracking)
2. **Phase 2**: Add reporting and billing modules
3. **Phase 3**: Import existing data (opening balances, customer list)
4. **Rollback**: Database backups before each phase; versioned API for frontend compatibility

## Open Questions

- Should the system support multiple box types with different capacities simultaneously?
- Is internet connectivity reliable, or should offline mode be prioritized?
- What specific fields should appear on the printed bill (GST, terms, etc.)?
