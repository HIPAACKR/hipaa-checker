'use client';
import { Suspense, useCallback,useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '@/components/button';
import Heading from '@/components/heading';
import Text from '@/components/text';
import TextInput from '@/components/textInput';
import { get, post } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { saveToCookies, saveToLocalStorage } from '@/utils/helper';
import useLocalStorage from '@/utils/useLocalData';

import TermsConditions from '../../(landing)/terms-conditions/page';

import './index.scss';

const SignUpContent = () => {
  const [activeTab, setActiveTab] = useState('Individual');
  const [isLoading, setIsLoading] = useState(false);
  const [organizationsData, setOrganizationsData] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [localData] = useLocalStorage('user');
  const route = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAcceptTerms, setAcceptTerms] = useState(false);
  const [readTerms, setReadTerms] = useState(false);
  const termsRef = useRef(null);
  const searchParams = useSearchParams();
  const [invitationToken, setInvitationToken] = useState(null);
  const [organizationNameFromUrl, setOrganizationNameFromUrl] = useState(null);
  const [isOrganizationFromUrl, setIsOrganizationFromUrl] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  if (localData) {
    route.push('/user-account/dashboard');
  }

  const {
    handleSubmit,
    setValue,
    getValues,
    trigger,
    control,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      is_accept_terms: false,
    },
  });

  const getOrganizationData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await get(API_ENDPOINTS.ORGANIZATIONS, true);
      const data = response?.data;
      const allOrganizations = [...data, { id: 10001, name: 'Other' }];
  
      setOrganizationsData(allOrganizations);
  
      if (organizationNameFromUrl) {
        const matchedOrg = allOrganizations.find(
          (org) => org.name.toLowerCase() === organizationNameFromUrl.toLowerCase(),
        );
  
        if (matchedOrg) {
          setSelectedOrganizationId(matchedOrg.id);
        } else {
          setSelectedOrganizationId(null); 
        }
      }
  
      setDataFetched(true);
    } catch (error) {
      // toast.error('Failed to load organizations');
    } finally {
      setIsLoading(false);
    }
  }, [organizationNameFromUrl]);

  useEffect(() => {
    const token = searchParams.get('invitation_token');
    const orgName = searchParams.get('organization_name');
  
    if (token) {
      setInvitationToken(token);
    }
  
    if (orgName) {
      setOrganizationNameFromUrl(orgName);
      setActiveTab('Organization'); 
      setIsOrganizationFromUrl(true);
    }
  
    if (!dataFetched) {
      getOrganizationData();
    }
  }, [searchParams, getOrganizationData, dataFetched]);
  

  useEffect(() => {
    setValue('is_accept_terms', isAcceptTerms);
    if (isAcceptTerms) handleSubmit(onSubmit)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAcceptTerms]);

  useEffect(() => {
    const handleScroll = () => {
      const div = termsRef.current;
      if (div) {
        const isAtBottom = div.scrollHeight - div.scrollTop <= div.clientHeight + 1;
        if (isAtBottom) setReadTerms(true);
      }
    };

    const termsDiv = termsRef.current;
    if (termsRef.current) {
      termsDiv.addEventListener('scroll', handleScroll);
      return () => termsDiv.removeEventListener('scroll', handleScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termsRef?.current]);

  const onSubmit = (data) => {
    if (!isAcceptTerms) {
      setModalOpen(true);
      return;
    }

    const userData = {
      user: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        is_accept_terms: 1,
        is_individual: activeTab === 'Individual' ? 1 : 0,
        ...(activeTab === 'Organization' && { 
          organization_name: organizationNameFromUrl || data.user.organization_name 
        }),
      },
      ...(invitationToken && { invitation_token: invitationToken }),
    };

    // console.log('Sign Up Payload:', userData);

    const toastId = toast.loading('Loading...');

    post(API_ENDPOINTS.REGISTRATION, userData)
      .then((response) => {
        logInUser(userData.user.email, userData.user.password, toastId);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.errors?.[0] || "Sorry, can't register now";

        setAcceptTerms(false);
        setReadTerms(false);
        toast.update(toastId, {
          render: errorMessage,
          type: 'error',
          isLoading: false,
          autoClose: 2500,
          hideProgressBar: false,
        });
      });
  };

  const logInUser = (email, password, toastId) => {
    const data = { email, password };

    post(API_ENDPOINTS.LOGIN, { ...data })
      .then((response) => {
        const data = response?.data;

        toast.update(toastId, {
          render: 'Successfully registered',
          type: 'success',
          isLoading: false,
          autoClose: 2500,
          hideProgressBar: false,
        });
        saveToLocalStorage(data);
        saveToCookies();
        route.push('/user-account/dashboard');
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.errors?.[0] || "Sorry, can't log in now";

        toast.update(toastId, {
          render: errorMessage,
          type: 'error',
          isLoading: false,
          autoClose: 2500,
          hideProgressBar: false,
        });
      });
  };

  const handleOrganizationChange = (value) => {
    setSelectedOrganizationId(value);
  };

  const displayOrganizationName = () => {
    if (isOrganizationFromUrl && organizationNameFromUrl) {
      return organizationNameFromUrl;
    }
    return null;
  };

  return (
    <div className={`signUp ${isModalOpen ? 'signUp--modalOpen' : ''}`}>
      <div className='signUp__content'>
        <div className='signUp--flex-column signUp--gap-4'>
          <Heading
            title={'Create your account'}
            type='h4'
            color='neutral-700'
            align='center'
          />
          <Text
            color='neutral-500'
            size='fs-16'
          >
            Begin by creating an account.
          </Text>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='signUp__form__wrapper'
        >
          <div className='signUp__input__wrapper'>
            {!isOrganizationFromUrl ? (
              <div className='signUp__tabWrapper signUp--mb-16'>
                <div
                  className={`signUp__tab signUp--flex-row signUp--gap-12 signUp--sp-gap-8 ${activeTab === 'Individual' ? 'signUp--blueBG' : 'signUp--grayBorder'}`}
                  onClick={() => setActiveTab('Individual')}
                >
                  <input
                    type='radio'
                    checked={activeTab === 'Individual'}
                  />
                  <Text
                    color='neutral-700'
                    size='fs-18'
                  >
                    Individual
                  </Text>
                </div>
                <div
                  className={`signUp__tab signUp--flex-row signUp--gap-12 signUp--sp-gap-8 ${activeTab === 'Organization' ? 'signUp--blueBG' : 'signUp--grayBorder'}`}
                  onClick={() => setActiveTab('Organization')}
                >
                  <input
                    type='radio'
                    checked={activeTab === 'Organization'}
                  />
                  <Text
                    color='neutral-700'
                    size='fs-18'
                  >
                    Organization
                  </Text>
                </div>
              </div>
            ) : null}
            {activeTab === 'Organization' && (
              <div className='signUp__form signUp--mb-16'>
                {isOrganizationFromUrl ? (
                  <>
                    <div className='signUp--mb-4'>
                      <Text
                        color='neutral-700'
                        size='fs-16'
                        weight='bold'
                        type='label'
                      >
                        Organization
                      </Text>
                    </div>
                    <div className='signUp--p-4 signUp--grayBorder signUp--rounded'>
                      <Text
                        color='neutral-700'
                        size='fs-16'
                      >
                        {displayOrganizationName()}
                      </Text>
                    </div>
                    <div className='signUp--mt-2'>
                      <Text
                        color='neutral-500'
                        size='fs-12'
                      >
                        Organization selected from invitation
                      </Text>
                    </div>
                  </>
                ) : (
                  <div className='signUp__form signUp--mb-16'>
                    <div className='signUp--mb-4'>
                      <Text
                        color='neutral-700'
                        size='fs-16'
                        weight='bold'
                        htmlFor='user[organization_name]'
                        type='label'
                      >
                        Organization
                      </Text>
                    </div>

                    <Controller
                      name='user[organization_name]'
                      control={control}
                      rules={{
                        required: 'Organization is Required',
                      }}
                      render={({ field, fieldState }) => (
                        <TextInput
                          value={field.value}
                          setValue={(value) => {
                            setValue('user[organization_name]', value);
                            trigger('user[organization_name]');
                          }}
                          errorMessage={fieldState.error && fieldState.error.message}
                          size='medium'
                          id='organization_name'
                          placeholder='Enter your organization name'
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            )}
            {activeTab === 'Organization' &&
              selectedOrganizationId === 10001 &&
              !isOrganizationFromUrl && (
                <div className='signUp__form signUp--mb-16'>
                  <div className='signUp--mb-4'>
                    <Text
                      color='neutral-700'
                      size='fs-16'
                      weight='bold'
                      htmlFor='user[organization_name]'
                      type='label'
                    >
                      Organization
                    </Text>
                  </div>

                  <Controller
                    name='user[organization_name]'
                    control={control}
                    rules={{
                      required: 'Organization is Required',
                    }}
                    render={({ field, fieldState }) => (
                      <TextInput
                        value={field.value}
                        setValue={(value) => {
                          setValue('user[organization_name]', value);
                          trigger('user[organization_name]');
                        }}
                        errorMessage={fieldState.error && fieldState.error.message}
                        size='medium'
                        id='organization_name'
                        placeholder='Enter your organization name'
                      />
                    )}
                  />
                </div>
              )}

            <div className='signUp__name-input'>
              <div className='signUp__form signUp--mb-16'>
                <div className='signUp--mb-4'>
                  <Text
                    color='neutral-700'
                    size='fs-16'
                    weight='bold'
                    htmlFor='first_name'
                    type='label'
                  >
                    First Name
                  </Text>
                </div>
                <Controller
                  name='first_name'
                  control={control}
                  rules={{
                    required: 'First name is Required',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <TextInput
                        value={field.value}
                        setValue={(value) => {
                          setValue('first_name', value);
                          trigger('first_name');
                        }}
                        errorMessage={fieldState.error && fieldState.error.message}
                        size='medium'
                        id='first_name'
                      />
                    );
                  }}
                />
              </div>
              <div className='signUp__form signUp--mb-16'>
                <div className='signUp--mb-4'>
                  <Text
                    color='neutral-700'
                    size='fs-16'
                    weight='bold'
                    htmlFor='last_name'
                    type='label'
                  >
                    Last Name
                  </Text>
                </div>
                <Controller
                  name='last_name'
                  control={control}
                  rules={{
                    required: 'Last name is Required',
                  }}
                  render={({ field, fieldState }) => {
                    return (
                      <TextInput
                        value={field.value}
                        setValue={(value) => {
                          setValue('last_name', value);
                          trigger('last_name');
                        }}
                        errorMessage={fieldState.error && fieldState.error.message}
                        size='medium'
                        id='last_name'
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className='signUp__form signUp--mb-16'>
              <div className='signUp--mb-4'>
                <Text
                  color='neutral-700'
                  size='fs-16'
                  weight='bold'
                  htmlFor='email'
                  type='label'
                >
                  Enter Email
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
            <div className='signUp__form signUp--mb-16'>
              <div className='signUp--mb-4'>
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
                      setValue={(value) => {
                        setValue('password', value);
                        trigger('password');
                      }}
                      errorMessage={fieldState.error && fieldState.error.message}
                      type={'password'}
                      size='medium'
                      hint={'6 characters minimum'}
                      id='password'
                      placeholder='Enter your password'
                    />
                  );
                }}
              />
            </div>
            <div className='signUp__form'>
              <div className='signUp--mb-4'>
                <Text
                  color='neutral-700'
                  size='fs-16'
                  weight='bold'
                  htmlFor='password_confirmation'
                  type='label'
                >
                  Confirm Password
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
                      placeholder='Re-enter your password'
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
            Sign Up
          </Button>
        </form>

        <div className='signUp--flex-row signUp--gap-4 signUp--center'>
          <Text
            color='neutral-500'
            size='fs-14'
          >
            Already have an account?
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
      {isModalOpen && (
        <div className='signUp__modal'>
          <div className='signUp__modal__content'>
            <div className='signUp__modal__header'>
              <div className='signUp__modal__header__titleWrapper'>
                <Heading
                  title={'Terms and conditions'}
                  type='h6'
                />
                <Image
                  onClick={() => {
                    setModalOpen(false);
                    setAcceptTerms(false);
                    setReadTerms(false);
                  }}
                  className='signUp__modal__header__cross'
                  src={'/images/icons/cross.svg'}
                  alt='cross-icon'
                  width={24}
                  height={24}
                />
              </div>
              <Text
                size='fs-14'
                color='neutral-500'
              >
                Please read the full Terms and Conditions
              </Text>
            </div>
            <div
              className='signUp__modal__terms'
              ref={termsRef}
            >
              <TermsConditions type={'modal'} />
            </div>
            <div className='signUp__modal__buttonWrapper'>
              <Button
                isFullWidth
                type='secondary'
                onClick={() => {
                  setModalOpen(false);
                  setAcceptTerms(false);
                  setReadTerms(false);
                  toast.info('You must agree with our terms and conditions');
                }}
              >
                Cancel
              </Button>
              <Button
                isFullWidth
                isDisabled={!readTerms}
                onClick={() => {
                  setModalOpen(false);
                  setAcceptTerms(true);
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SignUp = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
};

export default SignUp;