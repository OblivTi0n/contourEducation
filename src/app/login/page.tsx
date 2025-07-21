'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const [showTestCreds, setShowTestCreds] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createClient()

  // Test credentials for easy testing
  const testAccounts = [
    { email: 'john@gmail.com', name: 'John Smith', role: 'Student', password: 'Bonjour123-' },
    { email: 'johnsnow@gmail.com', name: 'John Snow', role: 'Tutor', password: 'Bonjour123-' },
    { email: 'philip@gmail.com', name: 'Philip Jones', role: 'Student', password: 'Bonjour123-' },
    { email: 'mary@gmail.com', name: 'Mary Tutor', role: 'Tutor', password: 'Bonjour123-' },
    { email: 'admin@gmail.com', name: 'Admin User', role: 'Admin', password: 'Bonjour13-' },
  ]

  const handleTestLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
  }

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
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'An error occurred')
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
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
          {/* Header */}
          <div className="text-center animate-fade-in mb-8">
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

          {/* Login Form - Centered */}
          <div className="w-full max-w-md flex-shrink-0">
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
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 pr-12"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded focus:outline-none text-gray-500 hover:text-gray-800"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
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
          </div>

          {/* Toggle Test Credentials Button */}
          {!isSignUp && (
            <Button
              type="button"
              variant="outline"
              className="mt-6 mb-2"
              onClick={() => setShowTestCreds((v) => !v)}
            >
              {showTestCreds ? 'Hide Test Credentials' : 'Show Test Credentials'}
            </Button>
          )}

          {/* Test Credentials - Toggled Below Form */}
          {!isSignUp && showTestCreds && (
            <div className="w-full max-w-md flex-shrink-0 mt-2">
              <Card className="animate-slide-up border-amber-200 bg-amber-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                    🧪 Test Credentials
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    Click any email below to auto-fill login credentials
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {testAccounts.map((account, index) => (
                      <div
                        key={index}
                        onClick={() => handleTestLogin(account.email, account.password)}
                        className="flex justify-between items-center p-2 rounded-lg bg-white border border-amber-200 hover:bg-amber-100 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{account.name}</div>
                          <div className="text-sm text-gray-600">{account.email}</div>
                        </div>
                        <div className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                          {account.role}
                        </div>
                        <div className="text-xs ml-2 text-amber-700">{account.password}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-white rounded border border-amber-200">
                    <div className="text-sm text-amber-700">
                      <span className="font-medium">Password:</span> (see account row)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground animate-fade-in mt-8">
            <p>VCE Tutoring Platform • Empowering Student Success</p>
          </div>
        </div>
      </div>
    </div>
  )
} 