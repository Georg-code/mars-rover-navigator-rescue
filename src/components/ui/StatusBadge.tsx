
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'online' | 'processing' | 'offline' | 'warning' | 'success';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'offline':
        return 'bg-gray-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className={cn('w-2.5 h-2.5 rounded-full', getStatusColor())}></div>
        <div
          className={cn(
            'absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-75',
            getStatusColor()
          )}
        ></div>
      </div>
      {label && <span className="text-xs text-gray-300">{label}</span>}
    </div>
  );
};

export default StatusBadge;
