# Madarik Real Estate - NestJS Server

Modern backend API server for the Madarik real estate platform. Built with NestJS, TypeScript, and Prisma.

## Features

- **NestJS Framework**: Scalable Node.js server-side applications
- **Authentication & Authorization**: JWT-based auth with invite-only user management
- **Role-based Access Control**: Admin and Manager roles with different permissions
- **Bilingual Support**: Arabic and English content management
- **Real Estate Listings**: Complete CRUD operations with media and amenities
- **Lead Management**: Lead capture, assignment, and notification system
- **Rate Limiting**: Protection against abuse and spam with @nestjs/throttler
- **Email Integration**: Transactional emails for invites, notifications, and password resets
- **File Upload**: Media asset management with optimization
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Class-validator with DTOs
- **Guards & Strategies**: Passport.js integration for authentication

## Tech Stack

- **Framework**: NestJS 10+
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport.js
- **Email**: Nodemailer
- **Validation**: class-validator & class-transformer
- **File Upload**: Multer + Sharp
- **Security**: Helmet, CORS, Rate limiting

## Architecture

```
src/
├── auth/                # Authentication module
│   ├── dto/            # Data Transfer Objects
│   ├── guards/         # Auth guards (JWT, Roles, Local)
│   ├── strategies/     # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/              # Users management module
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── email/              # Email service module
│   ├── email.service.ts
│   └── email.module.ts
├── database/           # Database module
│   ├── prisma.service.ts
│   ├── database.module.ts
│   └── seed.ts
├── common/             # Shared utilities
│   ├── decorators/     # Custom decorators
│   ├── dto/           # Common DTOs
│   └── interfaces/    # TypeScript interfaces
├── app.module.ts       # Root module
├── app.controller.ts   # Root controller
├── app.service.ts      # Root service
└── main.ts            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- SMTP email service (Gmail, SendGrid, etc.)

### Installation

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/madarik_db"
   JWT_SECRET="your-super-secret-jwt-key"
   SMTP_HOST="smtp.gmail.com"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   # ... other variables
   ```

4. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed initial data (admin user, amenities, etc.)
   npm run db:seed
   ```

5. **Start development server**:
   ```bash
   npm run start:dev
   ```

The server will start on `http://localhost:3100`.

### Initial Admin Credentials

After running the seed script, you can log in with:
- **Email**: `admin@madarik.com`
- **Password**: `Admin123!`

⚠️ **Important**: Change the admin password immediately after first login!

## API Documentation

### Base URL
```
http://localhost:3100/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/auth/login` | Login with email/password | No | - |
| POST | `/auth/logout` | Logout user | No | - |
| POST | `/auth/invite` | Invite new user | Yes | Admin |
| POST | `/auth/accept-invite` | Accept invitation | No | - |
| POST | `/auth/forgot-password` | Request password reset | No | - |
| POST | `/auth/reset-password` | Reset password | No | - |
| GET | `/auth/me` | Get current user | Yes | Any |
| GET | `/auth/invitations` | List invitations | Yes | Admin |
| POST | `/auth/invitations/:id/revoke` | Revoke invitation | Yes | Admin |
| POST | `/auth/invitations/:id/resend` | Resend invitation | Yes | Admin |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/users` | List all users | Yes | Admin |
| GET | `/users/search` | Search users | Yes | Admin |
| GET | `/users/stats` | User statistics | Yes | Admin |
| GET | `/users/for-assignment` | Users for assignment | Yes | Staff |
| GET | `/users/:id` | Get user by ID | Yes | Admin |
| PUT | `/users/:id/role` | Update user role | Yes | Admin |
| PUT | `/users/:id/status` | Toggle user status | Yes | Admin |
| PUT | `/users/profile` | Update own profile | Yes | Any |
| PUT | `/users/:id/profile` | Update user profile | Yes | Admin |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health status |

## NestJS Features Used

### Modules
- **Modular Architecture**: Each feature is organized into modules
- **Global Modules**: Database and Email modules are global
- **Feature Modules**: Auth, Users modules with specific functionality

### Guards
- **JwtAuthGuard**: Protects routes requiring authentication
- **RolesGuard**: Enforces role-based access control
- **LocalAuthGuard**: Handles username/password authentication

### Decorators
- **@Roles()**: Specify required roles for endpoints
- **@CurrentUser()**: Extract current user from request
- **@Throttle()**: Rate limiting configuration

### Pipes
- **ValidationPipe**: Global validation with class-validator
- **Transform**: Automatic type transformation

### Interceptors & Filters
- **Global Exception Filter**: Centralized error handling
- **Throttler**: Rate limiting protection

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed initial data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |

## Environment Variables

Key environment variables (see `env.example` for complete list):

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `SMTP_HOST` | Email server host | Yes |
| `SMTP_USER` | Email username | Yes |
| `SMTP_PASS` | Email password | Yes |
| `CLIENT_URL` | Frontend URL for CORS | Yes |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | Optional |

## Security Features

- **JWT Authentication**: Secure token-based authentication with Passport.js
- **HTTP-only Cookies**: Prevent XSS attacks
- **Rate Limiting**: @nestjs/throttler protection against brute force and spam
- **Input Validation**: class-validator with DTOs
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **CORS Configuration**: Restrict cross-origin requests
- **Helmet Security**: Security headers
- **Password Hashing**: bcrypt with configurable rounds
- **Role-based Guards**: Fine-grained access control

## NestJS Best Practices

### Dependency Injection
```typescript
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}
}
```

### DTOs with Validation
```typescript
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### Guards and Decorators
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Post('invite')
async inviteUser(@CurrentUser() user: ICurrentUser) {
  // Implementation
}
```

### Exception Handling
```typescript
if (!user) {
  throw new NotFoundException('User not found');
}
```

## Development

### Adding New Modules

1. **Generate module**:
   ```bash
   nest generate module listings
   nest generate service listings
   nest generate controller listings
   ```

2. **Create DTOs**:
   ```typescript
   // src/listings/dto/create-listing.dto.ts
   export class CreateListingDto {
     @IsString()
     title: string;
   }
   ```

3. **Implement service logic**:
   ```typescript
   @Injectable()
   export class ListingsService {
     constructor(private prisma: PrismaService) {}
   }
   ```

4. **Add routes with guards**:
   ```typescript
   @Controller('listings')
   @UseGuards(JwtAuthGuard)
   export class ListingsController {
     // Routes
   }
   ```

### Database Changes

1. **Update Prisma schema**: `prisma/schema.prisma`
2. **Push changes**: `npm run db:push` (development)
3. **Create migration**: `npm run db:migrate` (production)
4. **Generate client**: `npm run db:generate`

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set production environment variables**
3. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

4. **Start the server**:
   ```bash
   npm run start:prod
   ```

## License

MIT License - see LICENSE file for details.