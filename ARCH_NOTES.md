@'
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
'@ | Out-File -FilePath "ARCH_NOTES.md" -Encoding UTF8
