'use client';
import { Suspense, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '@/components/button';
import Heading from '@/components/heading';
import Loader from '@/components/loader';
import Text from '@/components/text';
import TextInput from '@/components/textInput';
import SubscriptionContext from '@/context/subscriptionContext';
import { post } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { saveToCookies, saveToLocalStorage } from '@/utils/helper';
import useLocalStorage from '@/utils/useLocalData';

import './index.scss';

const SignIn = () => {
  const { fetchData } = useContext(SubscriptionContext);
  const route = useRouter();
  const query = useSearchParams();
  const [localData] = useLocalStorage('user');
  if (localData) {
    route.push('/user-account/dashboard');
  }

  const {
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data) => {
    const toastId = toast.loading('Loading...');

    post(API_ENDPOINTS.LOGIN, { ...data })
      .then((response) => {
        const data = response?.data;

        toast.update(toastId, {
          render: 'Successfully logged in',
          type: 'success',
          isLoading: false,
          autoClose: 2500,
          hideProgressBar: false,
        });
        saveToLocalStorage(data);
        saveToCookies();
        fetchData();
        const redirect = query.get('redirect');
        if (redirect) {
          route.push(redirect);
        } else {
          route.push('/user-account/dashboard');
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.errors?.[0] || "Sorry can't log in now";

        toast.update(toastId, {
          render: errorMessage,
          type: 'error',
          isLoading: false,
          autoClose: 2500,
          hideProgressBar: false,
        });
      });
  };

  return (
    <div className='signIn'>
      <div className='signIn__content'>
        <div>
          <Heading
            title={'Sign In'}
            type='h4'
            color='neutral-700'
            align='center'
          />
          <Text
            color='neutral-500'
            size='fs-16'
          >
            Please enter your information.
          </Text>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='signIn__form__wrapper'
        >
          <div className='signIn__input__wrapper'>
            <div className='signIn__form'>
              <div className='signIn--mb-4'>
                <Text
                  color='neutral-700'
                  size='fs-16'
                  weight='bold'
                  htmlFor='email'
                  type='label'
                >
                  Email
                </Text>
              </div>
              <Controller
                name='email'
                control={control}
                rules={{
                  required: 'Email is Required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Provide a valid Email',
                  },
                }}
                render={({ field, fieldState }) => {
                  return (
                    <TextInput
                      value={field.value}
                      setValue={(value) => {
                        setValue('email', value);
                        trigger('email');
                      }}
                      errorMessage={fieldState.error && fieldState.error.message}
                      size='medium'
                      id='email'
                      placeholder='Enter your email'
                    />
                  );
                }}
              />
            </div>
            <div className='signIn__form'>
              <div className='signIn--mb-4'>
                <Text
                  color='neutral-700'
                  size='fs-16'
                  weight='bold'
                  htmlFor='password'
                  type='label'
                >
                  Password
                </Text>
              </div>
              <Controller
                name='password'
                control={control}
                rules={{
                  required: 'Password is Required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
                render={({ field, fieldState }) => {
                  return (
                    <TextInput
                      value={field.value}
                      type='password'
                      setValue={(value) => {
                        setValue('password', value);
                        trigger('password');
                      }}
                      errorMessage={fieldState.error && fieldState.error.message}
                      size='medium'
                      id='password'
                      placeholder='Enter your password'
                    />
                  );
                }}
              />
            </div>
            <div className='signIn--flex-row signIn--flex-end'>
              <Button
                type='link'
                size='medium'
                href={'/forgot-password'}
              >
                Forgot password?
              </Button>
            </div>
          </div>
          <Button
            isFullWidth
            type='primary'
            size='large'
            icon={'arrowRight'}
            iconPosition={'after'}
            animateIcon={true}
          >
            Sign In
          </Button>
        </form>
        <div>
          <div className='signIn--flex-row signIn--mb-20'>
            <Text
              color='neutral-500'
              size='fs-14'
            >
              Don’t have an account?
            </Text>
            <Button
              type='link'
              size='medium'
              href={'/sign-up'}
            >
              Sign Up
            </Button>
          </div>
          {/* <Button
            type='link'
            size='large'
            href={'/resend-confirmation'}
          >
            I didn’t receive confirmation!
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default function SignInPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SignIn />
    </Suspense>
  );
}
