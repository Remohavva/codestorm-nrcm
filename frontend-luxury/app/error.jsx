'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* Error icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-accent-error/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-accent-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        {/* Error message */}
        <div className="space-y-2">
          <h2 className="font-plus-jakarta text-2xl font-semibold text-white">
            Something went wrong
          </h2>
          <p className="text-chrome-300">
            We encountered an unexpected error. Please try again.
          </p>
        </div>
        
        {/* Error details (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="glass-morphism rounded-lg p-4 text-left">
            <p className="text-xs text-chrome-400 font-mono break-all">
              {error?.message || 'Unknown error'}
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="accent" onClick={reset}>
            Try Again
          </Button>
          <Button variant="chrome" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}