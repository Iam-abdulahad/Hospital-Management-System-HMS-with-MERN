 # HealTrack — Product Requirements Document (PRD)

> **Document ID:** HT-PRD-2026-001  
> **Version:** 1.0.0  
> **Status:** Draft — Pending Stakeholder Review  
> **Author:** Abdul Ahad (Solutions Architect & Lead Developer)  
> **Created:** July 9, 2026  
> **Last Updated:** July 9, 2026  
> **Confidentiality:** Internal Use Only

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Objectives & Success Metrics](#2-objectives--success-metrics)
3. [Scope](#3-scope)
4. [User Personas & Roles (RBAC)](#4-user-personas--roles-rbac)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Technical Stack](#7-technical-stack)
8. [System Architecture](#8-system-architecture)
9. [Data Models](#9-data-models)
10. [API Endpoint Map](#10-api-endpoint-map)
11. [Sprint Timeline (6 Weeks)](#11-sprint-timeline-6-weeks)
12. [Risks & Mitigations](#12-risks--mitigations)
13. [Appendix](#13-appendix)

---

## 1. Introduction

### 1.1 Purpose

This document defines the complete product requirements for **HealTrack**, a full-stack Hospital Management System designed for small-scale hospitals (≤ 20 beds, ≤ 10 doctors). HealTrack digitizes core hospital workflows — patient registration, appointment scheduling, digital prescriptions, billing, and administrative reporting — through a modern, role-based web application.

### 1.2 Problem Statement

Small hospitals in underserved regions still rely on paper-based record keeping, manual scheduling boards, and handwritten prescriptions. This leads to:

- **Double-booked appointments** causing patient wait-time escalation
- **Lost medical records** due to paper degradation and filing errors
- **Revenue leakage** from untracked invoices and inconsistent billing
- **Zero analytics** — administrators have no data-driven visibility into hospital performance
- **Security vulnerabilities** — sensitive patient PII stored in unlocked cabinets

### 1.3 Solution Overview

HealTrack provides a cloud-hosted, responsive web application with four distinct user roles (Admin, Doctor, Receptionist, Patient) governed by Role-Based Access Control (RBAC). The system enables real-time appointment management with conflict detection, digital prescription generation, automated billing, and an interactive admin dashboard with KPI visualizations.

### 1.4 Target Hospital Profile

| Parameter | Specification |
|-----------|--------------|
| Hospital Size | Small (≤ 20 beds) |
| Doctor Count | ≤ 10 practicing physicians |
| Daily Patient Volume | 30–80 patients (OPD + admitted) |
| Staff Count | 5–15 administrative/nursing staff |
| IT Infrastructure | Basic internet connectivity, no dedicated IT team |
| Current System | Paper-based or minimal spreadsheet tracking |

---

## 2. Objectives & Success Metrics

### 2.1 Primary Objectives

| # | Objective | Measurable Target |
|---|-----------|-------------------|
| O1 | Eliminate appointment double-booking | 0% scheduling conflicts after deployment |
| O2 | Digitize all patient records | 100% of new patients registered digitally within Week 1 |
| O3 | Reduce patient check-in time | From ~8 min (manual) to ≤ 2 min (digital lookup) |
| O4 | Provide real-time revenue visibility | Admin dashboard updated within 5 seconds of transaction |
| O5 | Ensure data security compliance | All PII encrypted at rest and in transit |
| O6 | Enable mobile access for doctors | Fully responsive UI functional on ≥ 320px screens |

### 2.2 Key Performance Indicators (KPIs)

| KPI | Baseline (Pre-HealTrack) | Target (Post-HealTrack) |
|-----|--------------------------|------------------------|
| Average appointment booking time | 5–10 minutes (phone/walk-in) | < 1 minute (online) |
| Invoice generation time | 15–20 minutes (manual) | < 30 seconds (automated) |
| Monthly revenue tracking accuracy | ~70% (manual ledger) | 99%+ (system-generated) |
| Patient record retrieval time | 3–5 minutes (file search) | < 2 seconds (database query) |
| System uptime | N/A | ≥ 99.5% |

---

## 3. Scope

### 3.1 In Scope (MVP — v1.0)

- ✅ User authentication (Email/Password + Google OAuth)
- ✅ Role-Based Access Control (Admin, Doctor, Receptionist, Patient)
- ✅ Patient registration and profile management (CRUD)
- ✅ Appointment scheduling with double-booking prevention
- ✅ Digital prescription creation and viewing
- ✅ Basic billing and invoice generation
- ✅ Admin dashboard with KPIs and charts
- ✅ Responsive, mobile-first UI with smooth animations
- ✅ Secure API with JWT-protected routes

### 3.2 Out of Scope (v2.0+)

- ❌ Pharmacy/inventory management module
- ❌ Lab result integration (LIS/PACS)
- ❌ Insurance claim processing
- ❌ Telemedicine/video consultation
- ❌ Multi-hospital/branch support
- ❌ Native mobile application (iOS/Android)
- ❌ SMS/WhatsApp notification integration
- ❌ Electronic Health Record (EHR) interoperability (HL7/FHIR)

---

## 4. User Personas & Roles (RBAC)

### 4.1 Persona Definitions

| Role | Persona | Description | Primary Goals |
|------|---------|-------------|---------------|
| **Admin** | Dr. Karim (Hospital Director) | Oversees all operations, manages staff accounts, monitors revenue | Full system visibility, add/remove users, view analytics |
| **Doctor** | Dr. Fatima (General Physician) | Treats patients, writes prescriptions, manages personal schedule | View appointments, create prescriptions, see patient history |
| **Receptionist** | Sadia (Front Desk Officer) | Handles walk-ins, schedules appointments, processes billing | Register patients, book appointments, generate invoices |
| **Patient** | Rahim (Local Resident) | Books appointments, views medical history and prescriptions | Self-register, book appointments, view own records |

### 4.2 RBAC Permission Matrix

| Feature / Action | Admin | Doctor | Receptionist | Patient |
|-----------------|:-----:|:------:|:------------:|:-------:|
| **User Management** | | | | |
| Create staff accounts | ✅ | ❌ | ❌ | ❌ |
| Edit/delete staff accounts | ✅ | ❌ | ❌ | ❌ |
| Assign roles | ✅ | ❌ | ❌ | ❌ |
| View all users | ✅ | ❌ | ❌ | ❌ |
| **Patient Records** | | | | |
| Register new patient | ✅ | ❌ | ✅ | ✅ (self only) |
| View any patient profile | ✅ | ✅ (assigned) | ✅ | ❌ |
| Edit patient profile | ✅ | ❌ | ✅ | ✅ (self only) |
| Delete patient record | ✅ | ❌ | ❌ | ❌ |
| View own medical history | — | — | — | ✅ |
| **Appointments** | | | | |
| View all appointments | ✅ | ❌ | ✅ | ❌ |
| View own appointments | — | ✅ | — | ✅ |
| Create appointment | ✅ | ❌ | ✅ | ✅ (self only) |
| Update/cancel appointment | ✅ | ✅ (own) | ✅ | ✅ (own, ≥24h before) |
| **Prescriptions** | | | | |
| Create prescription | ❌ | ✅ | ❌ | ❌ |
| View any prescription | ✅ | ✅ (own patients) | ✅ | ❌ |
| View own prescriptions | — | — | — | ✅ |
| Edit prescription | ❌ | ✅ (author, within 24h) | ❌ | ❌ |
| **Billing** | | | | |
| Generate invoice | ✅ | ❌ | ✅ | ❌ |
| Mark payment as received | ✅ | ❌ | ✅ | ❌ |
| View all invoices | ✅ | ❌ | ✅ | ❌ |
| View own invoices | — | — | — | ✅ |
| **Dashboard & Reports** | | | | |
| View admin dashboard | ✅ | ❌ | ❌ | ❌ |
| View KPIs and analytics | ✅ | ❌ | ❌ | ❌ |
| Export reports (CSV) | ✅ | ❌ | ❌ | ❌ |
| Doctor personal stats | — | ✅ | — | — |

### 4.3 RBAC Implementation Strategy

```
Middleware Chain:  Request → verifyJWT → checkRole(['admin', 'doctor']) → Controller

- JWT payload includes: { userId, email, role }
- Role check middleware compares req.user.role against allowed roles array
- Route-level guards + UI-level conditional rendering (double protection)
```

---

## 5. Functional Requirements

### 5.1 Authentication & Authorization

| ID | Requirement | Priority | Role(s) |
|----|------------|----------|---------|
| **FR-01** | The system shall allow users to register with email and password. Password must be ≥ 8 characters with at least 1 uppercase, 1 number, and 1 special character. | P0 | All |
| **FR-02** | The system shall support Google OAuth login via Firebase Authentication as an alternative sign-in method. | P0 | All |
| **FR-03** | The system shall issue a JWT access token (15-min expiry) and an HTTP-only refresh token (7-day expiry) upon successful login. | P0 | All |
| **FR-04** | The system shall enforce RBAC on every protected API route using middleware that validates the user's role against the endpoint's allowed roles. | P0 | All |
| **FR-05** | The system shall allow Admins to create accounts for Doctors and Receptionists with a pre-assigned role. These users receive an email with temporary credentials. | P1 | Admin |

### 5.2 Patient Registration & Management

| ID | Requirement | Priority | Role(s) |
|----|------------|----------|---------|
| **FR-06** | The system shall allow Receptionists and Admins to register a new patient with the following fields: Full Name, Date of Birth, Gender, Phone, Email (optional), Address, Blood Group, Emergency Contact Name & Phone, Known Allergies (text), and a system-generated unique Patient ID (format: `HT-PXXXX`). | P0 | Admin, Receptionist |
| **FR-07** | The system shall allow Patients to self-register via the public portal. Self-registered patients are flagged as "Unverified" until a Receptionist confirms their identity. | P1 | Patient |
| **FR-08** | The system shall provide a searchable patient directory with filters by Name, Patient ID, Phone, and Blood Group. Search results must return within 500ms for up to 5,000 records. | P0 | Admin, Receptionist, Doctor |
| **FR-09** | The system shall display a comprehensive patient profile page showing: demographics, appointment history, prescription history, billing history, and allergies/notes. | P0 | Admin, Receptionist, Doctor |
| **FR-10** | The system shall allow Admins to soft-delete patient records (mark as inactive) rather than permanently removing data, to maintain audit trails. | P1 | Admin |

### 5.3 Appointment Scheduling

| ID | Requirement | Priority | Role(s) |
|----|------------|----------|---------|
| **FR-11** | The system shall allow Receptionists and Patients to book an appointment by selecting: Doctor, Date, Time Slot (30-min intervals from 09:00–17:00), and Reason for Visit. | P0 | Admin, Receptionist, Patient |
| **FR-12** | The system shall **prevent double-booking** by checking existing appointments against the selected doctor, date, and time slot before confirming. If a conflict exists, the system must display available alternatives for that doctor on the same day. | P0 | System |
| **FR-13** | The system shall display a daily/weekly appointment calendar view for Doctors showing their scheduled patients, color-coded by status (Confirmed = Teal, Pending = Amber, Emergency = Coral, Completed = Gray). | P0 | Doctor |
| **FR-14** | The system shall allow appointment status transitions: `Pending → Confirmed → In-Progress → Completed` or `Pending → Cancelled`. Only authorized roles can trigger each transition (see RBAC matrix). | P0 | Admin, Doctor, Receptionist |
| **FR-15** | The system shall enforce a 24-hour cancellation policy for Patient-initiated cancellations. Cancellations within 24 hours require Receptionist approval. | P1 | Patient, Receptionist |

### 5.4 Digital Prescriptions

| ID | Requirement | Priority | Role(s) |
|----|------------|----------|---------|
| **FR-16** | The system shall allow Doctors to create a digital prescription linked to a specific appointment, containing: Patient reference, Doctor reference, Date, Diagnosis (text), list of Medications (name, dosage, frequency, duration), and Additional Notes. | P0 | Doctor |
| **FR-17** | The system shall allow Doctors to edit a prescription only within 24 hours of creation. After 24 hours, prescriptions become immutable for legal integrity. | P1 | Doctor |
| **FR-18** | The system shall allow Patients to view and download their prescriptions as a formatted printable page (using browser print / `@media print` CSS). | P1 | Patient |

### 5.5 Billing & Invoicing

| ID | Requirement | Priority | Role(s) |
|----|------------|----------|---------|
| **FR-19** | The system shall allow Receptionists to generate an invoice for a patient visit, containing: Patient reference, itemized charges (Consultation Fee, Lab Fees, Medication Charges, Misc.), Total Amount, Payment Status (Unpaid, Partial, Paid), and Payment Method (Cash, Card, Mobile Banking). | P0 | Admin, Receptionist |
| **FR-20** | The system shall auto-populate the consultation fee based on the Doctor's profile (set by Admin) when creating an invoice linked to an appointment. | P1 | System |

### 5.6 Admin Dashboard & Analytics

| ID | Requirement | Priority | Role(s) |
|----|------------|----------|---------|
| **FR-21** | The system shall display an Admin Dashboard with the following real-time KPIs: Total Patients (all time), Today's Appointments (count), Monthly Revenue (sum of paid invoices), Pending Appointments (count), and Active Doctors (on-shift today). | P0 | Admin |
| **FR-22** | The system shall display interactive charts on the Admin Dashboard: Revenue trend (line chart, last 6 months), Department-wise patient distribution (doughnut chart), and Appointment status breakdown (bar chart, this week). | P1 | Admin |
| **FR-23** | The system shall allow Admins to export patient lists and revenue reports as CSV files. | P2 | Admin |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| ID | Requirement | Target |
|----|------------|--------|
| **NFR-01** | Initial page load time (LCP) | < 2.5 seconds on 4G connection |
| **NFR-02** | API response time (p95) | < 300ms for CRUD operations |
| **NFR-03** | Search query response | < 500ms for up to 5,000 patient records |
| **NFR-04** | Dashboard data refresh | Real-time or < 5 seconds polling interval |
| **NFR-05** | Concurrent users supported | ≥ 50 simultaneous users without degradation |

### 6.2 Security

| ID | Requirement | Implementation |
|----|------------|----------------|
| **NFR-06** | Passwords must be hashed before storage | bcrypt with salt rounds = 12 |
| **NFR-07** | All API endpoints serving PII must require authentication | JWT verification middleware on every protected route |
| **NFR-08** | Sensitive patient fields (phone, address, emergency contact) must be encrypted at rest | AES-256 field-level encryption via Mongoose plugin |
| **NFR-09** | All client–server communication must use HTTPS | TLS 1.2+ enforced at Vercel/Render |
| **NFR-10** | JWT tokens must not be stored in localStorage | HTTP-only secure cookies for refresh tokens; in-memory for access tokens |
| **NFR-11** | API rate limiting | 100 requests/min per IP (express-rate-limit) |
| **NFR-12** | Input sanitization | mongo-sanitize + express-validator on all inputs |

### 6.3 Usability

| ID | Requirement | Target |
|----|------------|--------|
| **NFR-13** | Responsive design | Fully functional on viewports ≥ 320px (Tailwind CSS breakpoints) |
| **NFR-14** | Page transitions | Smooth animations using Framer Motion (≤ 400ms duration) |
| **NFR-15** | Accessibility | WCAG 2.1 AA compliance (contrast ratios, keyboard navigation, ARIA labels) |
| **NFR-16** | Browser support | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |

### 6.4 Reliability & Maintainability

| ID | Requirement | Target |
|----|------------|--------|
| **NFR-17** | System uptime | ≥ 99.5% (Render auto-restart on crash) |
| **NFR-18** | Database backups | MongoDB Atlas automated daily backups with 7-day retention |
| **NFR-19** | Error logging | Centralized error handling middleware; structured JSON logs |
| **NFR-20** | Code quality | ESLint + Prettier enforced; component-level modularity |

---

## 7. Technical Stack

### 7.1 Stack Overview

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Frontend Framework** | React.js | 18.x | Component-based architecture enables reusable UI (Cards, Badges, Tables). Virtual DOM ensures performant re-renders for real-time dashboard updates. |
| **CSS Framework** | Tailwind CSS | 3.x | Utility-first approach accelerates responsive development. Custom theme tokens (see `design.md`) ensure brand consistency without writing custom CSS. Mobile-first breakpoints match NFR-13. |
| **Animation** | Framer Motion | 10.x | Declarative animation API integrates natively with React. Provides page transitions (`pageTransition`), staggered lists (`staggerContainer`), and micro-interactions that align with HealTrack's "calm, trustworthy" design philosophy. |
| **HTTP Client** | Axios | 1.x | Interceptor-based architecture simplifies JWT token attachment and refresh logic. Superior error handling over native Fetch. |
| **Charts** | Recharts | 2.x | Built on D3 + React. Declarative chart components (LineChart, PieChart, BarChart) integrate naturally with React state. Lightweight and responsive. |
| **Backend Runtime** | Node.js | 20.x LTS | Non-blocking I/O ideal for handling concurrent appointment queries and real-time dashboard polling. JavaScript full-stack consistency reduces context switching. |
| **Backend Framework** | Express.js | 4.x | Minimal, un-opinionated framework allows custom middleware chains (JWT verify → role check → controller). Battle-tested ecosystem with 60k+ npm packages. |
| **Database** | MongoDB (Atlas) | 7.x | **Document model perfectly suits medical records**: patient profiles contain nested arrays (allergies, medications, visit history) that would require complex JOINs in SQL. Schema flexibility allows iterating on fields (e.g., adding "vaccination history" in v2) without migrations. Atlas provides managed hosting with automated backups. |
| **ODM** | Mongoose | 8.x | Schema validation at the application layer enforces data integrity (required fields, enums, min/max) while preserving MongoDB's flexibility. Middleware hooks (pre-save for hashing, post-find for decryption) centralize cross-cutting concerns. |
| **Authentication** | JWT + Firebase Auth | — | **Dual-layer auth strategy**: Firebase handles Google OAuth complexity (token verification, session management) while JWT provides stateless API authorization with role-encoded payloads. This eliminates session storage on the backend, critical for horizontal scaling on Render's free tier. |
| **Password Hashing** | bcryptjs | 2.x | Industry-standard adaptive hashing. Salt rounds = 12 provides ~300ms hash time, balancing security against brute-force with acceptable UX latency. |
| **Validation** | express-validator | 7.x | Middleware-based input validation chains prevent NoSQL injection and enforce business rules (e.g., appointment time must be in 30-min intervals). |
| **Frontend Hosting** | Vercel | — | Edge network CDN with automatic HTTPS, preview deployments per branch, and zero-config React deployment. Free tier supports ~100GB bandwidth/month — sufficient for a small hospital. |
| **Backend Hosting** | Render | — | Managed Node.js hosting with auto-deploy from Git, automatic HTTPS, and environment variable management. Free tier auto-sleeps after 15 min of inactivity but wakes on request (acceptable for small hospital traffic). |
| **File Storage** | Cloudinary (optional) | — | If profile photos or document uploads are needed in v2. CDN-backed image transformation. |

### 7.2 Why MongoDB Over SQL?

| Consideration | MongoDB (Chosen) | SQL (PostgreSQL) |
|--------------|-----------------|------------------|
| **Medical Record Structure** | Patient documents naturally contain nested arrays (allergies, medications, visit log). Single document read = complete patient view. | Requires 5+ JOIN operations across normalized tables (patients, allergies, medications, visits, prescriptions) for a single patient view. |
| **Schema Evolution** | Adding "vaccination history" or "insurance details" in v2 requires zero migrations — just update the Mongoose schema. | Requires ALTER TABLE migrations, potentially with downtime for data backfilling. |
| **Developer Velocity** | JSON-native. Frontend → API → Database all speak the same language (JavaScript objects). | Requires ORM abstraction layer (Sequelize/Prisma) adding complexity. |
| **Scalability Path** | Horizontal scaling via sharding when the hospital grows. Atlas handles replication. | Vertical scaling first; horizontal requires more complex partitioning. |
| **Trade-off Acknowledged** | ⚠️ No native JOIN support — we mitigate this with Mongoose `populate()` for references (e.g., appointment → patient, appointment → doctor). | Native relational integrity with foreign keys and transactions. |

### 7.3 Why JWT + Firebase Auth (Dual Strategy)?

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐     │
│  │  Client   │────▶│ Firebase Auth │────▶│ Google OAuth  │     │
│  │ (React)   │◀────│  (ID Token)  │◀────│  (Consent)   │     │
│  └──────┬───┘     └──────────────┘     └──────────────┘     │
│         │                                                    │
│         │ POST /api/auth/firebase-login { idToken }          │
│         ▼                                                    │
│  ┌──────────────────────────────────────────────┐           │
│  │              Express Backend                  │           │
│  │  1. Verify Firebase ID Token                  │           │
│  │  2. Find/Create user in MongoDB               │           │
│  │  3. Issue HealTrack JWT (role in payload)     │           │
│  │  4. Set HTTP-only refresh token cookie        │           │
│  └──────────────────────────────────────────────┘           │
│                                                              │
│  Why Firebase?                                               │
│  • Handles Google OAuth complexity (PKCE, token rotation)   │
│  • Eliminates need to manage OAuth secrets server-side      │
│  • Provides email verification out-of-the-box               │
│                                                              │
│  Why Custom JWT on top?                                      │
│  • Encodes RBAC role in payload (Firebase doesn't know      │
│    HealTrack roles)                                          │
│  • Stateless — no session store needed on Render             │
│  • Fine-grained expiry control (15-min access, 7-day        │
│    refresh)                                                  │
│  • Decouples from Firebase — could swap to Auth0/Clerk      │
│    later without changing API middleware                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. System Architecture

### 8.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    React.js (Vite)                             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │  │
│  │  │  Pages   │  │Components│  │  Hooks   │  │ Context/Store │ │  │
│  │  │(Router)  │  │(Reusable)│  │(useAuth) │  │  (AuthCtx)    │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │  │
│  │                    ↕ Axios HTTP Client                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                         Hosted on: Vercel (CDN)                     │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ HTTPS (REST API)
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           SERVER LAYER                              │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Express.js (Node.js)                        │  │
│  │                                                               │  │
│  │  Middleware Pipeline:                                         │  │
│  │  cors → helmet → rate-limit → morgan → routes                │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  Route Groups                                           │  │  │
│  │  │  /api/auth     → authController (login, register, etc.) │  │  │
│  │  │  /api/patients → patientController (CRUD)               │  │  │
│  │  │  /api/appointments → appointmentController              │  │  │
│  │  │  /api/prescriptions → prescriptionController            │  │  │
│  │  │  /api/billing  → billingController                      │  │  │
│  │  │  /api/dashboard → dashboardController (aggregations)    │  │  │
│  │  │  /api/users    → userController (admin CRUD)            │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  Auth Middleware: verifyJWT → extractRole → checkPermission  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                         Hosted on: Render (Web Service)             │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ Mongoose ODM
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                  MongoDB Atlas (M0 Free Tier)                 │  │
│  │                                                               │  │
│  │  Collections:                                                 │  │
│  │  • users          (auth + profile + role)                     │  │
│  │  • patients       (demographics + medical info)               │  │
│  │  • appointments   (doctor ref + patient ref + slot + status)  │  │
│  │  • prescriptions  (doctor ref + patient ref + medications[])  │  │
│  │  • invoices       (patient ref + line items[] + payment)      │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                    Hosted on: MongoDB Atlas (AWS us-east-1)         │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Frontend Architecture

```
src/
├── assets/                    # Static images, fonts
├── components/
│   ├── ui/                    # Design system primitives
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── Input.jsx
│   │   └── Modal.jsx
│   ├── layout/                # Shell components
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── PageWrapper.jsx    # Framer Motion page transition
│   │   └── ProtectedRoute.jsx # RBAC route guard
│   ├── dashboard/             # Dashboard-specific widgets
│   │   ├── StatCard.jsx
│   │   ├── RevenueChart.jsx
│   │   └── AppointmentChart.jsx
│   ├── patients/              # Patient module components
│   ├── appointments/          # Appointment module components
│   ├── prescriptions/         # Prescription module components
│   └── billing/               # Billing module components
├── contexts/
│   └── AuthContext.jsx        # Auth state + Firebase integration
├── hooks/
│   ├── useAuth.js
│   ├── useAxios.js            # Axios instance with interceptors
│   └── useDebounce.js
├── lib/
│   ├── motion.js              # Framer Motion variants (from design.md)
│   ├── axios.js               # Configured Axios instance
│   └── firebase.js            # Firebase config + Google provider
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx      # Admin dashboard
│   ├── PatientsPage.jsx       # Patient list + search
│   ├── PatientDetailPage.jsx  # Single patient profile
│   ├── AppointmentsPage.jsx   # Calendar/list view
│   ├── PrescriptionsPage.jsx
│   ├── BillingPage.jsx
│   └── NotFoundPage.jsx
├── App.jsx                    # Router + AuthProvider + AnimatePresence
├── main.jsx                   # Entry point
└── index.css                  # Tailwind directives + custom styles
```

### 8.3 Backend Architecture

```
server/
├── config/
│   ├── db.js                  # MongoDB connection (Mongoose)
│   ├── firebase-admin.js      # Firebase Admin SDK init
│   └── env.js                 # Environment variable validation
├── middleware/
│   ├── auth.js                # verifyJWT middleware
│   ├── roleCheck.js           # checkRole(['admin', 'doctor']) middleware
│   ├── validate.js            # express-validator wrapper
│   ├── rateLimiter.js         # express-rate-limit config
│   └── errorHandler.js        # Centralized error response formatter
├── models/
│   ├── User.js
│   ├── Patient.js
│   ├── Appointment.js
│   ├── Prescription.js
│   └── Invoice.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── patientRoutes.js
│   ├── appointmentRoutes.js
│   ├── prescriptionRoutes.js
│   ├── billingRoutes.js
│   └── dashboardRoutes.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── patientController.js
│   ├── appointmentController.js
│   ├── prescriptionController.js
│   ├── billingController.js
│   └── dashboardController.js
├── utils/
│   ├── generateToken.js       # JWT sign helper
│   ├── generatePatientId.js   # HT-PXXXX generator
│   ├── encryption.js          # AES-256 encrypt/decrypt for PII
│   └── apiError.js            # Custom error class
├── validators/
│   ├── authValidator.js
│   ├── patientValidator.js
│   ├── appointmentValidator.js
│   └── billingValidator.js
├── server.js                  # Express app entry point
└── .env.example               # Environment variable template
```

---

## 9. Data Models

### 9.1 User Schema

```js
// models/User.js
{
  name:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true },
  password:       { type: String },          // null for Google OAuth users
  role:           { type: String, enum: ['admin', 'doctor', 'receptionist', 'patient'], default: 'patient' },
  firebaseUid:    { type: String, unique: true, sparse: true },  // for OAuth users
  phone:          { type: String },
  specialization: { type: String },          // only for doctors
  consultationFee:{ type: Number, default: 0 }, // only for doctors, set by admin
  profileImage:   { type: String },
  isActive:       { type: Boolean, default: true },
  createdAt:      { type: Date, default: Date.now },
  updatedAt:      { type: Date, default: Date.now },
}
```

### 9.2 Patient Schema

```js
// models/Patient.js
{
  patientId:      { type: String, unique: true },  // HT-P0001
  userId:         { type: ObjectId, ref: 'User' }, // link to auth user (if self-registered)
  fullName:       { type: String, required: true },
  dateOfBirth:    { type: Date, required: true },
  gender:         { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  phone:          { type: String, required: true },  // encrypted at rest
  email:          { type: String },
  address:        { type: String },                   // encrypted at rest
  bloodGroup:     { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  emergencyContact: {
    name:         { type: String },
    phone:        { type: String },                   // encrypted at rest
    relation:     { type: String },
  },
  allergies:      [{ type: String }],
  isVerified:     { type: Boolean, default: false },  // for self-registered patients
  isActive:       { type: Boolean, default: true },   // soft-delete flag
  createdAt:      { type: Date, default: Date.now },
  updatedAt:      { type: Date, default: Date.now },
}
```

### 9.3 Appointment Schema

```js
// models/Appointment.js
{
  patient:        { type: ObjectId, ref: 'Patient', required: true },
  doctor:         { type: ObjectId, ref: 'User', required: true },
  date:           { type: Date, required: true },
  timeSlot:       { type: String, required: true },  // "09:00", "09:30", "10:00" etc.
  endTime:        { type: String, required: true },   // calculated: timeSlot + 30min
  reason:         { type: String, required: true },
  status:         { 
    type: String, 
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  notes:          { type: String },                   // doctor's post-visit notes
  cancelledBy:    { type: ObjectId, ref: 'User' },
  cancelReason:   { type: String },
  createdAt:      { type: Date, default: Date.now },
  updatedAt:      { type: Date, default: Date.now },
}

// Compound index for double-booking prevention
// appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 }, { unique: true })
```

### 9.4 Prescription Schema

```js
// models/Prescription.js
{
  appointment:    { type: ObjectId, ref: 'Appointment', required: true },
  patient:        { type: ObjectId, ref: 'Patient', required: true },
  doctor:         { type: ObjectId, ref: 'User', required: true },
  diagnosis:      { type: String, required: true },
  medications:    [{
    name:         { type: String, required: true },
    dosage:       { type: String, required: true },   // e.g., "500mg"
    frequency:    { type: String, required: true },   // e.g., "3x daily"
    duration:     { type: String, required: true },   // e.g., "7 days"
    instructions: { type: String },                   // e.g., "Take after meals"
  }],
  additionalNotes:{ type: String },
  isLocked:       { type: Boolean, default: false },  // auto-locks after 24h
  createdAt:      { type: Date, default: Date.now },
  updatedAt:      { type: Date, default: Date.now },
}
```

### 9.5 Invoice Schema

```js
// models/Invoice.js
{
  invoiceId:      { type: String, unique: true },     // HT-INV-20260001
  patient:        { type: ObjectId, ref: 'Patient', required: true },
  appointment:    { type: ObjectId, ref: 'Appointment' },  // optional link
  generatedBy:    { type: ObjectId, ref: 'User', required: true },
  items:          [{
    description:  { type: String, required: true },   // "Consultation Fee", "Lab Test", etc.
    amount:       { type: Number, required: true },
  }],
  totalAmount:    { type: Number, required: true },
  discount:       { type: Number, default: 0 },
  netAmount:      { type: Number, required: true },   // totalAmount - discount
  paymentStatus:  { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
  paidAmount:     { type: Number, default: 0 },
  paymentMethod:  { type: String, enum: ['cash', 'card', 'mobile-banking', 'other'] },
  paymentDate:    { type: Date },
  createdAt:      { type: Date, default: Date.now },
  updatedAt:      { type: Date, default: Date.now },
}
```

---

## 10. API Endpoint Map

### 10.1 Authentication

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/api/auth/register` | ❌ | Public | Register new user (patient) |
| POST | `/api/auth/login` | ❌ | Public | Login with email/password → JWT |
| POST | `/api/auth/firebase-login` | ❌ | Public | Login with Firebase ID token → JWT |
| POST | `/api/auth/refresh` | 🍪 | Any | Refresh access token via cookie |
| POST | `/api/auth/logout` | ✅ | Any | Clear refresh token cookie |
| GET | `/api/auth/me` | ✅ | Any | Get current user profile |

### 10.2 Users (Admin Only)

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/users` | ✅ | Admin | List all users (paginated) |
| POST | `/api/users` | ✅ | Admin | Create doctor/receptionist account |
| GET | `/api/users/:id` | ✅ | Admin | Get user by ID |
| PUT | `/api/users/:id` | ✅ | Admin | Update user (role, status, fee) |
| DELETE | `/api/users/:id` | ✅ | Admin | Deactivate user account |
| GET | `/api/users/doctors` | ✅ | Admin, Receptionist | List active doctors (for dropdowns) |

### 10.3 Patients

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/patients` | ✅ | Admin, Doctor, Receptionist | List patients (search, filter, paginate) |
| POST | `/api/patients` | ✅ | Admin, Receptionist | Register new patient |
| GET | `/api/patients/:id` | ✅ | Admin, Doctor, Receptionist | Get patient profile (with history) |
| PUT | `/api/patients/:id` | ✅ | Admin, Receptionist | Update patient info |
| DELETE | `/api/patients/:id` | ✅ | Admin | Soft-delete patient |
| GET | `/api/patients/me` | ✅ | Patient | Get own patient profile |

### 10.4 Appointments

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/appointments` | ✅ | Admin, Receptionist | List all appointments (filter by date, doctor, status) |
| POST | `/api/appointments` | ✅ | Admin, Receptionist, Patient | Book new appointment |
| GET | `/api/appointments/:id` | ✅ | Admin, Doctor, Receptionist, Patient (own) | Get appointment details |
| PUT | `/api/appointments/:id` | ✅ | Admin, Receptionist | Update appointment |
| PATCH | `/api/appointments/:id/status` | ✅ | Admin, Doctor, Receptionist | Change appointment status |
| DELETE | `/api/appointments/:id` | ✅ | Admin, Receptionist, Patient (own, ≥24h) | Cancel appointment |
| GET | `/api/appointments/doctor/me` | ✅ | Doctor | Get doctor's own appointments |
| GET | `/api/appointments/patient/me` | ✅ | Patient | Get patient's own appointments |
| GET | `/api/appointments/availability` | ✅ | Any | Check available slots (query: doctor, date) |

### 10.5 Prescriptions

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/prescriptions` | ✅ | Admin, Doctor | List prescriptions (filter) |
| POST | `/api/prescriptions` | ✅ | Doctor | Create new prescription |
| GET | `/api/prescriptions/:id` | ✅ | Admin, Doctor, Receptionist, Patient (own) | Get prescription details |
| PUT | `/api/prescriptions/:id` | ✅ | Doctor (author, ≤24h) | Edit prescription |
| GET | `/api/prescriptions/patient/me` | ✅ | Patient | Get own prescriptions |

### 10.6 Billing

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/invoices` | ✅ | Admin, Receptionist | List invoices (filter, paginate) |
| POST | `/api/invoices` | ✅ | Admin, Receptionist | Generate new invoice |
| GET | `/api/invoices/:id` | ✅ | Admin, Receptionist, Patient (own) | Get invoice details |
| PATCH | `/api/invoices/:id/payment` | ✅ | Admin, Receptionist | Update payment status |
| GET | `/api/invoices/patient/me` | ✅ | Patient | Get own invoices |

### 10.7 Dashboard

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/dashboard/stats` | ✅ | Admin | Get KPI summary (counts, revenue) |
| GET | `/api/dashboard/revenue-trend` | ✅ | Admin | Monthly revenue data (last 6 months) |
| GET | `/api/dashboard/appointment-stats` | ✅ | Admin | Appointment status breakdown |
| GET | `/api/dashboard/department-stats` | ✅ | Admin | Patient distribution by department |
| GET | `/api/dashboard/doctor/me` | ✅ | Doctor | Doctor's personal stats |

---

## 11. Sprint Timeline (6 Weeks)

### Overview

| Sprint | Duration | Focus Area | Deliverables |
|--------|----------|-----------|-------------|
| Sprint 0 | Days 1–3 | Setup & Foundation | Project scaffold, DB connection, design system |
| Sprint 1 | Week 1 | Auth & User Management | Registration, Login, RBAC, Firebase OAuth |
| Sprint 2 | Week 2 | Patient Module | Patient CRUD, Search, Profile views |
| Sprint 3 | Week 3 | Appointments | Scheduling, double-book prevention, calendar UI |
| Sprint 4 | Week 4 | Prescriptions & Billing | Rx creation, invoice generation, payment tracking |
| Sprint 5 | Week 5 | Dashboard & Analytics | KPI cards, charts, CSV export |
| Sprint 6 | Week 6 | Polish, Testing & Deploy | Responsive QA, security audit, production deploy |

---

### Sprint 0: Project Foundation (Days 1–3)

| Task | Details | Status |
|------|---------|--------|
| Initialize React project (Vite) | `npx create-vite@latest` with React template | ⬜ |
| Initialize Express server | Folder structure per §8.3 | ⬜ |
| Configure Tailwind CSS | Import design tokens from `design.md` | ⬜ |
| MongoDB Atlas setup | Create cluster, whitelist IPs, get connection string | ⬜ |
| Mongoose connection | `config/db.js` with retry logic | ⬜ |
| Environment config | `.env` files for dev/prod, `.env.example` committed | ⬜ |
| Git repo setup | Monorepo or separate repos, `.gitignore`, README | ⬜ |
| Framer Motion setup | Import `motion.js` variants from design system | ⬜ |
| Sidebar + Layout shell | `Sidebar.jsx`, `Header.jsx`, `PageWrapper.jsx` | ⬜ |
| Firebase project setup | Create Firebase project, enable Google auth provider | ⬜ |

---

### Sprint 1: Authentication & User Management (Week 1)

| Task | Details | FR Ref |
|------|---------|--------|
| User model + validation | Schema per §9.1, bcrypt pre-save hook | FR-01 |
| Register endpoint | POST `/api/auth/register` with validation | FR-01 |
| Login endpoint | POST `/api/auth/login` → JWT issuance | FR-01 |
| JWT middleware | `verifyJWT` + `checkRole` middleware chain | FR-04 |
| Firebase Admin SDK | Server-side Firebase token verification | FR-02 |
| Google OAuth flow | Firebase client → server token exchange → JWT | FR-02 |
| Token refresh | Refresh token rotation with HTTP-only cookies | FR-03 |
| Login page UI | Gradient background, form, Google button (per `design.md`) | FR-01, FR-02 |
| Register page UI | Patient self-registration form | FR-07 |
| Auth Context | `AuthContext.jsx` with `useAuth` hook | FR-01 |
| ProtectedRoute component | Role-based route guard | FR-04 |
| Admin: User CRUD | Create doctor/receptionist, list, edit, deactivate | FR-05 |
| User management page | Admin-only table with role badges | FR-05 |

**Sprint 1 Exit Criteria:**
- ✅ User can register with email/password
- ✅ User can log in with Google
- ✅ JWT issued and validated on protected routes
- ✅ Admin can create and manage staff accounts
- ✅ Non-admin users are blocked from admin routes (API + UI)

---

### Sprint 2: Patient Module (Week 2)

| Task | Details | FR Ref |
|------|---------|--------|
| Patient model | Schema per §9.2 with PII encryption | FR-06 |
| Patient ID generator | Auto-increment `HT-P0001` format | FR-06 |
| PII encryption utility | AES-256 for phone, address, emergency contact | NFR-08 |
| Patient CRUD endpoints | POST, GET, PUT, DELETE (soft) with validation | FR-06, FR-10 |
| Patient search API | Text index on name + phone, filtered queries | FR-08 |
| Patient registration form | Multi-field form with validation | FR-06 |
| Patient directory page | Searchable table with filters, pagination | FR-08 |
| Patient profile page | Tabbed view: Info, Appointments, Prescriptions, Billing | FR-09 |
| Self-registration flow | Patient portal registration → "Unverified" badge | FR-07 |
| Receptionist verification | Verify button to confirm patient identity | FR-07 |

**Sprint 2 Exit Criteria:**
- ✅ Receptionist can register a patient with all required fields
- ✅ Search returns results in < 500ms
- ✅ Patient profile shows complete history (empty for now)
- ✅ PII fields are encrypted in MongoDB documents

---

### Sprint 3: Appointment Scheduling (Week 3)

| Task | Details | FR Ref |
|------|---------|--------|
| Appointment model | Schema per §9.3, compound unique index | FR-11 |
| Book appointment API | POST with double-booking check | FR-11, FR-12 |
| Availability check API | GET available slots for doctor + date | FR-12 |
| Status transition API | PATCH with state machine validation | FR-14 |
| Cancel appointment API | 24-hour policy enforcement | FR-15 |
| Booking form UI | Doctor dropdown, date picker, time slot grid | FR-11 |
| Conflict feedback UI | Show alternative slots when conflict detected | FR-12 |
| Appointment list page | Filterable table with status badges | FR-14 |
| Doctor calendar view | Daily/weekly view, color-coded by status | FR-13 |
| Patient: My Appointments | Patient's own upcoming/past appointments | FR-11 |

**Sprint 3 Exit Criteria:**
- ✅ Double-booking is impossible (API rejects + UI shows alternatives)
- ✅ Doctor sees daily schedule with color-coded statuses
- ✅ Status transitions follow the defined state machine
- ✅ Patients can book and cancel (with 24h policy)

---

### Sprint 4: Prescriptions & Billing (Week 4)

| Task | Details | FR Ref |
|------|---------|--------|
| Prescription model | Schema per §9.4 | FR-16 |
| Create prescription API | POST linked to appointment | FR-16 |
| Edit prescription API | PUT with 24h lock check | FR-17 |
| Auto-lock cron/check | Lock prescriptions after 24h | FR-17 |
| Prescription form UI | Diagnosis + dynamic medication list (add/remove rows) | FR-16 |
| Prescription view/print | Formatted view with `@media print` styles | FR-18 |
| Invoice model | Schema per §9.5 | FR-19 |
| Invoice CRUD API | POST, GET, PATCH payment status | FR-19 |
| Auto-populate fee | Consultation fee from doctor profile | FR-20 |
| Invoice generation form | Patient select, itemized charges, totals | FR-19 |
| Invoice list page | Filterable table with payment status badges | FR-19 |
| Patient: My Invoices | Patient sees own billing history | FR-19 |

**Sprint 4 Exit Criteria:**
- ✅ Doctor can write and edit prescriptions (within 24h)
- ✅ Patient can view and print prescriptions
- ✅ Receptionist can generate itemized invoices
- ✅ Payment status tracking works end-to-end

---

### Sprint 5: Dashboard & Analytics (Week 5)

| Task | Details | FR Ref |
|------|---------|--------|
| Dashboard aggregation APIs | MongoDB `$group`, `$match`, `$project` pipelines | FR-21 |
| KPI stat cards | Total Patients, Today's Appts, Revenue, Pending, Active Doctors | FR-21 |
| Revenue trend chart | Recharts LineChart (last 6 months) | FR-22 |
| Department doughnut chart | Recharts PieChart | FR-22 |
| Appointment bar chart | Weekly status breakdown | FR-22 |
| Staggered animations | Apply `staggerContainer` + `fadeIn` to dashboard cards | NFR-14 |
| CSV export | Client-side CSV generation from API data | FR-23 |
| Doctor personal dashboard | Doctor's own patient count, appointment stats | FR-22 |
| Patient portal dashboard | Upcoming appointments, recent prescriptions | — |
| Dashboard auto-refresh | 30-second polling or manual refresh button | NFR-04 |

**Sprint 5 Exit Criteria:**
- ✅ Admin dashboard loads with real data in < 2.5 seconds
- ✅ Charts are interactive (hover tooltips, click-through)
- ✅ CSV export produces valid, downloadable files
- ✅ Dashboard animations are smooth and performant

---

### Sprint 6: Polish, Testing & Deployment (Week 6)

| Task | Details | Priority |
|------|---------|----------|
| Responsive QA | Test all pages at 320px, 768px, 1024px, 1280px | P0 |
| Cross-browser testing | Chrome, Firefox, Safari, Edge | P0 |
| Security audit | Test RBAC bypass attempts, SQL/NoSQL injection, XSS | P0 |
| Rate limiter testing | Verify 100 req/min limit per IP | P1 |
| Error handling review | All API errors return consistent JSON format | P0 |
| Loading states | Skeleton loaders for tables and charts | P1 |
| Empty states | Friendly illustrations when no data exists | P1 |
| 404 page | Custom NotFound page with navigation back | P1 |
| Vercel deployment | Frontend CI/CD, environment variables, custom domain | P0 |
| Render deployment | Backend CI/CD, env vars, health check endpoint | P0 |
| MongoDB Atlas production | Network access, connection string rotation | P0 |
| CORS configuration | Lock down to Vercel domain only | P0 |
| README documentation | Setup instructions, API docs link, screenshots | P1 |
| Demo data seeder | Script to populate sample patients, appointments | P2 |

**Sprint 6 Exit Criteria:**
- ✅ Application fully functional in production environment
- ✅ All pages responsive down to 320px
- ✅ No critical/high-severity security vulnerabilities
- ✅ LCP < 2.5s on production (measured via Lighthouse)
- ✅ README with setup instructions and screenshots

---

### Gantt Summary

```
Week   │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun │
───────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Wk 0   │ S0  │ S0  │ S0  │ S1 ─────────────────── │
Wk 1   │ S1 ────────────────────────────────────── │  Auth & Users
Wk 2   │ S2 ────────────────────────────────────── │  Patients
Wk 3   │ S3 ────────────────────────────────────── │  Appointments
Wk 4   │ S4 ────────────────────────────────────── │  Rx & Billing
Wk 5   │ S5 ────────────────────────────────────── │  Dashboard
Wk 6   │ S6 ────────────────────────────────────── │  Polish & Deploy
```

---

## 12. Risks & Mitigations

| # | Risk | Probability | Impact | Mitigation |
|---|------|:-----------:|:------:|------------|
| R1 | Render free tier cold starts (30s delay after sleep) | High | Medium | Implement a cron ping every 14 minutes using external monitoring (UptimeRobot). Show loading skeleton on frontend during cold start. |
| R2 | MongoDB Atlas M0 (free) limitations (512MB storage, 500 connections) | Medium | High | Monitor storage usage. Implement pagination everywhere. Plan migration to M2 ($9/mo) at 80% capacity. |
| R3 | Firebase Auth rate limits on free tier | Low | Medium | Implement client-side retry logic with exponential backoff. Cache auth state to reduce re-authentication calls. |
| R4 | HIPAA compliance gaps (if US-based) | Medium | Critical | HealTrack v1 targets non-US markets. For US expansion, BAA with MongoDB Atlas required + audit logging + data residency controls. Document this as a v2 requirement. |
| R5 | Scope creep (adding features mid-sprint) | High | Medium | Strict adherence to In Scope / Out of Scope (§3). All new features go to v2 backlog. |
| R6 | Single developer bottleneck | High | High | Prioritize P0 features first. Use component-based architecture for parallel development potential. Maintain clear documentation. |
| R7 | PII data breach | Low | Critical | AES-256 encryption for sensitive fields + HTTPS everywhere + HTTP-only cookies + input sanitization. Regular security review at Sprint 6. |

---

## 13. Appendix

### 13.1 Glossary

| Term | Definition |
|------|-----------|
| **RBAC** | Role-Based Access Control — restricts system access based on user roles |
| **JWT** | JSON Web Token — compact, URL-safe token for stateless authentication |
| **PII** | Personally Identifiable Information — data that can identify an individual (name, phone, address) |
| **KPI** | Key Performance Indicator — measurable metric reflecting business objectives |
| **ODM** | Object-Document Mapper — Mongoose maps JS objects to MongoDB documents |
| **LCP** | Largest Contentful Paint — Core Web Vital measuring perceived page load speed |
| **OPD** | Outpatient Department — treats patients who don't stay overnight |
| **CRUD** | Create, Read, Update, Delete — four basic data operations |
| **MVP** | Minimum Viable Product — smallest feature set that delivers core value |

### 13.2 Related Documents

| Document | Path | Description |
|----------|------|-------------|
| Design System | `design.md` | Color palette, typography, component styles, Framer Motion variants |
| Environment Template | `server/.env.example` | Required environment variables |
| API Documentation | `docs/api.md` (v2) | Auto-generated Swagger/OpenAPI docs |

### 13.3 Environment Variables

```env
# ── Server ──
NODE_ENV=production
PORT=5000

# ── MongoDB ──
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/healtrack?retryWrites=true&w=majority

# ── JWT ──
JWT_ACCESS_SECRET=<64-char-random-string>
JWT_REFRESH_SECRET=<64-char-random-string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# ── Firebase Admin ──
FIREBASE_PROJECT_ID=healtrack-xxxxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@healtrack-xxxxx.iam.gserviceaccount.com

# ── Encryption ──
ENCRYPTION_KEY=<32-byte-hex-string>
ENCRYPTION_IV=<16-byte-hex-string>

# ── CORS ──
CLIENT_URL=https://healtrack.vercel.app

# ── Firebase Client (Frontend .env) ──
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=healtrack-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=healtrack-xxxxx
VITE_API_BASE_URL=https://healtrack-api.onrender.com/api
```

---

> **Document Status:** Draft — Ready for Implementation  
> **Next Step:** Stakeholder review → Approve → Begin Sprint 0  
> **Owner:** Abdul Ahad
