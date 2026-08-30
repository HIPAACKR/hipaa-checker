'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams || !router) return; // Safeguard against undefined
    const resetPasswordToken = searchParams.get('reset_password_token');
    if (resetPasswordToken) {
      router.push(`/reset-password?reset_password_token=${resetPasswordToken}`);
    }
  }, [searchParams, router]);

  return <div className='flex items-center justify-center h-[400px]'>Please Wait For A While</div>;
};

const SuspendedResetPasswordRedirect = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordRedirect />
  </Suspense>
);

export default SuspendedResetPasswordRedirect;
