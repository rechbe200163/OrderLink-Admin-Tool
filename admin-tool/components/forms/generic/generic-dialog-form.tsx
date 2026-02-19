'use client';

import { ReactNode, useActionState, useState } from 'react';
import { FormState } from '@/lib/form.types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const initialFormState: FormState = {
  success: false,
  message: '',
};

export interface GenericDialogFormProps {
  // Trigger button props
  triggerButtonText: string;
  triggerButtonIcon?: ReactNode;
  triggerButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  
  // Dialog props
  dialogTitle: string;
  dialogDescription?: string;
  
  // Server action
  serverAction: (prevState: FormState, formData: FormData) => Promise<FormState> | FormState;
  
  // Children (form fields) - receives formState and isPending
  children: ReactNode | ((formState: FormState, isPending: boolean) => ReactNode);
  
  // Submit button props
  submitButtonText: string;
  submitButtonPendingText?: string;
  
  // Cancel button props
  cancelButtonText?: string;
  showCancelButton?: boolean;
  
  // Additional customization
  dialogClassName?: string;
  formClassName?: string;
  
  // External control of dialog state (optional)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GenericDialogForm({
  triggerButtonText,
  triggerButtonIcon,
  triggerButtonVariant = 'default',
  dialogTitle,
  dialogDescription,
  serverAction,
  children,
  submitButtonText,
  submitButtonPendingText,
  cancelButtonText = 'Abbrechen',
  showCancelButton = true,
  dialogClassName,
  formClassName = 'space-y-4',
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: GenericDialogFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [formState, formAction, isPending] = useActionState<FormState, FormData>(
    serverAction,
    initialFormState
  );
  
  // Use controlled state if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerButtonVariant}>
          {triggerButtonIcon && <span className='mr-2'>{triggerButtonIcon}</span>}
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className={dialogClassName || 'bg-card border-border'}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {dialogDescription && (
            <DialogDescription>{dialogDescription}</DialogDescription>
          )}
        </DialogHeader>
        <form action={formAction} className={formClassName}>
          {typeof children === 'function' ? children(formState, isPending) : children}

          {formState.message && (
            <p
              className={`text-sm ${
                formState.success ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {formState.message}
            </p>
          )}
          
          <DialogFooter>
            {showCancelButton && (
              <Button
                variant='outline'
                type='button'
                onClick={handleCancel}
                disabled={isPending}
              >
                {cancelButtonText}
              </Button>
            )}
            <Button type='submit' disabled={isPending}>
              {isPending
                ? submitButtonPendingText || `${submitButtonText}…`
                : submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
