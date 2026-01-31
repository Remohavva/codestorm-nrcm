'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const cardVariants = {
  // Base styles
  base: 'rounded-2xl transition-all duration-normal',
  
  // Variants
  variants: {
    chrome: 'chrome-surface shadow-lg hover:shadow-chrome-md',
    glass: 'glass-morphism shadow-md hover:shadow-lg',
    obsidian: 'obsidian-surface shadow-xl hover:shadow-2xl',
    luxury: 'chrome-surface border border-chrome-400 shadow-xl hover:shadow-chrome-lg hover:border-accent-primary',
    gradient: 'bg-gradient-to-br from-chrome-800 to-chrome-900 border border-chrome-600 shadow-xl',
  },
  
  // Sizes
  sizes: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  },
};

const Card = forwardRef(({ 
  className, 
  variant = 'chrome', 
  size = 'md',
  hover = true,
  children,
  ...props 
}, ref) => {
  const baseClasses = cardVariants.base;
  const variantClasses = cardVariants.variants[variant];
  const sizeClasses = cardVariants.sizes[size];
  
  const cardClasses = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    className
  );

  const MotionCard = motion.div;

  return (
    <MotionCard
      ref={ref}
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={hover ? { 
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' }
      } : {}}
      {...props}
    >
      {children}
    </MotionCard>
  );
});

Card.displayName = 'Card';

// Card Header Component
export const CardHeader = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-6', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

// Card Title Component
export const CardTitle = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        'font-plus-jakarta text-xl font-semibold leading-none tracking-tight text-white',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

// Card Description Component
export const CardDescription = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-chrome-300', className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

// Card Content Component
export const CardContent = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

// Card Footer Component
export const CardFooter = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center pt-6', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

// Stat Card Component
export const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon,
  className,
  ...props 
}) => {
  const changeColor = changeType === 'positive' ? 'text-accent-success' : 'text-accent-error';
  
  return (
    <Card variant="luxury" className={cn('relative overflow-hidden', className)} {...props}>
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent" />
      
      <CardContent className="relative">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-chrome-300">{title}</p>
            <p className="font-jetbrains-mono text-2xl font-bold text-white tabular-nums">
              {value}
            </p>
            {change && (
              <p className={cn('text-xs font-medium', changeColor)}>
                {change}
              </p>
            )}
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-glass-light">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Feature Card Component
export const FeatureCard = ({ 
  title, 
  description, 
  icon,
  href,
  className,
  ...props 
}) => {
  const CardComponent = href ? motion.a : Card;
  const cardProps = href ? { href, ...props } : props;
  
  return (
    <CardComponent 
      variant="glass" 
      className={cn('group cursor-pointer', className)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...cardProps}
    >
      <CardContent>
        <div className="space-y-4">
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-primary/10 text-accent-primary group-hover:bg-accent-primary group-hover:text-white transition-colors">
              {icon}
            </div>
          )}
          <div className="space-y-2">
            <h3 className="font-plus-jakarta text-lg font-semibold text-white group-hover:text-accent-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-chrome-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </CardComponent>
  );
};

export { Card, cardVariants };