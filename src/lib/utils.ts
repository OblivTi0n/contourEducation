import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to decode JWT and extract claims
export function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

// Helper function to get the appropriate dashboard route based on user role
export function getRoleDashboardRoute(accessToken: string): string {
  const decodedToken = decodeJWT(accessToken)
  
  if (decodedToken && decodedToken.user_role) {
    switch (decodedToken.user_role) {
      case 'admin':
        return '/admindashboard'
      case 'student':
        return '/studentdashboard'
      case 'tutor':
        return '/tutordashboard'
      default:
        return '/studentdashboard' // Default fallback
    }
  }
  
  return '/studentdashboard' // Default fallback
} 