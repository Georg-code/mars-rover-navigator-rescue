
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DataCardProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const DataCard = ({ title, icon, className, children }: DataCardProps) => {
  return (
    <Card className={cn('border border-mars-dark/30 bg-card shadow-lg overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-r from-muted to-card border-b border-mars-dark/20">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon && <span className="text-mars">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {children}
      </CardContent>
    </Card>
  );
};

export default DataCard;
