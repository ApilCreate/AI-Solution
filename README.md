# 🤖 AI Solution - Next-Gen Business Platform

> A cutting-edge full-stack web application showcasing AI-powered business solutions with modern design, comprehensive admin tools, and seamless deployment capabilities.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

## 🌟 Overview

AI Solution is a comprehensive business platform that demonstrates the power of AI technology through an interactive showcase, complete with modern web technologies, real-time analytics, and seamless user experiences. Built with performance and scalability in mind.

### 🎯 What Makes This Special?

- **🚀 Production-Ready**: Optimized for Vercel deployment with built-in analytics
- **🎨 Modern UI/UX**: Glassmorphism design with smooth animations and 3D elements
- **📊 Real-time Analytics**: Comprehensive dashboard with live data visualization
- **🔐 Enterprise Security**: Secure authentication and data protection
- **📱 Mobile-First**: Fully responsive design across all devices
- **⚡ Performance Optimized**: Lazy loading, caching, and bundle optimization

## ✨ Key Features

### 🎨 User Experience
- **Interactive 3D Elements**: Three.js powered animations and visual effects
- **Glassmorphism Design**: Modern glass-effect UI components
- **Smooth Animations**: GSAP and Framer Motion powered transitions
- **Dark/Light Mode**: Persistent theme switching with system preference detection
- **Mobile Responsive**: Optimized for all screen sizes

### 🤖 AI Solutions Showcase
- **Interactive Demos**: Live demonstrations of AI capabilities
- **Solution Categories**: Organized presentation of AI services
- **Demo Booking System**: Users can book personalized AI demonstrations
- **Testimonials**: Customer reviews and success stories
- **Case Studies**: Detailed implementation examples

### 📝 Content Management
- **Dynamic Blog System**: Markdown support with rich text editing
- **Event Management**: Create and manage events with detailed information
- **Contact System**: Advanced inquiry management with tracking
- **Media Gallery**: Optimized image handling with WebP/AVIF support

### 🔧 Admin Dashboard
- **Real-time Analytics**: Live data visualization with charts and metrics
- **Enhanced Backup & Recovery System**: Comprehensive data protection with dual storage
- **Deleted Data Recovery**: Track and recover accidentally deleted records (3-month retention)
- **Database Backup Management**: Create, manage, and restore backups with dynamic date ranges
- **CSV Export & Import**: Full data export capabilities with filtering options
- **Recovery Point Creation**: Disaster recovery points for system restoration
- **Bulk Operations**: Mass recovery and deletion operations with confirmation dialogs
- **Inquiry Management**: Track, filter, and respond to customer inquiries with delete functionality
- **Demo Booking Management**: Manage AI solution demonstration bookings
- **AI Solutions Management**: Create and manage AI service offerings
- **Rating & Testimonial Management**: Handle customer ratings and reviews
- **Content Editor**: Create and manage blog posts and events
- **Email Monitoring**: Track email delivery and engagement rates
- **Data Export**: Export analytics and user data for external analysis
- **System Diagnostics**: Health monitoring and performance metrics
- **Modern Navigation**: Spacious, responsive admin interface with improved UX

### 🔐 Security & Authentication
- **Secure Admin Access**: JWT-based authentication with cookie sessions
- **Input Validation**: Zod schema validation for all user inputs
- **Rate Limiting**: API protection against abuse
- **CSRF Protection**: Built-in Next.js security features
- **Data Sanitization**: XSS and injection prevention

## 🛠️ Technology Stack

### Frontend
```
Next.js 15.4.4          # React framework with App Router
React 19.1.0            # UI library with latest features
TypeScript 5.0          # Type-safe development
Tailwind CSS 3.4        # Utility-first styling
Framer Motion 12.23     # Animation library
GSAP 3.13               # Advanced animations
```

### Backend & Database
```
Neon Database           # Serverless PostgreSQL
Drizzle ORM 0.44       # Type-safe database toolkit
Resend                  # Modern email delivery service
Zod 4.0                 # Schema validation
JWT Authentication      # Secure token-based auth
```

### 3D & Visual Effects
```
Three.js 0.180          # 3D graphics library
React Three Fiber 9.0   # React renderer for Three.js
Spline                   # 3D design platform integration
TSParticles 3.9         # Particle systems
OGL 1.0                 # Lightweight WebGL library
```

### Analytics & Monitoring
```
Vercel Analytics        # Built-in page view tracking
Performance Monitoring  # Real-time performance metrics
Error Tracking          # Comprehensive error logging
User Engagement         # Session and interaction analytics
Recharts 3.2.1         # Advanced chart visualization
```

### Notifications & UX
```
React Hot Toast        # Modern toast notifications
Custom Confirmation    # Toast-based confirmation modals
Activity Logging       # Comprehensive audit trails
```

## 🆕 Recent Updates

### Enhanced Backup & Recovery System
- **Comprehensive Backup Management**: Create backups for all tables or specific tables with dynamic date selection
- **Deleted Data Recovery**: Track and recover accidentally deleted records with 3-month retention
- **CSV Export & Import**: Download backups and deleted data in CSV format with advanced filtering
- **Dual Storage System**: Backups stored both in database and file system for maximum reliability
- **Dynamic Date Ranges**: Automatic detection of actual data ranges for backup creation
- **Recovery Points**: Create special disaster recovery points for critical system restoration
- **Bulk Operations**: Mass recovery and deletion operations with confirmation dialogs
- **Backup Statistics**: Comprehensive dashboard showing backup metrics and health
- **Retention Policies**: Automated cleanup with 6-month backup retention and 3-month deleted data retention
- **Audit Trails**: Complete logging of all backup, recovery, and deletion operations

### Improved Admin Experience
- **Modern Navigation**: Redesigned admin interface with spacious top navigation for desktop
- **Mobile Responsive**: Enhanced mobile sidebar with improved touch interactions
- **Toast Notifications**: Replaced browser alerts with modern toast notifications throughout
- **Enhanced Inquiry Management**: Added delete functionality with confirmation dialogs
- **Realistic Data**: Updated inquiry data with proper categories, countries, and date distribution

### Chart & Analytics Improvements
- **Fixed Chart Display**: Resolved monthly trend chart to show complete date ranges
- **Dynamic Data Range**: Charts now adapt to actual data availability
- **Country Analytics Sync**: Synchronized country data between dashboard and analytics pages
- **Real-time Updates**: Enhanced data fetching for comprehensive chart visualization

### Performance & UX Enhancements
- **Responsive Design**: Fully responsive admin section with improved spacing
- **Error Handling**: Enhanced error messages and debugging capabilities
- **Activity Logging**: Comprehensive tracking of all admin actions
- **Confirmation Modals**: Custom toast-based confirmation system for critical actions

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Neon Database** account (free tier available)
- **Vercel** account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ApilCreate/AI-Solution.git
   cd AI-Solution
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` in the root directory:
   ```env
   # Database (Required)
   DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"
   
   # Email Configuration (Optional)
   RESEND_API_KEY="your_resend_api_key_here"
   FROM_EMAIL="noreply@yourdomain.com"
   ADMIN_EMAIL="admin@yourdomain.com"
   
   # Authentication (Optional)
   JWT_SECRET="your_jwt_secret_key_here"
   ```

4. **Database Setup**
   ```bash
   # Generate schema
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed with sample data
   npm run db:seed
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

6. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
AI-Solution/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 admin/                    # 🔐 Admin panel (protected routes)
│   │   ├── analytics/               # 📊 Analytics dashboard
│   │   ├── blog/                    # 📝 Blog management
│   │   ├── bookings/                # 📅 Demo booking management
│   │   ├── dashboard/               # 🏠 Main admin dashboard
│   │   ├── events/                  # 📅 Event management
│   │   ├── inquiries/               # 📬 Inquiry management
│   │   ├── login/                   # 🔐 Admin authentication
│   │   ├── ratings/                 # ⭐ Rating & testimonial management
│   │   ├── settings/                # ⚙️ System settings
│   │   └── solutions/               # 🤖 AI solutions management
│   ├── 📁 api/                      # 🔌 API endpoints
│   │   ├── activity-logs/           # 📋 Activity logging APIs
│   │   ├── analytics/               # 📊 Analytics APIs
│   │   │   ├── by-country/          # 🌍 Country-based analytics
│   │   │   ├── by-reason/           # 📋 Reason-based analytics
│   │   │   ├── by-source/           # 🔗 Source-based analytics
│   │   │   ├── over-time/           # 📈 Time-series analytics
│   │   │   └── overview/            # 📊 Overview analytics
│   │   ├── auth/                    # 🔐 Authentication APIs
│   │   │   ├── change-password/     # 🔑 Password change
│   │   │   ├── login/               # 🚪 Login endpoint
│   │   │   ├── logout/              # 🚪 Logout endpoint
│   │   │   └── session/             # 👤 Session management
│   │   ├── blogs/                   # 📝 Blog management APIs
│   │   │   └── [id]/                # 📄 Individual blog APIs
│   │   ├── demo-bookings/           # 🎯 Demo booking APIs
│   │   │   └── [id]/                # 📅 Individual booking APIs
│   │   ├── backups/                   # 💾 Backup management APIs
│   │   │   ├── [id]/                # 📄 Individual backup APIs
│   │   │   │   ├── download/        # 📥 Backup download
│   │   │   │   └── restore/         # 🔄 Backup restoration
│   │   │   ├── cleanup/             # 🧹 Cleanup operations
│   │   │   ├── deleted-data/        # 🗑️ Deleted data management
│   │   │   ├── permanent-delete/    # ⚠️ Permanent deletion
│   │   │   ├── recover/             # 🔄 Data recovery
│   │   │   └── table-ranges/        # 📊 Table metadata
│   │   ├── diagnostic/              # 🔍 System diagnostics
│   │   ├── email/                   # 📧 Email APIs
│   │   │   └── status/              # 📊 Email status tracking
│   │   ├── events/                  # 📅 Event management APIs
│   │   │   ├── [id]/                # 📄 Individual event APIs
│   │   │   └── list/                # 📋 Event listing APIs
│   │   ├── export/                  # 📤 Data export APIs
│   │   │   └── inquiries/           # 📬 Inquiry export
│   │   ├── inquiries/               # 📬 Contact form APIs
│   │   │   ├── [id]/                # 📄 Individual inquiry APIs
│   │   │   ├── list/                # 📋 Inquiry listing APIs
│   │   │   └── stats/               # 📊 Inquiry statistics
│   │   ├── ratings/                 # ⭐ Rating & testimonial APIs
│   │   │   └── [id]/                # 📄 Individual rating APIs
│   │   │       └── reply/           # 💬 Rating reply APIs
│   │   ├── solutions/               # 🤖 AI solutions APIs
│   │   │   ├── [id]/                # 📄 Individual solution APIs
│   │   │   └── list/                # 📋 Solution listing APIs
│   │   ├── test-db/                 # 🧪 Database testing
│   │   └── testimonials/            # 💬 Testimonial APIs
│   ├── 📁 blog/                     # 📝 Public blog pages
│   │   ├── [id]/                    # 📄 Individual blog posts
│   │   └── dynamic/                 # 🔄 Dynamic blog routes
│   │       └── [id]/                # 📄 Dynamic blog posts
│   ├── 📁 book-demo/                # 🎯 Demo booking page
│   ├── 📁 contact/                  # 📬 Contact page
│   ├── 📁 contexts/                 # 🎯 React contexts
│   │   └── ThemeContext.tsx         # 🎨 Theme management
│   ├── 📁 events/                   # 📅 Public events pages
│   │   └── [id]/                    # 📄 Individual event pages
│   ├── 📁 hooks/                    # 🪝 Custom hooks
│   │   └── useAuthCheck.ts          # 🔐 Authentication hook
│   ├── 📁 lib/                      # 📚 Utility libraries
│   │   ├── activity-logger.ts       # 📋 Activity logging
│   │   ├── backup-cleanup.ts        # 🧹 Backup cleanup utilities
│   │   ├── backup-service.ts        # 💾 Backup service
│   │   ├── backup-trigger.ts        # 🎯 Backup trigger
│   │   ├── deletion-tracker.ts      # 🗑️ Deletion tracking
│   │   ├── enhanced-backup-service.ts # 💾 Enhanced backup service
│   │   ├── logger.ts                # 📝 Logging utilities
│   │   ├── mail.ts                  # 📧 Email utilities
│   │   ├── rate-limit.ts            # ⚡ Rate limiting
│   │   ├── simple-auth.ts           # 🔐 Authentication logic
│   │   └── validations/             # ✅ Input validation
│   │       └── inquiry.ts           # 📬 Inquiry validation
│   ├── 📁 solutions/                # 🤖 AI solutions showcase
│   ├── 📁 testimonials/             # 💬 Testimonials page
│   └── 📁 types/                    # 📋 TypeScript definitions
├── 📁 components/                   # 🌐 Global components
│   ├── ActivityLog.tsx              # 📋 Activity logging component
│   ├── AdminChart.tsx               # 📊 Admin chart component
│   ├── AdminGuard.tsx               # 🛡️ Admin route protection
│   ├── AIGallery.tsx                # 🤖 AI showcase gallery
│   ├── BackupManagement.tsx         # 💾 Basic backup management
│   ├── BackupModal.tsx              # 💾 Backup creation modal
│   ├── Beams.tsx                    # ✨ Beam animation effect
│   ├── ChangePassword.tsx           # 🔑 Password change form
│   ├── ConditionalLayout.tsx        # 📱 Conditional layout wrapper
│   ├── ContactForm.tsx              # 📬 Contact form component
│   ├── DashboardHeader.tsx          # 📊 Dashboard header
│   ├── DashboardLayout.tsx          # 📊 Dashboard layout
│   ├── DeletedDataModal.tsx         # 🗑️ Deleted data export modal
│   ├── EnhancedBackupManagement.tsx # 💾 Enhanced backup management
│   ├── EnhancedBackupModal.tsx      # 💾 Enhanced backup creation modal
│   ├── FAQSection.tsx               # ❓ FAQ section component
│   ├── Footer.tsx                   # 🔗 Footer component
│   ├── Galaxy.tsx                   # 🌌 Galaxy animation effect
│   ├── GlobeDemo.tsx                # 🌍 Globe demo component
│   ├── GradientBlinds.tsx           # 🎨 Gradient blinds effect
│   ├── GradualBlur.tsx              # 🌫️ Gradual blur effect
│   ├── GsapScrollReveal.tsx         # 📜 GSAP scroll reveal
│   ├── H1Reveal.tsx                 # 📝 H1 reveal animation
│   ├── HomeDataVisualization.tsx    # 📊 Home data visualization
│   ├── LaserFlow.tsx                # 🔴 Laser flow animation
│   ├── LightRays.tsx                # ☀️ Light rays effect
│   ├── LogoLoop.tsx                 # 🔄 Logo loop animation
│   ├── Magnet.tsx                   # 🧲 Magnet effect component
│   ├── ModernChart.tsx              # 📊 Modern chart component
│   ├── ModernStatCard.tsx           # 📈 Modern stat card
│   ├── Navbar.tsx                   # 🧭 Navigation component
│   ├── OptimizedImage.tsx           # 🖼️ Optimized image component
│   ├── OptimizedMotion.tsx          # 🎬 Optimized motion wrapper
│   ├── OptimizedSpline.tsx          # 🎨 Optimized Spline 3D
│   ├── PerformanceMonitor.tsx       # ⚡ Performance monitoring
│   ├── Providers.tsx                # 🎯 Context providers
│   ├── RatingForm.tsx               # ⭐ Rating form component
│   ├── RippleGrid.tsx               # 🌊 Ripple grid effect
│   ├── RouteCurtain.tsx             # 🎭 Route transition effect
│   ├── ScrollStack.tsx              # 📚 Scroll stack component
│   ├── ScrollVelocity.tsx           # 🏃 Scroll velocity tracker
│   ├── Showcase.tsx                 # 🎪 Showcase component
│   ├── SolutionForm.tsx             # 🤖 Solution form component
│   ├── ThemeDebugger.tsx            # 🐛 Theme debugging tool
│   └── 📁 ui/                       # 🎨 UI component library
│       ├── ArticleCard.tsx          # 📄 Article card component
│       ├── Badge.tsx                # 🏷️ Badge component
│       ├── DashboardCard.tsx        # 📊 Dashboard card
│       ├── EventCard.tsx            # 📅 Event card component
│       ├── FAQItem.tsx              # ❓ FAQ item component
│       ├── FeatureCard.tsx          # ✨ Feature card component
│       ├── GlassCard.tsx            # 🔮 Glass card component
│       ├── GradientButton.tsx       # 🎨 Gradient button
│       ├── PerformanceChart.tsx     # 📊 Performance chart
│       ├── PrimaryButton.tsx        # 🔵 Primary button
│       ├── ProjectCard.tsx          # 📁 Project card
│       ├── SecondaryButton.tsx      # ⚪ Secondary button
│       ├── SectionHeader.tsx        # 📝 Section header
│       ├── ShowcaseCard.tsx         # 🎪 Showcase card
│       ├── SolutionCard.tsx         # 🤖 Solution card
│       ├── StatCard.tsx             # 📈 Stat card component
│       ├── TestimonialCard.tsx      # 💬 Testimonial card
│       ├── ThemeToggle.tsx          # 🎨 Theme toggle
│       └── Toast.tsx                # 🍞 Toast notification
├── 📁 data/                         # 📊 Static data files
│   ├── blogs.js                     # 📝 Blog data
│   ├── globe.json                   # 🌍 Globe data
│   └── showcaseData.js              # 🎪 Showcase data
├── 📁 db/                           # 🗄️ Database configuration
│   ├── index.ts                     # 🔌 Database connection
│   ├── schema.ts                    # 📋 Database schema
│   └── migrations/                  # 🔄 Database migrations
├── 📁 hooks/                        # 🪝 Shared hooks
│   └── use-outside-click.tsx        # 🖱️ Outside click hook
├── 📁 lib/                          # 📚 Shared utilities
│   └── utils.ts                     # 🛠️ Utility functions
├── 📁 public/                       # 🖼️ Static assets
│   ├── 📁 data/                     # 📊 Public data files
│   ├── 📁 images/                   # 🖼️ Image assets
│   ├── globe.svg                    # 🌍 Globe SVG
│   ├── next.svg                     # ⚡ Next.js logo
│   └── vercel.svg                   # ▲ Vercel logo
├── 📁 scripts/                      # 🔧 Utility scripts
│   ├── add-events-raw.ts            # 📅 Add raw events
│   ├── add-markdown-blog.ts         # 📝 Add markdown blog
│   ├── add-sample-blog.ts           # 📝 Add sample blog
│   ├── add-sample-events.ts         # 📅 Add sample events
│   ├── add-sample-inquiries.ts      # 📬 Add sample inquiries
│   ├── add-sample-solutions.ts      # 🤖 Add sample solutions
│   ├── check-and-migrate.ts         # ✅ Check and migrate database
│   ├── check-setup.ts               # ✅ Check setup
│   ├── cleanup-backups.js           # 🧹 Cleanup backup files
│   ├── create-activity-logs-table.ts # 📋 Create activity logs table
│   ├── create-blogs-table.ts        # 📝 Create blogs table
│   ├── create-ratings-tables.ts     # ⭐ Create ratings tables
│   ├── dev-with-warming.js          # 🔥 Dev with warming
│   ├── query-database.ts            # 🔍 Query database
│   ├── run-backup-migration.ts      # 🔄 Run backup migration
│   ├── run-backup-migration-v2.ts   # 🔄 Run backup migration v2
│   ├── run-enhanced-backup-migration.ts # 🔄 Run enhanced backup migration
│   ├── run-migrations.ts            # 🔄 Run migrations
│   ├── seed-database.ts             # 🌱 Seed database
│   └── view-database.ts             # 👁️ View database
├── 📁 types/                        # 📋 Global type definitions
│   └── spline.d.ts                  # 🎨 Spline type definitions
├── 📁 backups/                      # 💾 Backup storage directory (auto-generated)
├── components.json                  # ⚙️ Components configuration
├── drizzle.config.ts                # 🗄️ Drizzle configuration
├── eslint.config.mjs                # 🔍 ESLint configuration
├── middleware.ts                    # 🔒 Middleware configuration
├── next.config.ts                   # ⚡ Next.js configuration
├── package.json                     # 📦 Package configuration
├── postcss.config.mjs               # 🎨 PostCSS configuration
├── README.md                        # 📖 Comprehensive documentation
├── setup-admin.ts                   # 👤 Admin setup script
├── tailwind.config.js               # 🎨 Tailwind configuration
├── tsconfig.json                    # 📝 TypeScript configuration
└── vercel.json                      # 🚀 Vercel configuration
```

## 🎮 Usage Guide

### 👤 Public Features

| Feature | Description | Route |
|---------|-------------|-------|
| **Home** | AI solutions showcase with 3D elements | `/` |
| **Solutions** | Detailed AI service offerings | `/solutions` |
| **Blog** | Public blog with articles | `/blog` |
| **Events** | Event listings and details | `/events` |
| **Contact** | Contact form with inquiry submission | `/contact` |
| **Testimonials** | Customer reviews and feedback | `/testimonials` |
| **Book Demo** | Interactive demo booking system | `/book-demo` |

### 🔐 Admin Features

| Feature | Description | Route |
|---------|-------------|-------|
| **Dashboard** | Overview with key metrics | `/admin/dashboard` |
| **Analytics** | Detailed charts and insights | `/admin/analytics` |
| **Inquiries** | Manage customer inquiries | `/admin/inquiries` |
| **Blog** | Create and manage blog posts | `/admin/blog` |
| **Events** | Event creation and management | `/admin/events` |
| **Bookings** | Demo booking management | `/admin/bookings` |
| **Solutions** | AI solutions management | `/admin/solutions` |
| **Ratings** | Rating & testimonial management | `/admin/ratings` |
| **Settings** | System configuration | `/admin/settings` |

### Admin Access
1. Navigate to `/admin/login`
2. Use credentials from your environment variables
3. Access the full admin dashboard

## Analytics & Monitoring

### Built-in Analytics
- **Page Views**: Track visitor engagement across all pages
- **Session Duration**: Monitor user interaction time
- **Bounce Rate**: Analyze page effectiveness
- **Device Analytics**: Mobile vs desktop usage
- **Geographic Data**: Visitor location insights

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Load Times**: Page and API response monitoring
- **Bundle Analysis**: JavaScript bundle optimization
- **Database Performance**: Query optimization tracking

### Business Intelligence
- **Inquiry Tracking**: Lead generation analytics
- **Email Performance**: Delivery and engagement rates
- **Conversion Rates**: Demo booking to inquiry conversion
- **Growth Metrics**: User engagement trends

## 🚀 Deployment

### 🌟 Vercel Deployment (Recommended)

This project is optimized for Vercel with built-in analytics and performance monitoring.

#### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ApilCreate/AI-Solution)

#### Manual Deployment Steps

**1. Connect Repository**
- Import your GitHub repository to Vercel
- Vercel auto-detects Next.js configuration

**2. Configure Environment Variables in Vercel Dashboard**

Go to Settings → Environment Variables and add:

**Required:**
```env
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```
- Get this from your [Neon Database](https://neon.tech) dashboard
- Required for all database operations
- Ensure `?sslmode=require` is included

**Optional but Recommended:**
```env
# Email Service (for contact forms)
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Authentication
JWT_SECRET=your_strong_jwt_secret_key_here
```

**3. Database Setup**
```bash
# After deployment, run migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

**4. Create Admin User**
```bash
# Run the setup script
npx tsx setup-admin.ts
```

**5. Deploy**
- Click "Deploy" in Vercel dashboard
- Vercel automatically builds and deploys
- Analytics tracking starts immediately
- Custom domain configuration available

#### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Neon database created and accessible
- [ ] Build succeeds locally (`npm run build`)
- [ ] All TypeScript errors resolved (or `ignoreBuildErrors` set)
- [ ] Admin credentials created

#### Post-Deployment Verification

- [ ] Home page loads correctly
- [ ] Contact form works
- [ ] Admin login accessible at `/admin/login`
- [ ] Database connections working
- [ ] Email notifications sending (if configured)
- [ ] Analytics tracking active

#### Automatic Features
- **Analytics Integration**: Page views tracked automatically
- **Performance Optimization**: Edge functions and CDN
- **Preview Deployments**: Branch-based previews
- **Monitoring**: Real-time performance metrics
- **Auto-scaling**: Handles traffic spikes automatically

#### Common Deployment Issues

**Build Timeout:**
- Solution: Using optimized `next.config.ts` with package optimization
- Alternative: Increase build timeout in Vercel settings

**Memory Issues:**
- Solution: `vercel.json` includes memory optimizations
- Memory allocation automatically scaled

**Database Connection:**
- Verify `DATABASE_URL` format
- Check Neon database accessibility
- Ensure SSL mode is enabled

**TypeScript Errors:**
- Temporarily use `ignoreBuildErrors: true` in `next.config.ts`
- Or fix all TypeScript errors before deployment


## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run analyze      # Analyze bundle size

# Database Management
npm run db:generate  # Generate database schema
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed with sample data
npm run db:check     # Check database setup
```

### Customization

#### Theme Configuration
```typescript
// app/contexts/ThemeContext.tsx
const themeConfig = {
  light: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff'
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    background: '#0f172a'
  }
}
```

#### Component Styling
- **Tailwind CSS**: Utility-first styling approach
- **CSS Variables**: Dynamic theming support
- **Component Library**: Reusable UI components in `/components/ui`
- **Animation Library**: GSAP and Framer Motion integration

#### Database Schema
```typescript
// db/schema.ts
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('new'),
  createdAt: timestamp('created_at').defaultNow()
});
```

## Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Cookie Sessions**: HttpOnly cookies for session management
- **Route Protection**: Admin-only route guards
- **Password Hashing**: bcrypt for secure password storage

### Input Validation & Sanitization
- **Zod Schemas**: Runtime type validation
- **XSS Protection**: Input sanitization and CSP headers
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **CSRF Protection**: Built-in Next.js CSRF tokens

### Data Protection
- **Environment Variables**: Sensitive data in environment
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Controlled cross-origin requests
- **Security Headers**: Comprehensive security headers

## Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check database connection
npm run db:check

# Common solutions:
# 1. Verify DATABASE_URL format
# 2. Check Neon database status
# 3. Ensure SSL is enabled
```

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

#### Email Delivery
```bash
# Verify Resend configuration
# 1. Check RESEND_API_KEY
# 2. Verify FROM_EMAIL domain
# 3. Check Resend dashboard for logs
```

### Development Tips
- Use `npm run db:studio` to inspect database
- Check browser console for client-side errors
- Monitor Vercel function logs for API issues
- Use `npm run analyze` to optimize bundle size

## 🧪 Testing Guide

### Testing Categories

#### 1. Functional Testing

**User Interface Tests:**
- Homepage loads with all sections visible
- Navigation menu works across all pages
- Contact form submits successfully
- Admin login accepts correct credentials
- Admin dashboard displays all components
- Theme toggle works (light/dark mode)
- Mobile responsive design functions properly

**Data Management Tests:**
- Inquiry creation and tracking
- Blog post creation and publishing
- Event management (create, edit, delete)
- Solution management operations
- Rating and testimonial submission
- Demo booking system workflow
- Backup creation and restoration

#### 2. Security Testing

**Authentication Tests:**
- Admin login with valid credentials succeeds
- Invalid credentials show appropriate error
- Session timeout after inactivity
- Unauthorized access redirects to login
- Password change functionality works
- JWT token validation

**Input Validation:**
- Contact form validates required fields
- Email format validation works
- XSS protection prevents script injection
- SQL injection attempts are blocked
- File upload validation (if applicable)

#### 3. Performance Testing

**Load Testing:**
- Homepage loads in under 3 seconds
- Admin dashboard responds quickly
- Database queries are optimized
- Image loading is optimized (WebP/AVIF)
- Bundle size is under recommended limits

**Analytics:**
- Core Web Vitals (LCP, FID, CLS)
- Time to First Byte (TTFB)
- Time to Interactive (TTI)
- Bundle analysis results

#### 4. Integration Testing

**API Endpoint Tests:**
- `/api/inquiries` - POST and GET operations
- `/api/auth/login` - Authentication flow
- `/api/blogs` - CRUD operations
- `/api/events` - Event management
- `/api/backups` - Backup operations
- `/api/analytics` - Data retrieval

**Database Integration:**
- Connection pool management
- Transaction handling
- Migration execution
- Data integrity checks

#### 5. User Experience Testing

**Navigation Flow:**
- User journey from home to contact
- Admin workflow for inquiry management
- Booking demo process
- Blog reading experience
- Mobile navigation usability

**Accessibility:**
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Alt text for images
- ARIA labels where needed

### Testing Tools & Commands

```bash
# Run linter
npm run lint

# Check TypeScript errors
npx tsc --noEmit

# Analyze bundle size
npm run analyze

# Test database connection
npm run db:check

# View database contents
npm run db:view
```

### Manual Testing Checklist

**Before Production:**
- [ ] All forms submit correctly
- [ ] Email notifications deliver
- [ ] Admin panel fully functional
- [ ] Database backups working
- [ ] Analytics tracking active
- [ ] Error handling works properly
- [ ] Mobile responsive on all devices
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)
- [ ] Performance metrics meet standards
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Rate limiting active

### Automated Testing Setup

```typescript
// Example test structure (add testing library if needed)
describe('Contact Form', () => {
  it('should submit form with valid data', async () => {
    // Test implementation
  });
  
  it('should show validation errors', async () => {
    // Test implementation
  });
});
```

### Bug Reporting Template

```markdown
**Bug Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 120
- Device: Desktop
- OS: Windows 11

**Screenshots:**
Attach relevant screenshots
```

## Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image with WebP/AVIF
- **Lazy Loading**: Dynamic imports for heavy components
- **Bundle Analysis**: Regular bundle size monitoring

### Backend Optimizations
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Caching Strategy**: Redis-compatible caching
- **API Optimization**: Response compression and minification

### Vercel-Specific Optimizations
- **Edge Functions**: Global edge deployment
- **CDN Distribution**: Automatic global caching
- **Image Optimization**: Automatic image processing
- **Analytics Integration**: Zero-config performance tracking

## Contributing

We welcome contributions! Here's how to get started:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Contribution Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**ApilCreate**
- GitHub: [@ApilCreate](https://github.com/ApilCreate)


## Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For seamless deployment and analytics
- **Neon** - For serverless PostgreSQL database
- **Three.js Community** - For 3D web graphics
- **Tailwind CSS** - For utility-first styling

---
