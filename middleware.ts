import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  // Protect role-specific dashboard routes
  if ((request.nextUrl.pathname.startsWith('/admindashboard') || 
       request.nextUrl.pathname.startsWith('/studentdashboard') || 
       request.nextUrl.pathname.startsWith('/tutordashboard')) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to appropriate dashboard if already logged in and trying to access login
  if (request.nextUrl.pathname.startsWith('/login') && user) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      const { getRoleDashboardRoute } = await import('./src/lib/utils')
      const dashboardRoute = getRoleDashboardRoute(session.access_token)
      return NextResponse.redirect(new URL(dashboardRoute, request.url))
    }
    return NextResponse.redirect(new URL('/studentdashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 