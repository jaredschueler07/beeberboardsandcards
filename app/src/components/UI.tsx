import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check, X, Plus, Minus, Sparkles } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'ai';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-accent text-bg hover:bg-accent-hover font-semibold',
      secondary: 'bg-surface-light text-white hover:bg-gray-600',
      ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-surface-light',
      ai: 'ai-border text-white hover:opacity-90',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  ai?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ai, ...props }, ref) => (
    <div 
      ref={ref}
      className={cn(
        'bg-surface rounded-xl border border-white/5 shadow-lg overflow-hidden',
        ai && 'ai-border ai-shimmer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'ai' | 'success';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-surface-light text-gray-300',
      ai: 'bg-ai/20 text-ai border border-ai/30',
      success: 'bg-success/20 text-success border border-success/30',
    };
    return (
      <span 
        ref={ref}
        className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider', variants[variant], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

export const AISuggestion = ({ children, onAccept, onDismiss }: { children: React.ReactNode; onAccept: () => void; onDismiss: () => void }) => (
  <div className="ai-border bg-ai/5 p-3 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <Sparkles size={16} className="text-ai shrink-0 mt-1" />
    <div className="flex-1">
      <p className="text-xs text-gray-200 leading-relaxed">{children}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={onAccept} className="text-[10px] font-bold text-ai uppercase hover:underline flex items-center gap-1">
          <Check size={10} /> Accept
        </button>
        <button onClick={onDismiss} className="text-[10px] font-bold text-gray-500 uppercase hover:underline flex items-center gap-1">
          <X size={10} /> Dismiss
        </button>
      </div>
    </div>
  </div>
);

export const StatInput = ({ label, value, onChange }: { label: string; value: number; onChange: (val: number) => void }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    <div className="flex items-center bg-bg rounded-lg border border-white/10 p-1">
      <button 
        onClick={() => onChange(value - 1)}
        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-light rounded-md transition-colors"
      >
        <Minus size={14} />
      </button>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-10 bg-transparent text-center text-sm font-mono outline-none"
      />
      <button 
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-light rounded-md transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  </div>
);
