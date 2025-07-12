'use client';

import { cn } from '@/lib/utils';
import {
  Dispatch,
  SetStateAction,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  useDropzone,
  DropzoneState,
  FileRejection,
  DropzoneOptions,
} from 'react-dropzone';
import { toast } from 'sonner';
import { Trash2 as RemoveIcon } from 'lucide-react';
import Image from 'next/image';

type DirectionOptions = 'rtl' | 'ltr' | undefined;

type FileUploaderContextType = {
  dropzoneState: DropzoneState;
  isFileTooBig: boolean;
  removeFile: () => void;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  direction: DirectionOptions;
};

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error('useFileUpload must be used within a FileUploaderProvider');
  }
  return context;
};

type FileUploaderProps = {
  value: File | null;
  onValueChange: (value: File | null) => void;
  dropzoneOptions: DropzoneOptions;
};

export const FileUploader = forwardRef<
  HTMLDivElement,
  FileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      dropzoneOptions,
      value,
      onValueChange,
      children,
      dir,
      ...props
    },
    ref
  ) => {
    const [file, setFile] = useState<File | null>(value);
    const [isFileTooBig, setIsFileTooBig] = useState(false);
    const direction: DirectionOptions = dir === 'rtl' ? 'rtl' : 'ltr';

    const removeFile = useCallback(() => {
      setFile(null);
      onValueChange(null);
    }, [onValueChange]);

    const onDrop = useCallback(
      (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles.length > 0) {
          setFile(acceptedFiles[0]);
          onValueChange(acceptedFiles[0]);
        }

        if (rejectedFiles.length > 0) {
          const errorMsg = rejectedFiles[0].errors[0]?.message || 'File error';
          toast.error(errorMsg);
        }
      },
      [onValueChange]
    );

    const dropzoneState = useDropzone({
      ...dropzoneOptions,
      maxFiles: 1,
      multiple: false,
      onDrop,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
    });

    return (
      <FileUploaderContext.Provider
        value={{
          dropzoneState,
          isFileTooBig,
          removeFile,
          file,
          setFile,
          direction,
        }}
      >
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </FileUploaderContext.Provider>
    );
  }
);

FileUploader.displayName = 'FileUploader';

export const FileUploaderContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { file } = useFileUpload();
  return (
    <div className='w-full px-1'>
      <div
        {...props}
        ref={ref}
        className={cn('flex flex-col items-center', className)}
      >
        {file && (
          <div className='relative w-full max-w-xs'>
            <Image
              src={URL.createObjectURL(file)}
              alt='Uploaded preview'
              className='w-full rounded-lg shadow-md'
            />
          </div>
        )}
      </div>
    </div>
  );
});

FileUploaderContent.displayName = 'FileUploaderContent';

export const FileInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ..._props }, ref) => {
  const { dropzoneState, file, removeFile } = useFileUpload();
  return (
    <div ref={ref} className='relative w-full'>
      {!file ? (
        <div
          {...dropzoneState.getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer',
            className
          )}
        >
          <input {...dropzoneState.getInputProps()} />
          <p>Drag & drop or click to upload</p>
        </div>
      ) : (
        <button
          type='button'
          className='absolute top-2 right-2 bg-white p-1 rounded-full shadow-md'
          onClick={removeFile}
        >
          <RemoveIcon className='w-5 h-5 text-red-500' />
        </button>
      )}
    </div>
  );
});

FileInput.displayName = 'FileInput';
