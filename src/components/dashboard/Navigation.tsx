"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  FolderOpen, 
  Settings,
  LogOut,
  Menu,
  X,
  User
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState<Array<{
    label: string;
    href: string;
    icon: any;
  }>>([]);
  const { profile, signOut, loading } = useAuth();

  const userRole = profile?.role || "student";

  // Set navigation items after component mounts to prevent hydration errors
  useEffect(() => {
    const getNavigationItems = () => {
      const baseItems = [
        { label: "Dashboard", href: `/dashboard`, icon: Home },
        { label: "Schedule", href: `/dashboard/schedule`, icon: Calendar },
        { label: "Lessons", href: `/dashboard/lessons`, icon: FolderOpen },
      ];

      if (userRole === "admin") {
        return [
          ...baseItems,
          { label: "Users", href: "/dashboard/users", icon: Users },
          { label: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
          { label: "Campuses", href: "/dashboard/campuses", icon: Settings },
        ];
      }

      if (userRole === "tutor") {
        return [
          ...baseItems,
          { label: "Students", href: "/dashboard/users", icon: Users },
        ];
      }

      return baseItems;
    };

    if (!loading && profile) {
      setNavigationItems(getNavigationItems());
    }
  }, [userRole, loading, profile]);

  const isActive = (href: string) => {
    return pathname === href;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.first_name || (loading ? "Loading..." : userRole);

  return (
    <nav className="bg-gradient-primary text-primary-foreground shadow-elegant relative z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/ContourEdlogo.png"
              alt="Contour Education"
              width={200}
              height={40}
              className="h-8 w-auto bg-white rounded px-2 py-1"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {loading || navigationItems.length === 0 ? (
              // Loading placeholder to prevent layout shift
              <>
                <div className="h-8 w-20 bg-primary-foreground/10 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-primary-foreground/10 rounded animate-pulse"></div>
              </>
            ) : (
              navigationItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive(href)
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-24 bg-primary-foreground/10 rounded animate-pulse"></div>
            ) : (
              <>
                <div className="text-sm">
                  <div className="text-primary-foreground/80">Welcome back</div>
                  <div className="font-medium">{displayName}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="bg-white hover:bg-gray-100 text-blue-600"
                  onClick={() => router.push(`/dashboard/users/${profile?.id}`)}
                  disabled={loading || !profile?.id}
                >
                  <User className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="bg-white hover:bg-gray-100 text-blue-600"
                  onClick={handleSignOut}
                  disabled={loading}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-primary-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {loading || navigationItems.length === 0 ? (
              // Loading placeholder for mobile
              <>
                <div className="h-8 w-24 bg-primary-foreground/10 rounded animate-pulse mx-3"></div>
                <div className="h-8 w-20 bg-primary-foreground/10 rounded animate-pulse mx-3"></div>
              </>
            ) : (
              navigationItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive(href)
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))
            )}
            <div className="border-t border-primary-foreground/20 pt-2 mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start bg-white hover:bg-gray-100 text-blue-600"
                onClick={() => {
                  router.push(`/dashboard/users/${profile?.id}`);
                  setIsMobileMenuOpen(false);
                }}
                disabled={loading || !profile?.id}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start bg-white hover:bg-gray-100 text-blue-600"
                onClick={handleSignOut}
                disabled={loading}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}; 