# AI Solution - Full-Stack Business Platform

A comprehensive full-stack web application built with Next.js, featuring AI-powered business solutions, admin dashboard, contact management, and dynamic content delivery.

## 🚀 Features

### 🎯 Core Features
- **AI-Powered Solutions Showcase** - Interactive presentation of AI services and capabilities
- **Dynamic Blog System** - Content management with markdown support and admin controls
- **Events Management** - Event creation, listing, and management with detailed information
- **Contact Management** - Inquiry system with comprehensive admin tracking and analytics
- **Admin Dashboard** - Complete admin panel with analytics, charts, and data visualization
- **Authentication System** - Secure cookie-based authentication for admin access
- **Email Integration** - Automated email delivery and status tracking
- **Theme Support** - Dark/Light mode toggle with persistent user preferences

### 🎨 User Interface
- **Modern Design** - Clean, responsive design with smooth animations
- **Interactive Components** - Dynamic 3D elements, particles, and visual effects
- **Glass Morphism UI** - Modern glassmorphism design patterns
- **Mobile Responsive** - Fully responsive across all device sizes
- **Performance Optimized** - Lazy loading, image optimization, and fast navigation

### 📊 Admin Features
- **Analytics Dashboard** - Comprehensive data visualization with charts and metrics
- **Inquiry Management** - Track, filter, and manage customer inquiries
- **Blog Management** - Create, edit, and manage blog posts
- **Event Management** - Create and manage events with detailed information
- **Email Status Tracking** - Monitor email delivery and engagement
- **Data Export** - Export data for external analysis

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.4.4** - React framework with App Router
- **React 19.1.0** - User interface library
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation and motion library
- **GSAP** - Advanced animations and interactions

### Backend & Database
- **Neon Database** - Serverless PostgreSQL database
- **Drizzle ORM** - Type-safe database toolkit
- **Zod** - Schema validation and type safety
- **Nodemailer** - Email delivery service

### 3D & Visual Effects
- **Three.js** - 3D graphics and animations
- **React Three Fiber** - React renderer for Three.js
- **Spline** - 3D design and interactive elements
- **Particles** - Interactive particle systems
- **OGL** - Lightweight WebGL library

### Development Tools
- **ESLint** - Code linting and quality
- **Bundle Analyzer** - Bundle size analysis
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
AI-Solution/
├── app/                          # Next.js App Router
│   ├── admin/                   # Admin panel pages
│   │   ├── analytics/          # Analytics dashboard
│   │   ├── blog/               # Blog management
│   │   ├── dashboard/          # Main admin dashboard
│   │   ├── events/             # Event management
│   │   ├── inquiries/          # Inquiry management
│   │   └── login/              # Admin authentication
│   ├── api/                     # API routes
│   │   ├── analytics/          # Analytics endpoints
│   │   ├── auth/               # Authentication APIs
│   │   ├── blogs/              # Blog APIs
│   │   ├── diagnostic/         # System diagnostics
│   │   ├── email/              # Email APIs
│   │   ├── events/             # Event APIs
│   │   ├── export/             # Data export APIs
│   │   └── inquiries/          # Inquiry APIs
│   ├── blog/                    # Public blog pages
│   ├── components/              # Reusable components
│   │   └── ui/                 # UI component library
│   ├── contact/                 # Contact page
│   ├── contexts/                # React contexts
│   ├── data/                    # Static data files
│   ├── events/                  # Public events pages
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility libraries
│   ├── solutions/               # Solutions showcase
│   ├── testimonials/            # Testimonials page
│   └── types/                   # TypeScript definitions
├── components/                   # Global components
│   └── ui/                     # Shared UI components
├── db/                          # Database configuration
├── hooks/                       # Shared hooks
├── lib/                         # Utility functions
├── public/                      # Static assets
├── scripts/                     # Database and utility scripts
└── types/                       # Global type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Neon Database account (for production)

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
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your_neon_database_url"
   
   # Email Configuration (Nodemailer)
   EMAIL_HOST="smtp.your-email-provider.com"
   EMAIL_PORT=587
   EMAIL_USER="your_email@domain.com"
   EMAIL_PASS="your_email_password"
   EMAIL_FROM="noreply@yourdomain.com"
   
   # Admin Authentication
   ADMIN_ID="your_admin_username"
   ADMIN_PASSWORD="your_secure_password"
   
   # Security
   JWT_SECRET="your_jwt_secret_key"
   COOKIE_SECRET="your_cookie_secret"
   
   # Next.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_nextauth_secret"
   ```

4. **Database Setup**
   ```bash
   # Generate database schema
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed database with sample data
   npm run db:seed
   ```

5. **Development Server**
   ```bash
   # Standard development
   npm run dev
   ```

6. **Open Application**
   Navigate to `http://localhost:3000` in your browser

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size

### Database Management
- `npm run db:generate` - Generate database schema
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:view` - View database contents
- `npm run db:query` - Execute database queries
- `npm run db:seed` - Seed database with sample data
- `npm run db:check` - Check database setup

## 🎯 Usage Guide

### Admin Access
1. Navigate to `/admin/login`
2. Use the credentials set in your `.env.local` file
3. Access the admin dashboard at `/admin/dashboard`

### Admin Features
- **Dashboard**: View analytics, metrics, and overview
- **Analytics**: Detailed charts and data visualization
- **Inquiries**: Manage customer inquiries and responses
- **Blog**: Create, edit, and manage blog posts
- **Events**: Create and manage events
- **Email**: Monitor email delivery status

### Public Features
- **Home**: Landing page with AI solutions showcase
- **Solutions**: Detailed AI service offerings
- **Blog**: Public blog with articles and insights
- **Events**: Event listings and details
- **Contact**: Contact form with inquiry submission
- **Testimonials**: Customer testimonials and reviews

## 🎨 Customization

### Theme Configuration
The application supports dark/light mode themes. Customize in:
- `app/contexts/ThemeContext.tsx` - Theme logic
- `tailwind.config.js` - Color schemes and design tokens
- `app/globals.css` - Global styles and CSS variables

### Component Styling
- All components use Tailwind CSS classes
- Custom components in `app/components/ui/`
- Reusable styling patterns in utility classes

### Database Schema
Modify database schema in:
- `db/schema.ts` - Database table definitions
- `scripts/` - Migration and seeding scripts

## 🔧 Configuration

### Email Setup
Configure email delivery in `app/lib/mail.ts`:
- SMTP settings
- Email templates
- Delivery tracking

### Authentication
Custom authentication system in:
- `app/lib/simple-auth.ts` - Authentication logic
- `app/components/AdminGuard.tsx` - Route protection
- Cookie-based session management

### Database Configuration
Database setup in:
- `db/index.ts` - Database connection
- `drizzle.config.ts` - Drizzle ORM configuration
- `db/schema.ts` - Table schemas

## 📊 Analytics & Monitoring

The application includes comprehensive analytics:
- **User Engagement**: Page views, session duration
- **Inquiry Tracking**: Source attribution, conversion rates
- **Email Performance**: Delivery rates, engagement metrics
- **System Health**: Error tracking, performance monitoring

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Ensure all production environment variables are set:
- Database URLs
- Email configuration
- Security secrets
- Domain settings

### Recommended Platforms
- **Vercel** - Seamless Next.js deployment
- **Netlify** - Static site deployment
- **Railway** - Full-stack deployment
- **AWS** - Enterprise deployment

## 🔒 Security Features

- **Authentication**: Secure cookie-based sessions
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Built-in Next.js protection
- **Rate Limiting**: API rate limiting implementation
- **Data Sanitization**: XSS and injection prevention

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Check `DATABASE_URL` in environment
2. **Email Delivery**: Verify SMTP settings and credentials
3. **Authentication**: Ensure admin credentials are set correctly
4. **Build Errors**: Check for TypeScript errors and missing dependencies

### Development Tips
- Use `npm run db:studio` to inspect database
- Check browser console for client-side errors
- Monitor server logs for API issues
- Use `npm run analyze` to optimize bundle size

## 📈 Performance

The application is optimized for performance:
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: Optimized caching strategies
- **Bundle Analysis**: Regular bundle size monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ApilCreate**
- GitHub: [@ApilCreate](https://github.com/ApilCreate)
- Repository: [AI-Solution](https://github.com/ApilCreate/AI-Solution)

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Tailwind CSS for the utility-first approach
- Drizzle team for the type-safe ORM
- Neon for serverless PostgreSQL
- All open-source contributors

---

**Built with ❤️ using modern web technologies**
