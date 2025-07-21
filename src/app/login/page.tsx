'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      let result
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
        })
        if (result.error) throw result.error
        setMessage('Check your email for the confirmation link!')
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (result.error) throw result.error
        
        // Get user role and redirect to appropriate dashboard
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
          const { getRoleDashboardRoute } = await import('@/lib/utils')
          const dashboardRoute = getRoleDashboardRoute(session.access_token)
          window.location.href = dashboardRoute
        } else {
          window.location.href = '/dashboard' // Fallback
        }
      }
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Checkered Background */}
      <div
        className="animate-pulse"
        style={{
          position: "absolute",
          inset: "-40% -10% -10% -10%",
          transform: "rotateX(30deg) scale(1.4)",
          transformOrigin: "center bottom",
          animation: "subtle-float 8s ease-in-out infinite alternate",
        }}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-100"
          style={{ fill: "#007AFF1A", stroke: "#007AFF1A" }}
        >
          <defs>
            <pattern id="checkered-pattern" width="45" height="45" patternUnits="userSpaceOnUse" x="-1" y="-1">
              <path d="M.5 45V.5H45" fill="none" strokeDasharray="0"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#checkered-pattern)"></rect>
          <svg x="-1" y="-1" className="overflow-visible"></svg>
        </svg>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top Left Corner Shapes */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500 rounded-full opacity-80"></div>
        <div className="absolute top-0 left-20 w-24 h-24 bg-orange-400 rounded-full opacity-70"></div>
        <div className="absolute top-10 left-0 w-16 h-16 bg-pink-400 rounded-full opacity-60"></div>

        {/* Top Right Corner Shapes */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-pink-500 rounded-full opacity-70"></div>
        <div className="absolute top-20 right-10 w-20 h-20 bg-blue-400 rounded-full opacity-60"></div>

        {/* Bottom Left Decorative Elements */}
        <div className="absolute bottom-40 left-10 w-6 h-6 bg-blue-500 rounded-full opacity-50"></div>
        <div className="absolute bottom-60 left-32 w-4 h-4 bg-orange-400 rounded-full opacity-60"></div>
        <div className="absolute bottom-80 left-20 w-3 h-3 bg-pink-400 rounded-full opacity-70"></div>

        {/* Bottom Right Decorative Elements */}
        <div className="absolute bottom-32 right-20 w-5 h-5 bg-blue-400 rounded-full opacity-50"></div>
        <div className="absolute bottom-52 right-40 w-4 h-4 bg-pink-500 rounded-full opacity-60"></div>

        {/* Paper Airplane Shapes */}
        <div className="absolute top-32 left-1/4 transform rotate-45">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-blue-500 opacity-60"></div>
        </div>
        <div className="absolute top-1/3 right-1/4 transform -rotate-12">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-pink-400 opacity-50"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/3 transform rotate-180">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-orange-400 opacity-60"></div>
        </div>

        {/* Dotted Lines */}
        <div className="absolute top-40 left-16 w-24 h-px border-t-2 border-dotted border-blue-300 opacity-40 transform rotate-12"></div>
        <div className="absolute bottom-1/2 right-24 w-32 h-px border-t-2 border-dotted border-pink-300 opacity-40 transform -rotate-45"></div>
        
        {/* Additional Login Page Decorative Elements */}
        <div className="absolute top-1/2 left-8 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute top-1/4 right-8 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <div className="mx-auto h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Contour Education
            </h2>
            <p className="text-muted-foreground">
              {isSignUp ? 'Create your account to get started' : 'Sign in to access your tutoring dashboard'}
            </p>
          </div>

          {/* Login Card */}
          <Card className="animate-slide-up shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </CardTitle>
              <CardDescription>
                {isSignUp 
                  ? 'Enter your details to create your tutoring account'
                  : 'Enter your credentials to access your dashboard'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>

                {message && (
                  <div className={`text-sm text-center p-3 rounded-lg ${
                    message.includes('error') || message.includes('Error') 
                      ? 'bg-red-50 text-red-600 border border-red-200' 
                      : 'bg-green-50 text-green-600 border border-green-200'
                  }`}>
                    {message}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold bg-gradient-primary hover:bg-primary/90 shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </Button>

                <div className="text-center pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-primary hover:text-primary/80 hover:bg-primary/5"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp 
                      ? 'Already have an account? Sign in' 
                      : "Don't have an account? Create one"
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground animate-fade-in">
            <p>VCE Tutoring Platform • Empowering Student Success</p>
          </div>
        </div>
      </div>
    </div>
  )
} 