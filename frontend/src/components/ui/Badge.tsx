import type { ReactNode } from 'react';

type BadgeVariant = 'sky' | 'gray' | 'yellow' | 'green' | 'red';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  sky: 'bg-sky-100 text-sky-800',
  gray: 'bg-gray-100 text-gray-600',
  yellow: 'bg-yellow-400 text-gray-800',
  green: 'bg-green-50 text-green-700 border border-green-200',
  red: 'bg-red-50 text-red-700 border border-red-200',
};

export default function Badge({
  children,
  variant = 'sky',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-block text-xs font-semibold px-2 py-1 rounded',
        VARIANT_CLASSES[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
