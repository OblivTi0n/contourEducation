# Supabase Auth App

A Next.js application with Supabase authentication featuring login/signup functionality and a protected dashboard that displays JWT tokens.

## Features

- 🔐 **Authentication**: Email/password login and signup with Supabase
- 🛡️ **Protected Routes**: Dashboard route protected by authentication middleware
- 🎫 **JWT Token Display**: View your JWT access token and refresh token on the dashboard
- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- 🔄 **Auto Redirects**: Automatic redirects based on authentication state

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

To get these values:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the `Project URL` and `anon public` key

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── admindashboard/
│   │   └── page.tsx          # Admin dashboard (admin role only)
│   ├── studentdashboard/
│   │   └── page.tsx          # Student dashboard (default/student role)
│   ├── tutordashboard/
│   │   └── page.tsx          # Tutor dashboard (tutor role only)
│   ├── login/
│   │   └── page.tsx          # Login/signup page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage with navigation
├── lib/
│   ├── supabase.ts           # Client-side Supabase client
│   └── supabase-server.ts    # Server-side Supabase client
└── middleware.ts             # Authentication middleware
```

## Pages

### Homepage (`/`)
- Landing page with navigation to login and role-based dashboards
- Clean, modern design

### Login (`/login`)
- Email/password authentication
- Toggle between login and signup modes
- Error handling and success messages
- Auto-redirect to appropriate role-based dashboard on successful login

### Role-Based Dashboards
- **Student Dashboard** (`/studentdashboard`): Default dashboard for students and fallback for users without specific roles
- **Admin Dashboard** (`/admindashboard`): Administrative dashboard for admin users only  
- **Tutor Dashboard** (`/tutordashboard`): Tutor-specific dashboard for tutor users only

Each dashboard displays user authentication information and role-specific content.
- Complete session details in JSON format
- Sign out functionality

## Authentication Flow

1. **Middleware Protection**: `middleware.ts` protects routes and handles redirects
2. **Client-side Auth**: Uses Supabase client for login/signup
3. **Session Management**: Automatic session refresh and state management
4. **Secure Redirects**: Prevents access to protected routes when not authenticated

## Technologies Used

- **Next.js 15** - React framework with App Router
- **Supabase** - Backend-as-a-Service with authentication
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 19** - Latest React features

## Getting Started

1. Set up a Supabase project at [supabase.com](https://supabase.com)
2. Enable Email authentication in Supabase Auth settings
3. Add your environment variables
4. Run the development server
5. Navigate to `/login` to create an account or sign in
6. Access your role-specific dashboard to view your JWT tokens:
   - `/studentdashboard` (default)
   - `/admindashboard` (admin users only)
   - `/tutordashboard` (tutor users only)

That's it! You now have a fully functional authentication system with Supabase.
