# Project Functional Specification

This document describes the overall business requirements and user-facing functionality for the entire project.

---

# Functional Specification: Docker Business Management Application

## Executive Summary

A containerization-themed business management dashboard application built with React. The application provides a comprehensive platform for managing orders, customers, products, approvals, and business metrics with a focus on Docker container management concepts. It features user authentication, multi-view navigation, data management with search and pagination, and session tracking—all persisted locally within the browser via localStorage.

## Business Objectives

1. **Provide a unified management interface** for Docker-related business operations including orders, customers, and products
2. **Enable workflow tracking and approvals** for expense reports, travel requests, and purchase orders
3. **Deliver real-time operational insights** through a dashboard with containerized infrastructure metrics
4. **Support user account management** with secure authentication and profile customization
5. **Offer accessibility and responsive user experiences** across desktop browsers

## Primary User Personas

- **Operations Manager**: Monitors dashboard metrics, approves expenses and travel requests, tracks active sessions
- **Sales Representative**: Manages customer relationships, browses orders and products, updates customer information
- **Administrator**: Manages product catalog, masters data, user profiles, and system settings
- **End User**: Views personal profile, updates settings and password, tracks order status

## Key Functional Requirements

### 1. Authentication & Account Management
- **User Registration**: Email validation, password complexity enforcement (8+ chars, uppercase, lowercase, digit, special char), unique email enforcement via localStorage
- **User Login**: Simple credentials validation against registered users, session state via localStorage flag
- **Profile Management**: View and edit display name, email, username, bio, member since date, and role
- **Password Management**: Current password verification, new password validation, confirmation matching
- **Session Persistence**: Stay logged in across browser reloads via localStorage tokens
- **Logout**: Clear authentication state and redirect to login with confirmation dialog

### 2. Dashboard & Analytics
- **Metrics Display**: Real-time count cards showing:
  - Total Containers: 12
  - Running Containers: 8
  - Container Images: 24
  - Volumes: 6
- **Metric Cards**: Icon-based cards with Font Awesome icons for visual clarity

### 3. Orders Management
- **Order Listing**: Display orders with ID, customer name, product, status, and date
- **Order States**: Pending, Processing, Shipped, Delivered
- **Search Functionality**: Multi-field search across order ID, customer, product, status, and date
- **Mock Data**: 5 sample orders pre-populated on application load
- **No Persistence**: Orders remain static; no create/edit/delete operations

### 4. Customers Management
- **Customer CRUD Operations**:
  - **List**: Display all customers in paginated table (5 per page)
  - **Create**: Modal form to add new customer with auto-incremented ID
  - **Search**: Filter by name, email, company, phone, status
  - **Pagination**: Previous/Next controls with page indicators
- **Customer Attributes**: ID, name, email, company, phone, status (Active/Inactive/Pending)
- **Mock Data**: 12 sample customers on initialization
- **Validation**: All fields required in add form
- **State Persistence**: Customer additions maintained in component state during session

### 5. Products Management
- **Product CRUD Operations**:
  - **List**: Paginated table (10 per page) with SKU, name, category, formatted price
  - **Create**: Modal form for new product entry with category selector
  - **Search**: Full-text search across SKU, name, category, price
- **Product Attributes**: SKU, name, category, price (formatted as $X.XX)
- **Categories**: Electronics, Accessories, Office, Furniture, Storage, Wearables
- **Pagination**: Similar controls to Customers
- **Price Formatting**: Automatic decimal display ($X.XX format)

### 6. Masters Data Management
- **Masters Listing**: Paginated display (5 per page) of system reference data
- **Master Attributes**: ID, code, name, description, type, status
- **Search**: Search across all master data fields
- **Use Case**: System-wide lookup tables for configuration and categorization
- **Pagination**: Previous/Next with page indicators

### 7. Approvals Workflow
- **Approval Listing**: Paginated table (5 per page) showing pending and processed approvals
- **Approval Types**: Expense Report, Travel Request, Purchase Order, Time Off
- **Approval States**: Pending, Approved, Rejected
- **Approval Action**: Single "Approve" button per row; disabled when status is "Approved"
- **Search**: Multi-field search across ID, requester, type, amount, date, status
- **Mock Data**: 10 sample approvals with various states
- **State Management**: Approval status changes persist in component state during session

### 8. Sessions Management
- **Session Tracking**: View login sessions with session ID, user, login time, logout time, device
- **Session States**: Active (no logout time) or closed (with logout time)
- **Search**: Search across session ID, user, login time, device
- **Pagination**: 5 items per page with navigation controls
- **Mock Data**: Pre-populated sample session history

### 9. FAQ Section
- **Collapsible Content**: 6 Docker-related FAQs with expandable/collapsible Q&A pairs
- **Accessibility**: ARIA labels for screen readers, keyboard navigation support
- **Topics**: Docker basics, container management, image vs. container, Dockerfile, Docker Compose
- **No Backend**: FAQ content hard-coded in component

### 10. Legal/Policy Pages
- **Privacy Policy**: Accessible from login/register pages and footer links
- **Terms and Conditions**: Accessible from login/register pages and footer links
- **Navigation**: Keyboard and mouse accessible links

### 11. Navigation & Layout
- **Sidebar Navigation**: 8 main navigation items (Dashboard, Orders, Customers, Products, Masters, Approvals, Sessions, FAQ)
- **Sidebar Collapse**: Toggle to collapse/expand sidebar labels, icons remain visible
- **Active Route Highlighting**: Current page highlighted in sidebar
- **Navbar (Top)**: Profile icon, settings icon, logout button—visible when authenticated
- **Responsive Layout**: Desktop-optimized layout with sidebar + content area

### 12. Settings & Account Control
- **Account Settings**: Edit name, email, bio (no persistence to storage)
- **Password Change**:
  - Current password required
  - New password validation (complexity rules)
  - Confirmation matching
  - Success notification on change
- **Settings Page**: No backend integration; form changes stay in component state during session

## Non-Functional Requirements

### Performance
- **Page Load**: < 2 seconds on modern browsers
- **Search Response**: Instant filtering with visual feedback
- **Pagination**: Smooth navigation between pages
- **No Backend Latency**: All operations are client-side calculations

### Security
- **Password Storage**: No real storage; mock authentication via localStorage only
- **Client-Side Only**: No external API calls or backend integration
- **Session Token**: Simple localStorage flag; no JWT or OAuth
- **Accessibility (WCAG 2.1 Level AA)**:
  - ARIA labels on interactive elements
  - Keyboard navigation support (buttons, links, forms)
  - Semantic HTML (form, dialog, region roles)
  - Icon + text labels where possible
  - Color contrast compliance

### Usability
- **Responsive Design**: Desktop-first layout
- **Toast Notifications**: Visual feedback for user actions (success/info/error)
- **Form Validation**: Real-time or on-submit validation with clear error messages
- **Modal Dialogs**: Accessible modal overlays for add operations
- **Confirmation Dialogs**: Logout confirmation to prevent accidental logout

### Browser Compatibility
- **Target Browsers**: Chrome, Firefox, Safari (latest versions)
- **ES6+ Support**: Modern JavaScript (arrow functions, destructuring, hooks)
- **localStorage Availability**: Application requires localStorage support

## Core User Workflows

### Workflow 1: New User Registration & Login
1. User navigates to login page
2. Clicks "Register" link
3. Fills registration form (name, email, password with validation)
4. Account saved to localStorage
5. Redirected to login page
6. Logs in with registered credentials
7. Redirected to dashboard

### Workflow 2: Browse and Approve Requests
1. Authenticated user navigates to Approvals section via sidebar
2. Views paginated list of approval requests
3. Searches/filters for specific approval
4. Clicks "Approve" button on pending request
5. Status changes to "Approved" and button disables
6. Success toast notification displayed

### Workflow 3: Manage Customer Relationships
1. User navigates to Customers section
2. Views paginated customer list
3. Searches for specific customer by name or company
4. Clicks "Add Customer" button
5. Fills modal form with customer details
6. Submits form; customer added to list with new ID
7. Success notification shown
8. Modal closes and customer appears in list

### Workflow 4: Update Personal Profile
1. Authenticated user clicks profile icon in top navbar
2. Views profile page with editable information
3. Clicks "Edit profile" button
4. Form switches to edit mode
5. Updates fields (name, email, username, bio)
6. Submits form; changes applied to display
7. Success notification shown

### Workflow 5: Change Account Password
1. User navigates to Settings page
2. Enters current password, new password, confirmation
3. System validates password complexity and matching
4. On success, clears form and shows success notification
5. On failure, displays specific validation error messages

## Data Requirements

### Core Entities

#### User
- id (auto-generated)
- name (string, required)
- email (string, unique, required)
- password (string, complexity-validated)
- role (string, defaults to "User")
- member_since (date)
- bio (string, optional)
- avatar_url (string, optional)

#### Order
- id (string, e.g., "ORD-001")
- customer (string)
- product (string)
- status (enum: Pending, Processing, Shipped, Delivered)
- date (date, ISO format)

#### Customer
- id (integer, auto-generated)
- name (string, required)
- email (string, required)
- company (string, required)
- phone (string, required)
- status (enum: Active, Inactive, Pending)

#### Product
- id (integer, auto-generated)
- sku (string, required)
- name (string, required)
- category (enum: Electronics, Accessories, Office, Furniture, Storage, Wearables)
- price (number, required)

#### Approval
- id (string, e.g., "APR-001")
- requester (string)
- type (enum: Expense Report, Travel Request, Purchase Order, Time Off)
- amount (string, currency formatted)
- date (date)
- status (enum: Pending, Approved, Rejected)

#### Master
- id (integer)
- code (string)
- name (string)
- description (string)
- type (string)
- status (enum: Active, Inactive)

#### Session
- id (string, session identifier)
- user (string, username)
- login_time (datetime)
- logout_time (datetime or null)
- device (string, device name/type)

## Integration Points

### External Systems
- **None currently integrated**: Application is fully client-side with mock data
- **Future Integration Points**:
  - Real authentication backend (OAuth, JWT)
  - RESTful API for CRUD operations (orders, customers, products)
  - Database persistence (replacing localStorage)
  - Email service for notifications
  - Analytics service for dashboard metrics

### Internal Integrations
- **react-router-dom**: Client-side routing and navigation
- **react-toastify**: Toast notification system
- **localStorage API**: Session persistence
- **Font Awesome 6.4.2**: Icon assets via CDN
- **react-particles & tsparticles**: Confetti animation (used in dashboard context)

## Constraints and Assumptions

### Technical Constraints
- **Client-Side Only**: No backend server or database; all state is volatile
- **localStorage Limitation**: Data persists only within same browser/domain; cleared on browser cache clear
- **No Real Authentication**: Mock authentication; email/password not securely stored
- **Plain JavaScript**: No TypeScript; no build-time type safety
- **Single CSS File**: All component styles consolidated in `src/App.css` (272 lines)
- **No External HTTP Calls**: No API integration; all data is hard-coded or stored locally

### Assumption: Mock Data Persistence
- Customers and products added during session persist in component state only
- Page reload resets to original mock data
- No inter-session data preservation for dynamic additions

### Assumption: Feature Completeness
- Approval workflow is UI-only; no backend business logic
- Session tracking is mock data; no real session management
- Masters data is read-only; no editing interface
- All "complex" business logic exists in the browser; no server validation

### Assumption: User Expectations
- Users understand this is a demo/prototype application
- No expectation of real data persistence or security
- Users accept UI-only interactions without backend consequences
- Users familiar with modern web applications and form patterns
