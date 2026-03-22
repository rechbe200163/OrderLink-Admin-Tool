'use client';

import { ReactNode, useActionState } from 'react';
import { FormState } from '@/lib/form.types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialFormState: FormState = {
  success: false,
  message: null,
};

export interface GenericFormProps {
  // Server action
  serverAction: (
    prevState: FormState,
    formData: FormData,
  ) => Promise<FormState> | FormState;

  // Children (form fields) - receives formState and isPending
  children:
    | ReactNode
    | ((formState: FormState, isPending: boolean) => ReactNode);

  // Optional header
  title?: string;
  description?: string;

  // Submit button props
  submitButtonText: string;
  submitButtonPendingText?: string;

  // Additional customization
  formClassName?: string;

  // Optional cancel button
  cancelButtonText?: string;
  showCancelButton?: boolean;
  onCancel?: () => void;
}

export function GenericForm({
  serverAction,
  children,
  title,
  description,
  submitButtonText,
  submitButtonPendingText,
  formClassName = 'space-y-4',
  cancelButtonText = 'Abbrechen',
  showCancelButton = false,
  onCancel,
}: GenericFormProps) {
  const [formState, formAction, isPending] = useActionState<
    FormState,
    FormData
  >(serverAction, initialFormState);

  const isFaulty = formState.errors && Object.keys(formState.errors).length > 0;

  return (
    <div className='bg-card border-border rounded-lg border p-6'>
      {(title || description) && (
        <div className='mb-6'>
          {title && <h2 className='text-lg font-semibold'>{title}</h2>}
          {description && (
            <p className='text-muted-foreground text-sm'>{description}</p>
          )}
        </div>
      )}

      <form action={formAction} className={formClassName}>
        {typeof children === 'function'
          ? children(formState, isPending)
          : children}

        {formState.message && (
          <p
            className={`text-sm ${
              formState.success ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {formState.message}
          </p>
        )}

        {formState.errors && (
          <div className='mt-2 text-sm text-red-500'>
            {Object.entries(formState.errors).map(([field, messages]) => (
              <div key={field}>
                <strong>{field}:</strong> {messages.join(', ')}
              </div>
            ))}
          </div>
        )}

        <div className='mt-4 flex justify-end gap-2'>
          {showCancelButton && onCancel && (
            <Button
              variant='outline'
              type='button'
              onClick={onCancel}
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
        </div>

        {formState.success && (
          <Alert variant={isFaulty ? 'error' : 'success'} className='mt-4'>
            <AlertTitle>{formState.message}</AlertTitle>
            <AlertDescription>
              {formState.errors &&
                Object.entries(formState.errors).map(([field, messages]) => (
                  <div key={field}>
                    <strong>{field}:</strong> {messages.join(', ')}
                  </div>
                ))}
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
