# Madarik Server

NestJS GraphQL API server for the Madarik real estate platform.

## Features

- **GraphQL API** with Apollo Server
- **Authentication** with JWT
- **Database** with Prisma and PostgreSQL
- **Bilingual Support** (Arabic/English)
- **Role-based Access Control** (Visitor/Buyer, Company Member, Company Owner)

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database URL and other configuration.

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Seed the database with initial data
   npm run prisma:seed
   ```

4. **Start the development server:**
   ```bash
   npm run start:dev
   ```

The server will be running at:
- **API**: http://localhost:4000
- **GraphQL Playground**: http://localhost:4000/graphql

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run prisma:seed` | Seed database with initial data |
| `npm run db:reset` | Reset database and run migrations |

## Project Structure

```
src/
├── auth/           # Authentication module
├── user/           # User management
├── company/        # Company management
├── listing/        # Property listings
├── prisma/         # Database service
├── common/         # Shared utilities
│   ├── decorators/ # Custom decorators
│   ├── guards/     # Auth guards
│   └── dto/        # Data transfer objects
└── main.ts         # Application entry point
```

## GraphQL Schema

The GraphQL schema is automatically generated and available at `/graphql`. Key types include:

- **User**: User accounts and authentication
- **Company**: Real estate companies
- **Listing**: Property listings with multilingual support
- **Auth**: Authentication mutations (register, login)

## Database Schema

The database uses Prisma with PostgreSQL and includes:

- Multi-language support for listings
- Role-based access control
- Audit logging for listing status changes
- Comprehensive indexing for search performance

## Development

### Adding New Features

1. Create a new module: `nest g module feature-name`
2. Add service: `nest g service feature-name`
3. Add resolver: `nest g resolver feature-name`
4. Update the main app module

### Database Changes

1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Update TypeScript types as needed

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Production Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Run database migrations: `npm run prisma:deploy`
4. Start the server: `npm run start:prod`

## License

Private - Madarik Real Estate Platform