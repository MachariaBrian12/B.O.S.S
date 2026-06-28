'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Reset password is now handled on the forgot-password page
// This redirect handles any old links that might point here
export default function ResetPassword() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/forgot-password');
  }, []);
  return null;
}
