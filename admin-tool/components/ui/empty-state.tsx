import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  isFiltered?: boolean;
  filterMessage?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  isFiltered = false,
  filterMessage,
}: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-12 px-4'>
      <div className='rounded-full bg-muted p-6 mb-4'>
        <Icon className='h-12 w-12 text-muted-foreground' />
      </div>
      <h3 className='text-lg font-semibold text-foreground mb-2'>{title}</h3>
      <p className='text-sm text-muted-foreground text-center max-w-sm mb-6'>
        {description}
      </p>
      {isFiltered && filterMessage && (
        <p className='text-xs text-muted-foreground/80 mb-4 text-center max-w-md italic'>
          {filterMessage}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant='default'>
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface TableEmptyStateProps {
  colSpan: number;
  children: ReactNode;
}

export function TableEmptyState({ colSpan, children }: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className='h-[400px]'>
        {children}
      </td>
    </tr>
  );
}
