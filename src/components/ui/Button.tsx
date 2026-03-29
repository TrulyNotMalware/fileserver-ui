import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'ghost';
  size?: 'sm' | 'md';
  children: ReactNode;
  active?: boolean;
}

export function Button({
  variant = 'outline',
  size = 'sm',
  active,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-1.5 rounded font-medium transition-colors cursor-pointer select-none';

  const variants = {
    outline: `border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100
      ${active ? 'border-blue-400 bg-blue-50 text-blue-700' : ''}`,
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-800',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
