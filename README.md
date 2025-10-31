# Nike E-Commerce App

A modern e-commerce application built with Next.js, TypeScript, and featuring Nike products. This app includes authentication, database management, and state management.

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: TailwindCSS
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **State Management**: Zustand
- **Linting**: ESLint

## Features

- 🛍️ Product catalog with Nike sneakers
- 🔐 Authentication system with Better Auth
- 📱 Responsive design with TailwindCSS
- 🗄️ PostgreSQL database with Drizzle ORM
- 🔄 State management with Zustand
- 🎨 Modern UI components

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your_neon_database_url_here"

# Better Auth
BETTER_AUTH_SECRET="your_secret_key_here"
BETTER_AUTH_URL="http://localhost:3000"
```

### 2. Database Setup

1. Create a Neon PostgreSQL database at [neon.tech](https://neon.tech)
2. Copy your database URL to the `.env.local` file
3. Generate and push the database schema:

```bash
npm run db:generate
npm run db:push
```

### 3. Seed the Database

Populate the database with sample Nike products:

```bash
npm run db:seed
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts    # Better Auth API routes
│   │   └── products/route.ts         # Products API
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Homepage
├── components/
│   └── ProductCard.tsx               # Product display component
└── lib/
    ├── db/
    │   ├── index.ts                  # Database connection
    │   └── schema.ts                 # Database schema
    ├── store/
    │   └── products.ts               # Zustand store
    ├── auth.ts                       # Better Auth configuration
    └── seed.ts                       # Database seeding script
```

## Database Schema

The app includes a `products` table with the following fields:
- `id` - Primary key
- `name` - Product name
- `description` - Product description
- `price` - Product price (decimal)
- `image` - Product image URL
- `category` - Product category
- `brand` - Product brand (defaults to Nike)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
