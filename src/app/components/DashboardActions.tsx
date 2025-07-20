'use client'

import { createClient } from '@/lib/supabase'

export default function DashboardActions() {
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // Force a page refresh to ensure server-side components pick up the sign out
    window.location.href = '/login'
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={handleSignOut}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </div>
  )
} 