--- COPY_THIS_TO_NEXT_SPRINT ---

### ARCH_NOTES.md
# Architecture Notes - Restaurant MERN

## Project Overview
Full-stack restaurant website with reservation system, online ordering, payments, and admin dashboard.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4.x
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query) for server state
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Fetch API with React Query

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens (access + refresh)
- **Validation**: Zod schemas
- **File Upload**: Multer + Cloudinary
- **Payment Processing**: Razorpay integration

### Database Schema
- **Users**: Authentication, profiles, roles (customer/admin)
- **Dishes**: Menu items with categories, pricing, images
- **Reservations**: Table bookings with date/time slots
- **Orders**: Food orders with items, pricing, status tracking
- **Coupons**: Discount codes with usage limits
- **Reviews**: User reviews with ratings and approval system

### Infrastructure
- **Development**: Local (MongoDB Atlas, localhost servers)
- **Production**: Backend on Render.com, Frontend on Vercel
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Storage**: Cloudinary for image management
- **Monitoring**: TBD (Sprint 5)

## Monorepo Structure
restaurant-mern/
├── apps/
│ ├── frontend/ # React application
│ └── backend/ # Express API server
├── packages/
│ └── shared/ # Shared types and schemas
├── scripts/ # Automation scripts
├── .env.example # Environment template
├── openapi.yaml # API specification
└── package.json # Workspace configuration


## Security Considerations
- JWT tokens with secure httpOnly refresh cookies
- Input validation with Zod on both client and server
- Rate limiting on API endpoints
- CORS configuration for production domains
- Helmet.js for security headers
- Password hashing with bcryptjs (salt rounds: 12)

## Performance Optimizations
- React Query for efficient data fetching and caching
- Image optimization through Cloudinary
- Compression middleware for API responses
- Code splitting and lazy loading (TBD)
- Database indexing on frequently queried fields

## Development Workflow
1. **Sprint 0**: Scaffolding and contracts (COMPLETED)
2. **Sprint 1**: Backend core (auth, DB, models, seed)
3. **Sprint 2**: Frontend scaffolding (theme, routing, layout)
4. **Sprint 2.5**: Refactor and enforce contracts
5. **Sprint 3**: Reservations and coupons system
6. **Sprint 4**: Reviews, admin dashboard, payments
7. **Sprint 4.5**: Optimization and asset management
8. **Sprint 5**: Production deployment and CI/CD
9. **Sprint 6**: Disaster recovery and maintenance

## Key Decisions Made
- **Monorepo**: Simplifies development and shared code management
- **TypeScript**: Type safety across the entire stack
- **Zod**: Runtime validation that generates TypeScript types
- **React Query**: Eliminates need for Redux for server state
- **Tailwind**: Utility-first CSS for rapid development
- **JWT Strategy**: Access token (15min) + refresh token (7 days)
- **Currency**: INR (Indian Rupees) as default
- **Timezone**: Asia/Kolkata for all date/time operations

## Environment Variables
See `.env.example` for required configuration:
- MongoDB Atlas connection string
- JWT secrets (crypto-generated)
- Cloudinary credentials for image storage
- Unsplash API key for food images
- Razorpay credentials for payment processing

## Testing Strategy
- **Backend**: Jest with Supertest for API testing
- **Frontend**: Vitest for unit tests, React Testing Library
- **E2E**: TBD (possibly Playwright in Sprint 5)
- **Coverage**: Minimum 80% for critical paths

## Deployment Architecture
- **Frontend**: Static build deployed to Vercel with automatic deployments
- **Backend**: Node.js server on Render.com with health checks
- **Database**: MongoDB Atlas with automated backups
- **CDN**: Cloudinary for image delivery with global CDN

## Known Limitations (To Address in Future Sprints)
- No real-time features (WebSocket) for order tracking
- Basic admin dashboard (no advanced analytics)
- Single-tenant architecture (no multi-restaurant support)
- No mobile app (responsive web only)
- Basic email notifications (no SMS)

## Sprint 0 Status: ✅ COMPLETED
- Monorepo scaffolding created
- Backend Express server with health check
- Frontend React + Vite + Tailwind setup
- Shared types and Zod schemas defined
- OpenAPI 3.0 specification created
- Environment configuration template
- PowerShell automation scripts
- Git repository initialized and pushed

### NEXT_STEPS.md
# Next Steps - Restaurant MERN

## Sprint 1: Backend Core Implementation

### 🎯 Sprint 1 Goals
Implement core backend functionality including authentication, database models, and API endpoints.

### 📋 Sprint 1 Tasks

#### Authentication System
- [ ] Implement JWT token generation and validation middleware
- [ ] Create login/register endpoints with Zod validation
- [ ] Add refresh token rotation strategy
- [ ] Implement password hashing with bcryptjs
- [ ] Add logout functionality with token blacklisting

#### Database Models
- [ ] Complete User model with authentication methods
- [ ] Create Dish model with category and availability fields
- [ ] Implement Reservation model with date/time validation
- [ ] Add Order model with items and pricing calculation
- [ ] Create Coupon model with usage tracking
- [ ] Implement Review model with approval workflow

#### API Endpoints
- [ ] `/api/v1/auth/*` - Authentication routes
- [ ] `/api/v1/dishes/*` - Menu management
- [ ] `/api/v1/users/profile` - User profile management
- [ ] Basic CRUD operations for all models

#### Database & Seeding
- [ ] Enhanced seed script with sample dishes and coupons
- [ ] Database indexing for performance
- [ ] Connection pooling configuration
- [ ] Error handling and validation

#### Testing
- [ ] Unit tests for authentication middleware
- [ ] Integration tests for auth endpoints
- [ ] Model validation tests
- [ ] API response format tests

### 🔧 Technical Requirements
- All passwords must be hashed with bcryptjs (12 salt rounds)
- JWT tokens: access (15min), refresh (7 days)
- Input validation with Zod on all endpoints
- Proper HTTP status codes and error responses
- Rate limiting on authentication endpoints

### 📦 Expected Deliverables
- Working authentication system
- Complete database models with validation
- Seed script with realistic test data
- Test suite with >80% coverage for auth module
- Updated OpenAPI specification
- Postman collection for API testing

### 🚦 Sprint 1 Success Criteria
- [ ] User can register and login successfully
- [ ] JWT tokens are properly generated and validated
- [ ] Database seed creates admin user and sample data
- [ ] All authentication tests pass
- [ ] API endpoints return consistent response format
- [ ] Health check endpoint shows database connection status

### ⚠️ Blockers & Dependencies
- MongoDB Atlas connection string required in `.env`
- JWT secrets must be generated and added to environment
- Shared package must be built before backend development

### 🔄 Handoff to Sprint 2
After Sprint 1 completion:
- Backend API will be fully functional for authentication
- Database will be seeded with test data
- Frontend can begin implementing login/register forms
- Shared types will be validated against actual API responses

---

## Long-term Roadmap (Sprints 2-6)

### Sprint 2: Frontend Foundation
- React component library setup
- Authentication context and protected routes
- Layout components and theme switching
- Form components with validation

### Sprint 3: Core Features
- Reservation system with calendar integration
- Menu display with filtering and search
- Shopping cart functionality
- Coupon application logic

### Sprint 4: Advanced Features
- Payment integration with Razorpay
- Review and rating system
- Admin dashboard with metrics
- User profile management

### Sprint 5: Production Deployment
- CI/CD pipeline with GitHub Actions
- Environment configuration for production
- Database migrations and backups
- Error monitoring and logging

### Sprint 6: Quality & Maintenance
- End-to-end testing
- Performance optimization
- Security audit
- Documentation and handover

## Current Status: Sprint 0 ✅ COMPLETED

### What's Working
- ✅ Monorepo structure with proper workspace configuration
- ✅ Backend Express server with health check endpoint
- ✅ Frontend React application with Tailwind CSS
- ✅ Shared types and Zod schemas
- ✅ Environment configuration template
- ✅ PowerShell automation scripts
- ✅ Git repository with initial commit

### What's Next
1. **Immediate (Sprint 1)**: Implement backend authentication system
2. **Short-term (Sprint 2)**: Build frontend authentication UI
3. **Medium-term (Sprint 3-4)**: Core restaurant features
4. **Long-term (Sprint 5-6)**: Production deployment and optimization

### Key Decisions Pending
- Email service provider for notifications (Sprint 4)
- Error monitoring service selection (Sprint 5)
- Analytics and metrics tracking (Sprint 4-5)
- Mobile responsiveness testing strategy (Sprint 2-3)

### Resources Needed
- MongoDB Atlas cluster (already setup guide provided)
- Cloudinary account for image management
- Razorpay account for payment processing
- Unsplash API key for food images
- Vercel and Render accounts for deployment (Sprint 5)

--- COPY_THIS_TO_NEXT_SPRINT ---

### .env.example CONTENTS
# Database
MONGO_URI=

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=
JWT_REFRESH_SECRET=

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Unsplash API (Food Images)
UNSPLASH_ACCESS_KEY=

# Razorpay (Payments)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Frontend URL (for CORS)
VITE_API_BASE_URL=http://localhost:5000/api/v1

### SEED SCRIPT STATUS
✅ Admin user creation: apps/backend/src/scripts/seed.ts
✅ Default credentials: admin@example.com / Admin@123
✅ Hashed password with bcryptjs (12 salt rounds)


# Architecture Notes - Restaurant MERN

## Project Overview
Full-stack restaurant website with reservation system, online ordering, payments, and admin dashboard.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4.x
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query) for server state
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Fetch API with React Query

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens (access + refresh)
- **Validation**: Zod schemas
- **File Upload**: Multer + Cloudinary
- **Payment Processing**: Razorpay integration

### Database Schema
- **Users**: Authentication, profiles, roles (customer/admin)
- **Dishes**: Menu items with categories, pricing, images
- **Reservations**: Table bookings with date/time slots
- **Orders**: Food orders with items, pricing, status tracking
- **Coupons**: Discount codes with usage limits
- **Reviews**: User reviews with ratings and approval system

### Infrastructure
- **Development**: Local (MongoDB Atlas, localhost servers)
- **Production**: Backend on Render.com, Frontend on Vercel
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Storage**: Cloudinary for image management
- **Monitoring**: TBD (Sprint 5)

## Monorepo Structure
restaurant-mern/
├── apps/
│ ├── frontend/ # React application
│ └── backend/ # Express API server
├── packages/
│ └── shared/ # Shared types and schemas
├── scripts/ # Automation scripts
├── .env.example # Environment template
├── openapi.yaml # API specification
└── package.json # Workspace configuration


## Security Considerations
- JWT tokens with secure httpOnly refresh cookies
- Input validation with Zod on both client and server
- Rate limiting on API endpoints
- CORS configuration for production domains
- Helmet.js for security headers
- Password hashing with bcryptjs (salt rounds: 12)

## Performance Optimizations
- React Query for efficient data fetching and caching
- Image optimization through Cloudinary
- Compression middleware for API responses
- Code splitting and lazy loading (TBD)
- Database indexing on frequently queried fields

## Development Workflow
1. **Sprint 0**: Scaffolding and contracts (COMPLETED)
2. **Sprint 1**: Backend core (auth, DB, models, seed)
3. **Sprint 2**: Frontend scaffolding (theme, routing, layout)
4. **Sprint 2.5**: Refactor and enforce contracts
5. **Sprint 3**: Reservations and coupons system
6. **Sprint 4**: Reviews, admin dashboard, payments
7. **Sprint 4.5**: Optimization and asset management
8. **Sprint 5**: Production deployment and CI/CD
9. **Sprint 6**: Disaster recovery and maintenance

## Key Decisions Made
- **Monorepo**: Simplifies development and shared code management
- **TypeScript**: Type safety across the entire stack
- **Zod**: Runtime validation that generates TypeScript types
- **React Query**: Eliminates need for Redux for server state
- **Tailwind**: Utility-first CSS for rapid development
- **JWT Strategy**: Access token (15min) + refresh token (7 days)
- **Currency**: INR (Indian Rupees) as default
- **Timezone**: Asia/Kolkata for all date/time operations

## Environment Variables
See `.env.example` for required configuration:
- MongoDB Atlas connection string
- JWT secrets (crypto-generated)
- Cloudinary credentials for image storage
- Unsplash API key for food images
- Razorpay credentials for payment processing

### Monitoring & Logging Strategy
- **Error Tracking**: Sentry for real-time error monitoring and alerting
- **Application Logs**: Winston for structured logging with log rotation
- **Performance Monitoring**: PM2 for process monitoring and auto-restarts  
- **Database Monitoring**: MongoDB Atlas built-in monitoring
- **Infrastructure Monitoring**: TBD - evaluate New Relic vs DataDog in Sprint 5
- **Implementation Timeline**: Sprint 5 (Production deployment phase)

## Testing Strategy
- **Backend**: Jest with Supertest for API testing
- **Frontend**: Vitest for unit tests, React Testing Library
- **E2E**: TBD (possibly Playwright in Sprint 5)
- **Coverage**: Minimum 80% for critical paths

## Deployment Architecture
- **Frontend**: Static build deployed to Vercel with automatic deployments
- **Backend**: Node.js server on Render.com with health checks
- **Database**: MongoDB Atlas with automated backups
- **CDN**: Cloudinary for image delivery with global CDN

## Known Limitations (To Address in Future Sprints)
- No real-time features (WebSocket) for order tracking
- Basic admin dashboard (no advanced analytics)
- Single-tenant architecture (no multi-restaurant support)
- No mobile app (responsive web only)
- Basic email notifications (no SMS)

## Sprint 0 Status: ✅ COMPLETED
- Monorepo scaffolding created
- Backend Express server with health check
- Frontend React + Vite + Tailwind setup
- Shared types and Zod schemas defined
- OpenAPI 3.0 specification created
- Environment configuration template
- PowerShell automation scripts
- Git repository initialized and pushed

# Next Steps - Restaurant MERN

## Sprint 1: Backend Core Implementation

### 🎯 Sprint 1 Goals
Implement core backend functionality including authentication, database models, and API endpoints.

### 📋 Sprint 1 Tasks

#### Authentication System
- [ ] Implement JWT token generation and validation middleware
- [ ] Create login/register endpoints with Zod validation
- [ ] Add refresh token rotation strategy
- [ ] Implement password hashing with bcryptjs
- [ ] Add logout functionality with token blacklisting

#### Database Models
- [ ] Complete User model with authentication methods
- [ ] Create Dish model with category and availability fields
- [ ] Implement Reservation model with date/time validation
- [ ] Add Order model with items and pricing calculation
- [ ] Create Coupon model with usage tracking
- [ ] Implement Review model with approval workflow

#### API Endpoints
- [ ] `/api/v1/auth/*` - Authentication routes
- [ ] `/api/v1/dishes/*` - Menu management
- [ ] `/api/v1/users/profile` - User profile management
- [ ] Basic CRUD operations for all models

#### Database & Seeding
- [ ] Enhanced seed script with sample dishes and coupons
- [ ] Database indexing for performance
- [ ] Connection pooling configuration
- [ ] Error handling and validation

#### Testing
- [ ] Unit tests for authentication middleware
- [ ] Integration tests for auth endpoints
- [ ] Model validation tests
- [ ] API response format tests

### 🔧 Technical Requirements
- All passwords must be hashed with bcryptjs (12 salt rounds)
- JWT tokens: access (15min), refresh (7 days)
- Input validation with Zod on all endpoints
- Proper HTTP status codes and error responses
- Rate limiting on authentication endpoints

### 📦 Expected Deliverables
- Working authentication system
- Complete database models with validation
- Seed script with realistic test data
- Test suite with >80% coverage for auth module
- Updated OpenAPI specification
- Postman collection for API testing

### 🚦 Sprint 1 Success Criteria
- [ ] User can register and login successfully
- [ ] JWT tokens are properly generated and validated
- [ ] Database seed creates admin user and sample data
- [ ] All authentication tests pass
- [ ] API endpoints return consistent response format
- [ ] Health check endpoint shows database connection status

### ⚠️ Blockers & Dependencies
- MongoDB Atlas connection string required in `.env`
- JWT secrets must be generated and added to environment
- Shared package must be built before backend development

### 🔄 Handoff to Sprint 2
After Sprint 1 completion:
- Backend API will be fully functional for authentication
- Database will be seeded with test data
- Frontend can begin implementing login/register forms
- Shared types will be validated against actual API responses

---

## Long-term Roadmap (Sprints 2-6)

### Sprint 2: Frontend Foundation
- React component library setup
- Authentication context and protected routes
- Layout components and theme switching
- Form components with validation

### Sprint 3: Core Features
- Reservation system with calendar integration
- Menu display with filtering and search
- Shopping cart functionality
- Coupon application logic

### Sprint 4: Advanced Features
- Payment integration with Razorpay
- Review and rating system
- Admin dashboard with metrics
- User profile management

### Sprint 5: Production Deployment
- CI/CD pipeline with GitHub Actions
- Environment configuration for production
- Database migrations and backups
- Error monitoring and logging

### Sprint 6: Quality & Maintenance
- End-to-end testing
- Performance optimization
- Security audit
- Documentation and handover

## Current Status: Sprint 0 ✅ COMPLETED

### What's Working
- ✅ Monorepo structure with proper workspace configuration
- ✅ Backend Express server with health check endpoint
- ✅ Frontend React application with Tailwind CSS
- ✅ Shared types and Zod schemas
- ✅ Environment configuration template
- ✅ PowerShell automation scripts
- ✅ Git repository with initial commit

### What's Next
1. **Immediate (Sprint 1)**: Implement backend authentication system
2. **Short-term (Sprint 2)**: Build frontend authentication UI
3. **Medium-term (Sprint 3-4)**: Core restaurant features
4. **Long-term (Sprint 5-6)**: Production deployment and optimization

### Key Decisions Pending
- Email service provider for notifications (Sprint 4)
- Error monitoring service selection (Sprint 5)
- Analytics and metrics tracking (Sprint 4-5)
- Mobile responsiveness testing strategy (Sprint 2-3)

### Resources Needed
- MongoDB Atlas cluster (already setup guide provided)
- Cloudinary account for image management
- Razorpay account for payment processing
- Unsplash API key for food images
- Vercel and Render accounts for deployment (Sprint 5)


### REPO_STRUCTURE
restaurant-mern/
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   └── Layout.tsx
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.tsx
│   │   │   │   └── NotFoundPage.tsx
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   ├── contexts/
│   │   │   ├── __tests__/
│   │   │   │   └── App.test.tsx
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── postcss.config.js
│   └── backend/
│       ├── src/
│       │   ├── models/
│       │   │   └── User.ts
│       │   ├── routes/
│       │   ├── middleware/
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── utils/
│       │   │   └── config.ts
│       │   ├── scripts/
│       │   │   └── seed.ts
│       │   ├── __tests__/
│       │   │   └── health.test.ts
│       │   └── server.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── jest.config.js
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── types.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── scripts/
│   ├── auto-setup.ps1
│   └── download-assets.ps1
├── .env.example
├── ARCH_NOTES.md
├── NEXT_STEPS.md
├── openapi.yaml
├── package.json
├── tsconfig.json
└── README.md

--- END COPY_THIS_TO_NEXT_SPRINT ---
