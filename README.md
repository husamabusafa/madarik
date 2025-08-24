# Madarik Real Estate Platform

A modern, bilingual (Arabic/English) real estate platform built with NestJS and React. Features invite-only staff management, property listings, lead capture, and comprehensive admin tools.

## 🏗️ Architecture

```
madarik/
├── server/          # NestJS backend API
├── client/          # React frontend
├── start-dev.sh     # Unix/Mac startup script
├── start-dev.bat    # Windows startup script
└── package.json     # Root package with unified scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- SMTP email service (Gmail, SendGrid, etc.)

### 1. Clone and Install

```bash
git clone <repository-url>
cd madarik

# Install all dependencies (server + client)
npm run install:all
```

### 2. Environment Setup

**Server Configuration:**
```bash
cd server
cp env.example .env
# Edit .env with your database and email settings
```

**Client Configuration:**
```bash
cd client
# Client will connect to server at http://localhost:3001 by default
```

### 3. Database Setup

```bash
# From root directory
npm run db:generate  # Generate Prisma client
npm run db:push      # Create database tables
npm run db:seed      # Seed initial data (admin user, amenities)
```

### 4. Start Development Servers

**Single Command (Recommended):**

```bash
# macOS/Linux
npm run dev

# Windows
npm run dev:windows
```

This will start both:
- 🖥️ **Client**: http://localhost:5100
- 🔧 **Server**: http://localhost:3100
- 📊 **API Health**: http://localhost:3100/api/v1/health

**Individual Commands:**
```bash
# Start server only
npm run server:dev

# Start client only  
npm run client:dev
```

### 5. Initial Login

After seeding, log in with:
- **Email**: `admin@madarik.com`
- **Password**: `Admin123!`

⚠️ **Change the admin password immediately after first login!**

## 📋 Available Scripts

### Development
| Command | Description |
|---------|-------------|
| `npm run dev` | Start both server and client (Unix/Mac) |
| `npm run dev:windows` | Start both server and client (Windows) |
| `npm run server:dev` | Start NestJS server only |
| `npm run client:dev` | Start React client only |

### Database
| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed initial data |
| `npm run db:studio` | Open Prisma Studio |

### Build & Deploy
| Command | Description |
|---------|-------------|
| `npm run build:all` | Build server and client |
| `npm run server:build` | Build NestJS server |
| `npm run client:build` | Build React client |

### Setup
| Command | Description |
|---------|-------------|
| `npm run install:all` | Install all dependencies |
| `npm run setup` | Complete setup (install + db setup + seed) |

## 🛠️ Tech Stack

### Backend (NestJS)
- **Framework**: NestJS 10+
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT with Passport.js
- **Email**: Nodemailer
- **Validation**: class-validator
- **Security**: Guards, Rate limiting, CORS

### Frontend (React)
- **Framework**: React 18+ with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State**: Context API / Zustand
- **Forms**: React Hook Form
- **HTTP**: Axios

## 🔐 Authentication & Roles

### User Roles
- **Admin**: Full access (invite users, manage all data)
- **Manager**: Manage listings, leads, site settings
- **Visitor**: Browse listings, submit leads (no login required)

### Authentication Flow
1. **Invite-only**: No public registration
2. **Admin** invites staff via email
3. **Email verification** required
4. **JWT tokens** with HTTP-only cookies
5. **Role-based** access control

## 🏠 Core Features

### Property Management
- ✅ Bilingual listings (Arabic/English)
- ✅ Media gallery with primary photo
- ✅ Amenities and specifications
- ✅ Geocoding and map integration
- ✅ Status workflow (Draft → Ready → Published)

### Lead Management
- ✅ Contact form submissions
- ✅ Lead assignment to staff
- ✅ Email notifications
- ✅ Rate limiting and spam protection

### User Management
- ✅ Invite-only staff onboarding
- ✅ Role management (Admin/Manager)
- ✅ Account activation/deactivation
- ✅ Password reset functionality

### Site Configuration
- ✅ Company profile settings
- ✅ Email notification recipients
- ✅ Amenities management
- ✅ Bilingual content support

## 🌐 Localization

- **Languages**: Arabic (RTL) and English (LTR)
- **URL Structure**: `/ar/...` and `/en/...`
- **Content**: All listings, UI, and emails support both languages
- **SEO**: Proper hreflang tags and localized slugs

## 📊 Database Schema

Key entities:
- **User**: Staff accounts (Admin/Manager)
- **UserInvite**: Invitation system
- **Listing**: Property listings with bilingual content
- **ListingTranslation**: Localized content (AR/EN)
- **Lead**: Customer inquiries
- **Amenity**: Property features
- **SiteSetting**: Company configuration

## 🔒 Security Features

- **JWT Authentication** with HTTP-only cookies
- **Rate limiting** on sensitive endpoints
- **Input validation** with DTOs
- **SQL injection protection** via Prisma
- **CORS configuration**
- **Password hashing** with bcrypt
- **Role-based access control**

## 📁 Project Structure

```
madarik/
├── server/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management
│   │   ├── email/         # Email service
│   │   ├── database/      # Prisma integration
│   │   └── common/        # Shared utilities
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route components
│   │   └── assets/        # Static assets
│   └── package.json
└── package.json           # Root package with unified scripts
```

## 🚀 Deployment

### Development
```bash
npm run dev  # Start both servers
```

### Production
```bash
# Build both applications
npm run build:all

# Start production servers
npm run server:start  # NestJS server
npm run client:preview  # Serve built React app
```

### Environment Variables

**Server (.env):**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/madarik_db"
JWT_SECRET="your-secret-key"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
CLIENT_URL="http://localhost:5100"
```

## 📖 Documentation

- **Server API**: See `server/README.md`
- **Client App**: See `client/README.md`
- **BRD**: See `BRD.md` for detailed requirements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Happy coding! 🎉**

For support or questions, please check the individual README files in the `server/` and `client/` directories.
