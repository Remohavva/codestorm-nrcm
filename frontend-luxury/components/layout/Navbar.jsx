'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { Button, IconButton } from '@/components/ui/Button';
import CardNav from '@/components/ui/CardNav';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export default function Navbar({ className }) {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getCardNavItems = () => {
    if (!isAuthenticated) {
      return [
        {
          label: "Get Started",
          bgColor: "#0D0716",
          textColor: "#fff",
          links: [
            { label: "Sign In", ariaLabel: "Sign In to your account", href: "/login" },
            { label: "Sign Up", ariaLabel: "Create new account", href: "/register" }
          ]
        },
        {
          label: "About",
          bgColor: "#170D27",
          textColor: "#fff",
          links: [
            { label: "Features", ariaLabel: "Platform Features" },
            { label: "Contact", ariaLabel: "Contact Us" }
          ]
        }
      ];
    }

    const baseItems = [
      {
        label: "Dashboard",
        bgColor: "#0D0716",
        textColor: "#fff",
        links: [
          { label: "Overview", ariaLabel: "Dashboard Overview", href: "/dashboard" },
          { label: "Profile", ariaLabel: "My Profile", href: "/profile" },
          { label: "Settings", ariaLabel: "Account Settings", href: "/profile" }
        ]
      },
      {
        label: "Events",
        bgColor: "#170D27",
        textColor: "#fff",
        links: [
          { label: "Browse Events", ariaLabel: "Browse All Events", href: "/events" },
          { label: "My Registrations", ariaLabel: "My Event Registrations", href: "/registrations" },
          { label: "Feed", ariaLabel: "Event Feed", href: "/feed" }
        ]
      },
      {
        label: "Community",
        bgColor: "#271E37",
        textColor: "#fff",
        links: [
          { label: "Clubs", ariaLabel: "Browse Clubs", href: "/clubs" },
          { label: "Discussions", ariaLabel: "Community Discussions", href: "/feed" }
        ]
      }
    ];

    // Add role-specific items
    if (user?.role === 'admin') {
      baseItems.push({
        label: "Admin",
        bgColor: "#3D1A1A",
        textColor: "#fff",
        links: [
          { label: "Admin Panel", ariaLabel: "Admin Dashboard", href: "/admin" },
          { label: "Manage Users", ariaLabel: "User Management" },
          { label: "System Stats", ariaLabel: "System Statistics" }
        ]
      });
    } else if (user?.role === 'coordinator') {
      baseItems.push({
        label: "Coordinator",
        bgColor: "#1A3D1A",
        textColor: "#fff",
        links: [
          { label: "My Events", ariaLabel: "Coordinator Dashboard", href: "/coordinator" },
          { label: "Create Event", ariaLabel: "Create New Event", href: "/coordinator/events/create" },
          { label: "Analytics", ariaLabel: "Event Analytics", href: "/coordinator" }
        ]
      });
    }

    return baseItems;
  };

  const cardNavItems = getCardNavItems();

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { href: '/', label: 'Home' },
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Register' },
      ];
    }

    const baseLinks = [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/feed', label: 'Feed' },
      { href: '/events', label: 'Events' },
      { href: '/clubs', label: 'Clubs' },
      { href: '/registrations', label: 'My Registrations' },
    ];

    // Add role-specific links
    if (user?.role === 'admin') {
      baseLinks.push({ href: '/admin', label: 'Admin' });
    } else if (user?.role === 'coordinator') {
      baseLinks.push({ href: '/coordinator', label: 'Coordinator' });
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <nav className={cn('nav-chrome sticky top-0 z-50 border-b border-chrome-600/20', className)}>
      <div className="container-chrome">
        <div className="flex items-center justify-between h-16">
          {/* CardNav Integration */}
          <div className="flex-1">
            <CardNav
              logo="/logo.svg"
              logoAlt="College Events Logo"
              items={cardNavItems}
              baseColor="transparent"
              menuColor="#0D0716"
              buttonBgColor="#1a1a1a"
              buttonTextColor="#fff"
              ease="power3.out"
              theme="dark"
            />
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 glass-morphism rounded-lg px-3 py-2 hover:bg-glass-light transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">
                      {typeof user?.name === 'string' ? user.name : 'User'}
                    </p>
                    <p className="text-xs text-chrome-300 capitalize">
                      {typeof user?.role === 'string' ? user.role : 'student'}
                    </p>
                  </div>
                  <svg 
                    className={cn(
                      'w-4 h-4 text-chrome-300 transition-transform',
                      isProfileOpen && 'rotate-180'
                    )} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 chrome-surface rounded-lg shadow-xl border border-chrome-600/20 py-2"
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-chrome-200 hover:text-white hover:bg-glass-light transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-chrome-200 hover:text-white hover:bg-glass-light transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <hr className="my-2 border-chrome-600/20" />
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-accent-error hover:bg-accent-error/10 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
                <Button variant="accent" size="sm" onClick={() => router.push('/register')}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </IconButton>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-chrome-600/20 py-4"
            >
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-chrome-200 hover:text-white hover:bg-glass-light rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {!isAuthenticated && (
                  <div className="pt-4 space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/login');
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="accent" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/register');
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close dropdowns */}
      {(isMenuOpen || isProfileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileOpen(false);
          }}
        />
      )}
    </nav>
  );
}