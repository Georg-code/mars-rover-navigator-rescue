
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

const SectionTitle = ({ title, subtitle, icon, className }: SectionTitleProps) => {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-mars">{icon}</div>}
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
