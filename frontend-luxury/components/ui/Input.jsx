'use client';

import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const inputVariants = {
  base: 'flex w-full rounded-lg border bg-transparent px-3 py-2 text-sm transition-all duration-normal file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-chrome-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  
  variants: {
    chrome: 'glass-morphism border-chrome-600 text-white focus:border-accent-primary focus:shadow-accent-sm',
    outline: 'border-chrome-600 bg-transparent text-white focus:border-accent-primary focus:shadow-accent-sm',
    filled: 'bg-chrome-800 border-chrome-700 text-white focus:border-accent-primary focus:bg-chrome-700',
  },
  
  sizes: {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-3 py-2',
    lg: 'h-11 px-4 py-3 text-base',
  },
};

const Input = forwardRef(({ 
  className, 
  type = 'text',
  variant = 'chrome', 
  size = 'md',
  label,
  error,
  helperText,
  icon,
  rightIcon,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const baseClasses = inputVariants.base;
  const variantClasses = inputVariants.variants[variant];
  const sizeClasses = inputVariants.sizes[size];
  
  const inputClasses = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    icon && 'pl-10',
    rightIcon && 'pr-10',
    error && 'border-accent-error focus:border-accent-error',
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-chrome-200">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-chrome-400">
            {icon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-chrome-400">
            {rightIcon}
          </div>
        )}
        
        {/* Focus ring */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-accent-primary/50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent-error"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-chrome-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Password Input Component
export const PasswordInput = forwardRef(({ ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-chrome-400 hover:text-white transition-colors"
        >
          {showPassword ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

// Textarea Component
export const Textarea = forwardRef(({ 
  className, 
  variant = 'chrome',
  label,
  error,
  helperText,
  rows = 4,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const baseClasses = 'flex min-h-[80px] w-full rounded-lg border bg-transparent px-3 py-2 text-sm transition-all duration-normal placeholder:text-chrome-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none';
  const variantClasses = inputVariants.variants[variant];
  
  const textareaClasses = cn(
    baseClasses,
    variantClasses,
    error && 'border-accent-error focus:border-accent-error',
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-chrome-200">
          {label}
        </label>
      )}
      
      <div className="relative">
        <motion.textarea
          ref={ref}
          rows={rows}
          className={textareaClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          {...props}
        />
        
        {/* Focus ring */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-accent-primary/50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent-error"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-chrome-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select Component
export const Select = forwardRef(({ 
  className, 
  variant = 'chrome',
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  ...props 
}, ref) => {
  const baseClasses = inputVariants.base;
  const variantClasses = inputVariants.variants[variant];
  const sizeClasses = inputVariants.sizes.md;
  
  const selectClasses = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    'pr-10 cursor-pointer',
    error && 'border-accent-error focus:border-accent-error',
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-chrome-200">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-chrome-800 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-chrome-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent-error"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-chrome-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export { Input, inputVariants };