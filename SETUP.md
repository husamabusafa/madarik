# Madarik Real Estate Platform - Setup Guide

This document provides a complete setup guide for the Madarik real estate platform, including both the NestJS backend server and the React frontend client.

## Project Structure

```
madarik/
├── BRD.md                 # Business Requirements Document
├── SETUP.md              # This setup guide
├── client/               # React frontend (Vite + TypeScript)
│   ├── src/
│   ├── package.json
│   └── ...
└── server/               # NestJS backend (GraphQL + Prisma)
    ├── src/
    │   ├── auth/         # Authentication module
    │   ├── user/         # User management
    │   ├── company/      # Company management
    │   ├── listing/      # Property listings
    │   ├── prisma/       # Database service
    │   └── common/       # Shared utilities
    ├── prisma/
    │   ├── schema.prisma # Database schema
    │   └── seed.ts       # Database seeding
    ├── package.json
    └── README.md
```

## Backend Server (NestJS + GraphQL + Prisma)

### Features Implemented

✅ **Core Architecture**
- NestJS framework with TypeScript
- GraphQL API with Apollo Server
- Prisma ORM with PostgreSQL
- JWT-based authentication
- Role-based access control

✅ **Database Schema**
- Complete Prisma schema matching the BRD requirements
- Multi-language support (Arabic/English)
- User management with email verification
- Company and team management
- Listing management with status workflow
- Amenities, media assets, leads, and favorites
- Audit logging for listing status changes

✅ **Authentication System**
- User registration and login
- JWT token generation and validation
- Password hashing with bcryptjs
- Email verification tokens
- Password reset tokens

✅ **Core Modules**
- **User Module**: User management and profile
- **Auth Module**: Authentication and authorization
- **Company Module**: Company creation and team management
- **Listing Module**: Property listing management
- **Prisma Module**: Database connection and service

✅ **GraphQL Schema**
- Auto-generated schema with code-first approach
- Type-safe resolvers and DTOs
- Input validation with class-validator
- Proper error handling

### Quick Start

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your PostgreSQL database URL and other settings.

4. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Seed the database with initial data (amenities)
   npm run prisma:seed
   ```

5. **Start the development server:**
   ```bash
   npm run start:dev
   ```

The server will be available at:
- **API**: http://localhost:3100
- **GraphQL Playground**: http://localhost:3100/graphql

## Frontend Client (React + Vite + TypeScript)

### Current Status

The frontend is initialized with:
- React 18 with TypeScript
- Vite for fast development and building
- Modern tooling setup (ESLint, etc.)

### Next Steps for Frontend

The frontend needs to be developed to include:

1. **Authentication UI**
   - Login/Register forms
   - Email verification flow
   - Password reset flow

2. **Company Management**
   - Company creation wizard
   - Team invitation system
   - Company dashboard

3. **Listing Management**
   - Listing creation/editing forms
   - Media upload functionality
   - Status management workflow

4. **Public Listing Views**
   - Search and filter interface
   - Interactive map integration
   - Listing detail pages
   - Lead capture forms

5. **Bilingual Support**
   - Arabic/English language switching
   - RTL/LTR layout support
   - Localized content

## Database Schema Overview

The database includes the following main entities:

- **User**: User accounts with authentication
- **Company**: Real estate companies
- **CompanyMember**: Team membership with roles
- **CompanyInvite**: Email invitations for team members
- **Listing**: Property listings with multilingual support
- **ListingTranslation**: Localized content for listings
- **Amenity**: System-wide amenity taxonomy
- **MediaAsset**: Photos and videos for listings
- **Lead**: Contact inquiries from potential buyers
- **Favorite**: User's saved listings

## Key Features Supported

### Authentication & Authorization
- Email/password authentication
- JWT tokens with configurable expiration
- Role-based access (Visitor, Company Member, Company Owner)
- Email verification workflow

### Company Management
- Company creation with owner assignment
- Team invitation system with email tokens
- Role-based permissions (Owner vs Member)
- Company profile management

### Listing Management
- Draft → Ready to Publish → Published workflow
- Owner-controlled publishing (no admin approval)
- Multilingual content support (Arabic/English)
- Geocoding integration ready
- Media asset management
- Amenity tagging system

### Search & Discovery
- Database structure ready for complex filtering
- Geographic search capabilities
- Full-text search support
- Sorting and pagination

## Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/madarik?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# App
NODE_ENV="development"
PORT=3100

# Email (configure with your email service)
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
FROM_EMAIL="noreply@madarik.com"
FROM_NAME="Madarik"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5100"
```

## Development Workflow

### Backend Development

1. **Database Changes:**
   - Update `prisma/schema.prisma`
   - Run `npm run prisma:migrate`
   - Update TypeScript types as needed

2. **Adding New Features:**
   - Create new modules with `nest g module feature-name`
   - Add services and resolvers
   - Update the main app module

3. **Testing:**
   ```bash
   npm run test        # Unit tests
   npm run test:e2e    # End-to-end tests
   npm run test:cov    # Coverage report
   ```

### Database Management

```bash
# View database in browser
npm run prisma:studio

# Reset database (development only)
npm run db:reset

# Deploy migrations (production)
npm run prisma:deploy
```

## Production Deployment

### Backend Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Run database migrations: `npm run prisma:deploy`
4. Start the server: `npm run start:prod`

### Database Considerations

- Use connection pooling for production
- Set up regular backups
- Configure monitoring and alerts
- Consider read replicas for scaling

## Next Development Phases

### Phase 1: Complete Backend API
- [ ] Complete all GraphQL resolvers
- [ ] Implement email service integration
- [ ] Add file upload for media assets
- [ ] Implement geocoding service
- [ ] Add comprehensive error handling
- [ ] Write unit and integration tests

### Phase 2: Frontend Development
- [ ] Set up GraphQL client (Apollo Client)
- [ ] Implement authentication flows
- [ ] Build company management interface
- [ ] Create listing management system
- [ ] Develop public search interface
- [ ] Integrate map functionality

### Phase 3: Advanced Features
- [ ] Real-time notifications
- [ ] Advanced search with Elasticsearch
- [ ] Image optimization and CDN
- [ ] Analytics and reporting
- [ ] Mobile app development

## Support and Documentation

- **BRD**: See `BRD.md` for complete business requirements
- **Server README**: See `server/README.md` for detailed backend documentation
- **Database Schema**: Explore with `npm run prisma:studio`
- **GraphQL Schema**: Available at `/graphql` endpoint when server is running

The foundation is now ready for building the complete Madarik real estate platform! 🏠
