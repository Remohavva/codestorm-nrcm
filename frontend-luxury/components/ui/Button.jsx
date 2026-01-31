'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const buttonVariants = {
  // Base styles
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  
  // Variants
  variants: {
    chrome: 'glass-morphism border-chrome-600 text-white hover:bg-glass-light hover:border-accent-primary hover:shadow-accent-md',
    accent: 'bg-accent-primary text-white hover:bg-accent-secondary hover:shadow-accent-md',
    ghost: 'text-chrome-200 hover:bg-glass-medium hover:text-white',
    outline: 'border border-chrome-600 text-chrome-200 hover:bg-glass-light hover:text-white hover:border-accent-primary',
    destructive: 'bg-accent-error text-white hover:bg-red-600 hover:shadow-lg',
    luxury: 'chrome-surface border-chrome-400 text-white hover:bg-gradient-to-r hover:from-accent-primary hover:to-accent-secondary hover:shadow-accent-lg',
  },
  
  // Sizes
  sizes: {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg',
    xl: 'h-12 px-10 text-xl',
    icon: 'h-10 w-10',
  },
};

const Button = forwardRef(({ 
  className, 
  variant = 'chrome', 
  size = 'md', 
  asChild = false,
  loading = false,
  icon,
  children,
  ...props 
}, ref) => {
  const baseClasses = buttonVariants.base;
  const variantClasses = buttonVariants.variants[variant];
  const sizeClasses = buttonVariants.sizes[size];
  
  const buttonClasses = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    loading && 'cursor-not-allowed opacity-70',
    className
  );

  const buttonContent = (
    <>
      {loading && (
        <motion.div
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
      {icon && !loading && (
        <span className="mr-2 flex-shrink-0">
          {icon}
        </span>
      )}
      {children}
    </>
  );

  if (asChild) {
    return (
      <motion.div
        ref={ref}
        className={buttonClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {buttonContent}
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={ref}
      className={buttonClasses}
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
});

Button.displayName = 'Button';

// Icon Button Component
export const IconButton = forwardRef(({ 
  className, 
  variant = 'ghost', 
  size = 'icon',
  children,
  ...props 
}, ref) => {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn('rounded-full', className)}
      {...props}
    >
      {children}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

// Button Group Component
export const ButtonGroup = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn('flex rounded-lg overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Loading Button Component
export const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <Button loading={loading} {...props}>
      {children}
    </Button>
  );
};

export { Button, buttonVariants };