# Generic Dialog Form Component

A reusable dialog form component for creating standardized form dialogs throughout the application.

## Features

- ✅ Customizable trigger button (text, icon, variant)
- ✅ Flexible dialog content (title, description)
- ✅ Form state management integration
- ✅ Children-based form fields
- ✅ Configurable submit and cancel buttons
- ✅ Built-in loading states
- ✅ Error/success message display
- ✅ Controlled or uncontrolled dialog state
- ✅ TypeScript support with full type safety

## Installation

```tsx
import { GenericDialogForm } from '@/components/forms/generic';
```

## Basic Usage

```tsx
'use client';

import { GenericDialogForm } from '@/components/forms/generic';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { FormState } from '@/lib/form.types';

// Your server action
const addItemAction = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  'use server';
  
  const name = formData.get('name') as string;
  
  if (!name) {
    return { success: false, message: 'Name is required' };
  }
  
  // Your logic here...
  
  return { success: true, message: 'Item added successfully' };
};

export function AddItemForm() {
  return (
    <GenericDialogForm
      triggerButtonText='Add Item'
      triggerButtonIcon={<Plus className='h-4 w-4' />}
      dialogTitle='Add New Item'
      dialogDescription='Create a new item in the system.'
      serverAction={addItemAction}
      submitButtonText='Save Item'
    >
      {/* Option 1: Simple children */}
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          placeholder='Enter name'
        />
      </div>
    </GenericDialogForm>
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `triggerButtonText` | `string` | Text displayed on the trigger button |
| `dialogTitle` | `string` | Title of the dialog |
| `serverAction` | `(prevState: FormState, formData: FormData) => Promise<FormState> \| FormState` | Server action to handle form submission |
| `children` | `ReactNode \| ((formState: FormState, isPending: boolean) => ReactNode)` | Form fields to render inside the dialog. Can be static or a render function |
| `submitButtonText` | `string` | Text for the submit button |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `triggerButtonIcon` | `ReactNode` | `undefined` | Icon to display before trigger button text |
| `triggerButtonVariant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Button variant style |
| `dialogDescription` | `string` | `undefined` | Description text below the dialog title |
| `submitButtonPendingText` | `string` | `${submitButtonText}…` | Text shown while submitting |
| `cancelButtonText` | `string` | `'Abbrechen'` | Text for the cancel button |
| `showCancelButton` | `boolean` | `true` | Whether to show the cancel button |
| `dialogClassName` | `string` | `'bg-card border-border'` | Custom className for dialog content |
| `formClassName` | `string` | `'space-y-4'` | Custom className for form element |
| `open` | `boolean` | `undefined` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when open state changes |

## Advanced Examples

### Using Render Function for Dynamic Behavior

If you need access to `formState` or `isPending` in your form fields (for disabling inputs, showing errors, etc.), use the render function pattern:

```tsx
<GenericDialogForm
  triggerButtonText='Add User'
  triggerButtonIcon={<UserPlus className='h-4 w-4' />}
  dialogTitle='Create User'
  serverAction={createUserAction}
  submitButtonText='Create'
>
  {(formState, isPending) => (
    <>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input 
          id='email' 
          name='email' 
          type='email' 
          disabled={isPending} 
        />
        {formState.errors?.email && (
          <p className='text-sm text-red-500'>
            {formState.errors.email.join(', ')}
          </p>
        )}
      </div>
      
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input 
          id='password' 
          name='password' 
          type='password'
          disabled={isPending}
        />
      </div>
    </>
  )}
</GenericDialogForm>
```

### Passing Parameters to Server Action

If your server action needs additional parameters (like an ID), use `.bind()`:

```tsx
const updateItemAction = async (
  itemId: number,
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  'use server';
  // Your logic with itemId
};

<GenericDialogForm
  triggerButtonText='Edit Item'
  dialogTitle='Edit Item'
  serverAction={updateItemAction.bind(null, itemId)}
  submitButtonText='Update'
>
  {/* form fields */}
</GenericDialogForm>
```

### With Controlled State

```tsx
const [isOpen, setIsOpen] = useState(false);

<GenericDialogForm
  open={isOpen}
  onOpenChange={setIsOpen}
  triggerButtonText='Edit Item'
  dialogTitle='Edit Item'
  serverAction={editItemAction}
  submitButtonText='Update'
>
  {/* form fields */}
</GenericDialogForm>
```

### With Custom Button Variants

```tsx
<GenericDialogForm
  triggerButtonText='Delete Item'
  triggerButtonIcon={<Trash className='h-4 w-4' />}
  triggerButtonVariant='destructive'
  dialogTitle='Delete Item'
  dialogDescription='Are you sure you want to delete this item?'
  serverAction={deleteItemAction}
  submitButtonText='Delete'
  submitButtonPendingText='Deleting…'
  cancelButtonText='Cancel'
>
  {/* confirmation fields */}
</GenericDialogForm>
```

### Without Cancel Button

```tsx
<GenericDialogForm
  triggerButtonText='Submit Report'
  dialogTitle='Report Issue'
  serverAction={submitReportAction}
  submitButtonText='Submit'
  showCancelButton={false}
>
  {/* form fields */}
</GenericDialogForm>
```

## Form State Type

```typescript
type FormState = {
  success: boolean;
  message?: string;
  data?: any;
  errors?: {
    title: string[];
  };
};
```

## Integration with React 19 useActionState

This component internally uses React 19's `useActionState` hook, so you don't need to manage it yourself. Just pass your server action directly:

```tsx
// Define your server action
const yourServerAction = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  'use server';
  // Your logic here
  return { success: true, message: 'Done!' };
};

// Use it in the component
<GenericDialogForm
  serverAction={yourServerAction}
  // ... other props
>
  {/* children */}
</GenericDialogForm>
```

The component handles all form state management internally, including:
- Form submission state (`isPending`)
- Success/error messages (`formState.message`)
- Validation errors (`formState.errors`)
- Form state reset

## Styling

The component uses Tailwind CSS classes and shadcn/ui components. You can customize:

- Dialog appearance via `dialogClassName`
- Form layout via `formClassName`
- Button variants via `triggerButtonVariant`

## See Also

- `example-usage.tsx` - Complete working example
- `@/components/ui/dialog` - Underlying dialog component
- `@/components/ui/button` - Button component
