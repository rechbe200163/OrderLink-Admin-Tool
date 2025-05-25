import { CircleAlert } from 'lucide-react';

export default function CustomeToast({
  variant = 'error',
  message,
}: {
  variant?: 'error' | 'success' | 'info' | 'warning';
  message: string;
}) {
  const baseClasses =
    'rounded-lg border px-4 py-3 text-sm flex items-center gap-2';
  const iconClasses = 'inline-flex opacity-60';

  const variantStyles = {
    error:
      'border-red-500/50 text-red-600 bg-red-100 dark:bg-red-800/30 dark:text-red-400',
    success:
      'border-green-500/50 text-green-600 bg-green-100 dark:bg-green-800/30 dark:text-green-400',
    info: 'border-blue-500/50 text-blue-600 bg-blue-100 dark:bg-blue-800/30 dark:text-blue-400',
    warning:
      'border-yellow-500/50 text-yellow-600 bg-yellow-100 dark:bg-yellow-800/30 dark:text-yellow-400',
  };

  return (
    <div className={`${baseClasses} ${variantStyles[variant]}`}>
      <CircleAlert
        className={iconClasses}
        size={16}
        strokeWidth={2}
        aria-hidden='true'
      />
      <p>{message}</p>
    </div>
  );
}
