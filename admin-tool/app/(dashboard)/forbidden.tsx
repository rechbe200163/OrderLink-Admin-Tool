'use client';

import { useRouter } from 'next/navigation';

export default function InsufficientPermissions() {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-black flex items-center justify-center px-4'>
      <div className='flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8 text-white text-center md:text-left'>
        {/* Large icon or identifier for permissions */}
        <div className='text-6xl md:text-8xl font-light'>🔐</div>{' '}
        {/* Using a lock emoji for visual cue */}
        {/* Vertical separator line for larger screens */}
        <div className='hidden md:block h-16 md:h-24 w-px bg-white/30'></div>
        {/* Error message and link */}
        <div className='space-y-4'>
          <h1 className='text-3xl md:text-4xl font-bold'>Zugriff verweigert</h1>
          <p className='text-lg md:text-xl font-light'>
            Du hast nicht die notwendigen Berechtigungen, um diese Seite
            aufzurufen.
          </p>
          <button
            onClick={() => router.back()}
            className='inline-block text-sm md:text-base text-white/70 hover:text-white transition-colors underline underline-offset-4 cursor-pointer'
          >
            Zurück zur vorherigen Seite
          </button>
        </div>
      </div>
    </div>
  );
}
