# Contour Education - Learning Management System

To directly try out the LMS, open this link: [https://contour-education.vercel.app/login](https://contour-education.vercel.app/login)

This is a Learning Management System (LMS) for Contour Education.

## Notes

The task was to create a simple lms dashboard system where students can view their lessons. So I decided to implement a three role student, tutor, admin lms system. This may be more complicated than the required task but I think implementing a system where students can just view lessons would be bad system design and scalability if there was just one stakeholder, students.

So I decided to implement a system with Students, Tutors, and Admins, with the following database structure:

i have setup auth hook to manipulate jwt token so the user role (student, tutor ,admin) is in the generated jwt token

### Custom JWT Claims with Auth Hooks

To include the user's role directly within the JWT for easy access on the client-side, this project uses a Supabase Auth Hook. This is achieved with a custom PostgreSQL function that is triggered every time a new access token is generated.

The function retrieves the user's role from the `profiles` table and injects it into the JWT's claims under `user_role`.

Here is the SQL for the hook:

```sql
-- Custom Access Token Hook to add user role from profiles table
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
as $$
  declare
    claims jsonb;
    user_role text;
  begin
    -- Extract the existing claims
    claims := event->'claims';
    
    -- Get the user's role from the profiles table
    select role into user_role
    from public.profiles
    where id = (event->>'user_id')::uuid;
    
    -- If we found a role, add it to the claims
    if user_role is not null then
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    end if;
    
    -- Return the updated claims
    return jsonb_build_object('claims', claims);
  end;
$$;

-- Grant necessary permissions
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to postgres;
grant execute on function public.custom_access_token_hook to anon;
grant execute on function public.custom_access_token_hook to authenticated;
grant execute on function public.custom_access_token_hook to service_role;
```

This function is then configured in the Supabase Dashboard under `Authentication` > `Auth Hooks`, as shown below:

![Supabase Auth Hook Setup](image.png)

### Core Data Tables
These tables store the fundamental entities of your application.

| Table Name      | Explanation                                                                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profiles`      | Stores all user information. It is linked one-to-one with Supabase's `auth.users` table and holds application-specific data like first name, last name, role (student, tutor, admin), and contact details. |
| `subjects`      | The master list of all VCE subjects the company offers (e.g., "VCE Mathematical Methods 3&4", "VCE English 1&2"). This is the core of your curriculum.                                                  |
| `campuses`      | Stores the physical locations of the tutoring centers (e.g., Glen Waverley, Box Hill). Includes details like address and Google Maps links.                                                            |
| `rooms`         | Lists the individual, bookable rooms available within each campus (e.g., "Room 1", "Auditorium"). Each room is linked to a specific campus.                                                            |
| `lessons`       | The central scheduling table. Each row is a single tutoring session, linking a subject, a time, and a specific location (either a physical room or an online URL).                                      |
| `resources`     | The file library. This table stores metadata for uploaded documents like worksheets, slides, and past exams, linking each file to either a subject or a specific lesson.                                |

### "Bridge" Tables (Many-to-Many Relationships)
These tables connect the core tables, creating the many-to-many relationships that make the system work.

| Table Name        | Explanation                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `enrolments`      | Connects students to subjects. This table answers the question: "Which students are learning which subjects?"         |
| `tutor_subjects`  | Connects tutors to subjects. This table answers the question: "Which tutors are qualified to teach which subjects?"   |
| `lesson_students` | Connects students to specific lessons. This table answers the question: "Which students are attending this particular lesson session?" |
| `lesson_tutors`   | Connects tutors to specific lessons. This table answers the question: "Which tutors are teaching this particular lesson session?"     |

### Role Permissions
*   **Admin:** Able to CRUD (Create, Read, Update, Delete) everything.
*   **Tutor:** Able to create lessons, change information about themselves, and manage lessons.
*   **Student:** Only able to view their lessons and information about their lessons and subjects in a nice dashboard.

## Features

- 🔐 **Authentication**: Email/password login and signup with Supabase
- 🛡️ **Protected Routes**: Dashboard route protected by authentication middleware
- 🎫 **JWT Token Display**: View your JWT access token and refresh token on the dashboard
- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- 🔄 **Auto Redirects**: Automatic redirects based on authentication state

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials you can use my credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://czfpfpcmcawaxiwerahv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZnBmcGNtY2F3YXhpd2VyYWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDU3MjUsImV4cCI6MjA2ODQ4MTcyNX0.hPBUtwEqLXEMpNusmvozp8gGaiGqchJ1BXi8bMriBtc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZnBmcGNtY2F3YXhpd2VyYWh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkwNTcyNSwiZXhwIjoyMDY4NDgxNzI1fQ.cFbbh545ixNBq3jFHka6kGZBNZwUoI9ylEIspINGXUo
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

## Test Accounts

You can use the following accounts to test the different user roles:

| Role    | Email                | Password      |
| :------ | :------------------- | :------------ |
| Student | john@gmail.com       | Bonjour123-   |
| Tutor   | johnsnow@gmail.com   | Bonjour123-   |
| Student | philip@gmail.com     | Bonjour123-   |
| Tutor   | mary@gmail.com       | Bonjour123-   |
| Admin   | admin@gmail.com      | Bonjour13-    |

## Project Structure

To keep the project structure clean and maintainable, this application follows a pattern similar to Model-View-Controller (MVC). Here’s how the directories are organized:

*   **`src/app` (Controller/Routing):** This directory uses Next.js's App Router to handle routing and data fetching. Each route segment is a "controller" that fetches data and passes it to the corresponding "view" components.

*   **`src/components` (View):** This directory contains all the React components that make up the user interface. The components are organized by feature, with each feature having its own subfolder. This makes it easy to find and manage the UI for different parts of the application.
    *   `campuses/`: Components related to managing campuses.
    *   `dashboard/`: Components for the main dashboard views (Admin, Tutor, Student).
    *   `lessons/`: Components for displaying and managing lessons.
    *   `subjects/`: Components for handling subjects and tutor assignments.
    *   `users/`: Components for user management forms and lists.
    *   `ui/`: Generic, reusable UI components like buttons, inputs, and cards.

*   **`src/lib` (Model/Business Logic):** This directory contains the application's business logic, including server-side actions for interacting with the Supabase database and the Supabase client configurations.
    *   `*-actions.ts`: These files contain server-side functions for creating, reading, updating, and deleting data for different features (e.g., `campus-actions.ts`, `lesson-actions.ts`).
    *   `supabase.ts` & `supabase-server.ts`: These files configure the client-side and server-side Supabase clients.

This separation of concerns makes the codebase easier to navigate, scale, and debug.

## Pages

### Homepage (`/`)
- Landing page with navigation to login and role-based dashboards
- Clean, modern design

### Login (`/login`)
- Email/password authentication
- Toggle between login and signup modes
- Error handling and success messages
- Auto-redirect to appropriate role-based dashboard on successful login

### Role-Based Dashboard
- **Unified Dashboard** (`/dashboard`): Single route that automatically renders the appropriate dashboard component based on user role:
  - **Student Dashboard**: Default view for students and fallback for users without specific roles
  - **Admin Dashboard**: Administrative view for admin users only  
  - **Tutor Dashboard**: Tutor-specific view for tutor users only

The dashboard automatically detects the user's role from their JWT token and displays the appropriate interface.
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
6. Access the dashboard at `/dashboard` to view your JWT tokens and role-specific content

That's it! You now have a fully functional authentication system with Supabase.
