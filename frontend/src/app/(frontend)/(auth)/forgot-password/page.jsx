'use client';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '@/components/button';
import Heading from '@/components/heading';
import Text from '@/components/text';
import TextInput from '@/components/textInput';
import { post } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import useLocalStorage from '@/utils/useLocalData';

import './index.scss';

const ForgotPassword = () => {
  const [localData] = useLocalStorage('user');
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
    },
  });
  const route = useRouter();

  if (localData) {
    route.push('/user-account/dashboard');
  }

  const onSubmit = (data) => {
    const toastId = toast.loading('Loading...');

    post(API_ENDPOINTS.FORGOT_PASSWORD, { ...data })
      .then((response) => {
        const data = response?.data;

        toast.update(toastId, {
          render: 'Please check your email and follow the instruction',
          type: 'success',
          isLoading: false,
          autoClose: 2500,
          hideProgressBar: false,
        });
        route.push('/sign-in');
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.errors?.[0] || "Sorry can't send email instruction now";

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
    <div className='forgotPassword'>
      <div className='forgotPassword__content'>
        <div className='forgotPassword__header'>
          <Heading
            title={'Forgot password?'}
            type='h4'
            color='neutral-700'
            align='center'
          />
          <Text
            color='neutral-500'
            size='fs-16'
            align='center'
          >
            We will send instruction to the email address below to reset your password.
          </Text>
        </div>
        <form
          className='forgotPassword__form__wrapper'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='forgotPassword__input__wrapper'>
            <div className='forgotPassword__form'>
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
                      type='email'
                      placeholder='Email address'
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
            icon={'arrowRight'}
            iconPosition={'after'}
            animateIcon={true}
          >
            Send reset instructions
          </Button>
        </form>
        <div>
          <div className='forgotPassword--flex-row'>
            <Text
              color='neutral-500'
              size='fs-14'
            >
              Remember password?
            </Text>
            <Button
              type='link'
              size='medium'
              href={'/sign-in'}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
