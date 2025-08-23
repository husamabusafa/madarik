# Madarik Real Estate Platform

A modern, bilingual (Arabic/English) real estate platform with company-centric selling, built with NestJS GraphQL backend and React frontend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- pnpm 8+

### One-Command Development

```bash
# Install all dependencies and start both client and server
pnpm install
pnpm dev
```

This will start:
- **Frontend (React + Vite)**: http://localhost:5100
- **Backend (NestJS + GraphQL)**: http://localhost:3100
- **GraphQL Playground**: http://localhost:3100/graphql

## 📁 Project Structure

```
madarik/
├── README.md                 # This file
├── BRD.md                   # Business Requirements Document
├── SETUP.md                 # Detailed setup guide
├── package.json             # Root workspace configuration
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── client/                  # React frontend (Vite + TypeScript)
│   ├── src/
│   ├── package.json
│   └── ...
└── server/                  # NestJS backend (GraphQL + Prisma)
    ├── src/
    │   ├── auth/           # Authentication module
    │   ├── user/           # User management
    │   ├── company/        # Company management
    │   ├── listing/        # Property listings
    │   ├── prisma/         # Database service
    │   └── common/         # Shared utilities
    ├── prisma/
    │   ├── schema.prisma   # Database schema
    │   └── seed.ts         # Database seeding
    └── package.json
```

## 🛠️ Available Commands

### Development
```bash
pnpm dev              # Start both client and server
pnpm dev:client       # Start only the frontend
pnpm dev:server       # Start only the backend
```

### Building
```bash
pnpm build            # Build both client and server
pnpm build:client     # Build only the frontend
pnpm build:server     # Build only the backend
```

### Database Management
```bash
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run database migrations
pnpm prisma:studio    # Open Prisma Studio (database GUI)
pnpm prisma:seed      # Seed database with initial data
pnpm db:reset         # Reset database (development only)
```

### Maintenance
```bash
pnpm install:all      # Install dependencies in all workspaces
pnpm clean            # Clean all node_modules and build artifacts
```

## 🏗️ Architecture

### Backend (NestJS + GraphQL + Prisma)
- **Framework**: NestJS with TypeScript
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based access control
- **Features**: User management, company teams, property listings, lead capture

### Frontend (React + Vite + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Modern CSS with responsive design
- **Features**: Bilingual support (Arabic RTL/English LTR), interactive maps, search & filters

## 🌍 Bilingual Support

The platform supports both Arabic and English:
- **Arabic**: Right-to-left (RTL) layout
- **English**: Left-to-right (LTR) layout
- **Content**: Multilingual database schema for listings
- **UI**: Complete translation coverage

## 🔐 Authentication & Roles

### User Roles
- **Visitor/Buyer**: Browse listings, save favorites, submit leads
- **Company Member**: Create/edit listings, view leads
- **Company Owner**: Manage company, invite team members, publish listings, export leads

### Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- Email verification workflow
- Role-based access control
- CORS protection

## 📊 Database Schema

Key entities:
- **Users**: Authentication and profiles
- **Companies**: Real estate companies with team management
- **Listings**: Properties with multilingual content
- **Leads**: Contact inquiries from potential buyers
- **Amenities**: System-wide property features
- **Media Assets**: Photos and videos for listings

## 🚀 Deployment

### Environment Setup

1. **Copy environment files:**
   ```bash
   cp server/.env.example server/.env
   ```

2. **Configure database and services in `.env`:**
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/madarik"
   JWT_SECRET="your-secret-key"
   FRONTEND_URL="http://localhost:5100"
   ```

3. **Set up database:**
   ```bash
   pnpm prisma:migrate
   pnpm prisma:seed
   ```

### Production Build
```bash
pnpm build
```

## 📚 Documentation

- **[BRD.md](./BRD.md)**: Complete business requirements
- **[SETUP.md](./SETUP.md)**: Detailed setup and development guide
- **[Server README](./server/README.md)**: Backend-specific documentation

## 🤝 Development Workflow

1. **Start development:**
   ```bash
   pnpm dev
   ```

2. **Make changes** to either client or server code

3. **Database changes:**
   ```bash
   # Update prisma/schema.prisma
   pnpm prisma:migrate
   ```

4. **View database:**
   ```bash
   pnpm prisma:studio
   ```

## 🎯 Key Features

### ✅ Implemented (Backend)
- Complete GraphQL API foundation
- User authentication and authorization
- Company and team management structure
- Listing management with status workflow
- Database schema with bilingual support
- Input validation and error handling

### 🚧 In Development (Frontend)
- Authentication UI (login/register)
- Company dashboard and team management
- Listing creation and management interface
- Public search and listing views
- Interactive map integration
- Bilingual UI implementation

## 📈 Next Steps

1. **Complete GraphQL resolvers** for all CRUD operations
2. **Implement email service** for verification and notifications
3. **Add file upload** for listing media
4. **Build React frontend** components
5. **Integrate mapping service** (Google Maps/MapBox)
6. **Add real-time features** with subscriptions

## 🏠 About Madarik

Madarik is a modern real estate platform designed for the Middle East market, featuring:
- Company-centric selling model
- Bilingual Arabic/English support
- Team collaboration tools
- Advanced search and filtering
- Interactive map-based discovery
- Lead management system

---

**Ready to build the future of real estate! 🏗️**
# madarik
