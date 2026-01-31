'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-4"
          >
            <h1 className="font-plus-jakarta text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-gradient bg-gradient-to-r from-white via-chrome-200 to-white">
                College Event
              </span>
              <br />
              <span className="accent-text bg-gradient-to-r from-accent-primary to-accent-secondary">
                Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-chrome-300 max-w-2xl mx-auto leading-relaxed">
              Experience the future of event management with our luxury platform designed for modern colleges
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              variant="accent" 
              size="lg" 
              className="min-w-[200px]"
              onClick={() => window.location.href = '/register'}
            >
              Get Started
            </Button>
            <Button 
              variant="chrome" 
              size="lg" 
              className="min-w-[200px]"
              onClick={() => window.location.href = '/login'}
            >
              Sign In
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <Card variant="glass" className="text-left">
              <CardHeader>
                <CardTitle className="text-lg">Event Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-chrome-300 text-sm">
                  Create, manage, and track events with our intuitive interface
                </p>
              </CardContent>
            </Card>

            <Card variant="glass" className="text-left">
              <CardHeader>
                <CardTitle className="text-lg">Club Coordination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-chrome-300 text-sm">
                  Streamline club activities and member engagement
                </p>
              </CardContent>
            </Card>

            <Card variant="glass" className="text-left">
              <CardHeader>
                <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-chrome-300 text-sm">
                  Get insights with real-time analytics and reporting
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Status Indicator */}
      <div className="fixed bottom-4 right-4">
        <Card variant="chrome" size="sm" className="text-xs">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-success rounded-full animate-pulse" />
              <span className="text-chrome-200">System Online</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}