'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '@/components/button';
import Heading from '@/components/heading';
import Text from '@/components/text';
import TextInput from '@/components/textInput';
import { put } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import useLocalStorage from '@/utils/useLocalData';

import './index.scss';

const ResetPassword = () => {
  const [passwordResetToken, setPasswordResetToken] = useState('invalid-token');
  const [localData] = useLocalStorage('user');
  const route = useRouter();
  if (localData) {
    route.push('/user-account/dashboard');
  }

  const {
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  const token = useSearchParams().get('reset_password_token');

  useEffect(() => {
    setPasswordResetToken(token || 'invalid-token');
  }, [token]);

  const onSubmit = (data) => {
    const toastId = toast.loading('Loading...');
    put(`${API_ENDPOINTS.RESET_PASSWORD}/${passwordResetToken}`, { ...data })
      .then((response) => {
        const data = response?.data;

        toast.update(toastId, {
          render: 'Successfully reset your password',
          type: 'success',
          isLoading: false,
          autoClose: 2500,
          hideProgressBar: false,
        });
        route.push('/sign-in');
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.errors?.[0] || "Sorry can't reset password now";

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
    <div className='resetPass'>
      <div className='resetPass__content'>
        <div className='resetPass__header'>
          <Heading
            title={'Set new Password'}
            type='h4'
            color='neutral-700'
            align='center'
          />
          <Text
            color='neutral-500'
            size='fs-16'
            align='center'
          >
            Choose a new password to protect your account.
          </Text>
        </div>
        <form
          className='resetPass__form__wrapper'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='resetPass__input__wrapper'>
            <div className='resetPass__form resetPass--mb-16'>
              <div className='resetPass--mb-4'>
                <Text
                  color='neutral-700'
                  size='fs-16'
                  weight='bold'
                  htmlFor='password'
                  type='label'
                >
                  New Password
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
                      setValue={(value) => {
                        setValue('password', value);
                        trigger('password');
                      }}
                      errorMessage={fieldState.error && fieldState.error.message}
                      type={'password'}
                      size='medium'
                      hint={'6 characters minimum'}
                      id='password'
                    />
                  );
                }}
              />
            </div>
            <div className='resetPass__form'>
              <div className='resetPass--mb-4'>
                <Text
                  color='neutral-700'
                  size='fs-16'
                  weight='bold'
                  htmlFor='password_confirmation'
                  type='label'
                >
                  Re-enter Password
                </Text>
              </div>

              <Controller
                name='password_confirmation'
                control={control}
                rules={{
                  required: 'Confirm Password is Required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                  validate: (value) =>
                    value === watch('password') || 'Confirm password must match with password',
                }}
                render={({ field, fieldState }) => {
                  return (
                    <TextInput
                      value={field.value}
                      setValue={(value) => {
                        setValue('password_confirmation', value);
                        trigger('password_confirmation');
                      }}
                      errorMessage={fieldState.error && fieldState.error.message}
                      type={'password'}
                      size='medium'
                      id='password_confirmation'
                    />
                  );
                }}
              />
            </div>
          </div>
          <Button
            isFullWidth
            type='primary'
            size='large'
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
