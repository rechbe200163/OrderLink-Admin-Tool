import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ToolTipWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  label?: string;
}

export default function ToolTipWrapper({
  children,
  label,
}: ToolTipWrapperProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className='px-2 py-1 text-xs'>
          {label || 'This is a simple tooltip '}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
