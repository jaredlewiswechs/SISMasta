# Micro School OS

The affordable operating system for Texas microschools.

A lightweight, Texas-aware school operations platform for microschools that combines enrollment, family records, attendance, tuition billing, parent communication, student support, and document management in one affordable system.

## Who it's for

- Microschool founders
- Small private schools (20-300 students)
- Hybrid learning pods
- Church schools
- Startup charters
- Charter campuses needing a simpler ops layer

## Core Features

### MVP (v0)
1. **Admissions Pipeline** - Inquiry, Tour, Application, Review, Accept/Waitlist, Enroll
2. **Student & Family Records** - SIS-lite with household-first design
3. **Attendance** - One-click attendance with hybrid/flexible day support
4. **Tuition & Payments** - Plans, invoices, payments, sibling discounts, TEFA tagging
5. **Parent Messaging** - In-app, email, SMS channels
6. **Forms & Document Vault** - E-sign forms, document checklists, expiration alerts
7. **Admin Dashboard** - At-a-glance school operations view

### v1 Expansion
8. **Calendar & Scheduling** - Flexible schedules for hybrid/pod models
9. **Gradebook Lite** - Traditional, mastery, or narrative grading modes
10. **Student Support / Interventions** - Concern logs, intervention plans, follow-ups
11. **TEFA/ESA Workflow Center** - Texas Education Freedom Account expense tracking
12. **Charter Mode** - Auditable admissions, waitlist ordering, compliance features
13. **Analytics** - Enrollment funnels, collection rates, attendance trends
14. **Staff Portal** - Teacher-facing attendance, grades, messaging
15. **Parent Portal** - Family-facing attendance, progress, invoices, documents

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (credentials provider)
- **Payments**: Stripe (planned)
- **SMS**: Twilio (planned)
- **Email**: SendGrid/Postmark (planned)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed demo data
npm run db:seed

# Start development server
npm run dev
```

### Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@brighthorizons.edu | password123 |
| Teacher | teacher@brighthorizons.edu | password123 |
| Parent | martinez@email.com | password123 |

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login/Register pages
│   ├── (dashboard)/      # Admin dashboard pages
│   │   ├── dashboard/    # Main dashboard
│   │   ├── students/     # Student management
│   │   ├── households/   # Family management
│   │   ├── admissions/   # Admissions pipeline
│   │   ├── waitlist/     # Waitlist management
│   │   ├── attendance/   # Daily attendance
│   │   ├── gradebook/    # Progress tracking
│   │   ├── schedule/     # Class schedules
│   │   ├── calendar/     # School calendar
│   │   ├── invoices/     # Billing & invoices
│   │   ├── payments/     # Payment tracking
│   │   ├── tuition-plans/# Tuition plan setup
│   │   ├── messages/     # Parent messaging
│   │   ├── announcements/# School announcements
│   │   ├── interventions/# Student support
│   │   ├── forms/        # Form templates
│   │   ├── documents/    # Document vault
│   │   ├── tefa/         # TEFA/ESA center
│   │   ├── analytics/    # Analytics dashboard
│   │   ├── staff/        # Staff management
│   │   └── settings/     # School settings
│   ├── (portal)/         # Parent portal
│   └── api/              # 30 API routes
├── components/
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                  # Utilities, auth, prisma
└── middleware.ts          # Auth middleware
```

## User Roles

| Role | Access |
|------|--------|
| Super Admin | Full access + billing + settings |
| School Leader | Students, families, comms, admissions, support |
| Teacher | Attendance, grades, messages, support notes |
| Family | Portal: payments, forms, progress, messages |
| Finance Manager | Invoices, receipts, payment reports |

## Texas-Specific Features

- **TEFA/ESA expense tagging** - Track approved education spending categories
- **Receipt vault** - Downloadable expense packets for TEFA compliance
- **Charter mode** - Auditable admissions pipeline with timestamped applications
- **Waitlist compliance** - Ordered waitlists with seat offer tracking
- **Payer types** - Family, Scholarship, TEFA, Sponsor

## License

Proprietary - All rights reserved.
