'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { post } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';

const SignInRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const ConfirmUser = async (confirmationToken) => {
    if (confirmationToken) {
      try {
        const response = await post(
          `${API_ENDPOINTS.USER_CONFIRMATION}/?confirmation_token=${confirmationToken}`,
        );
        const data = await response?.data;
        setMessage(
          <>
            Congratulations! Your email is confirmed! Please{' '}
            <Link
              href='/sign-in'
              className='text-blue-500 underline'
            >
              <span className='font-bold mx-2'>Login</span>
            </Link>{' '}
            to continue now.
          </>,
        );
      } catch (error) {
        if (error.response?.data?.errors?.length) {
          setMessage(error.response.data.errors[0]);
        } else {
          setMessage('Failed to confirm email, please try again');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!searchParams || !router) return;

    const confirmationToken = searchParams.get('confirmation_token');
    ConfirmUser(confirmationToken);
  }, [searchParams, router]);

  return (
    <div className='flex items-center justify-center h-[400px] text-xl'>
      {loading ? 'Please wait for a while...' : message}
    </div>
  );
};

const SuspendedSignInRedirect = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SignInRedirect />
  </Suspense>
);

export default SuspendedSignInRedirect;
