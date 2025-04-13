
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
}

const ProgressBar = ({
  value,
  max = 100,
  className,
  label,
  showPercentage = false,
  size = 'md',
  color = 'primary',
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return 'bg-mars';
      case 'secondary':
        return 'bg-space-blue';
      case 'accent':
        return 'bg-accent';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-mars';
    }
  };

  const getHeightClass = () => {
    switch (size) {
      case 'sm':
        return 'h-1.5';
      case 'md':
        return 'h-2.5';
      case 'lg':
        return 'h-4';
      default:
        return 'h-2.5';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1 text-sm">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', getHeightClass())}>
        <div
          className={cn('transition-all ease-in-out duration-500 rounded-full', getColorClass(), getHeightClass())}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
