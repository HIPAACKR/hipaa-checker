import { useMemo } from 'react';
import Image from 'next/image';
import * as countriesData from 'country-list';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import cardBankIcon from '@/../public/images/icons/cross_red_without_bg.svg';
import Button from '@/components/button';
import DropDown from '@/components/drop-down';
import Heading from '@/components/heading';
import Text from '@/components/text';
import TextInput from '@/components/textInput';
import { Index } from '@/components/ui/checkbox';
import { Modal, ModalBody, ModalHeader } from '@/components/ui/modal';

import './form.scss';

export const GetADemo = ({ isOpen, onClose }) => {

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
      numberOfEmployees: 10,
      firstName: '',
      lastName: '',
      companyName: '',
      jobTitle: '',
      country: '',
      hearAboutUs: '',
      interestedProducts: [],
    },
  });

  const getFormattedCountries = useMemo(() => {
    const countries = countriesData.getData();
    const formattedData = countries.map(country => ({
      id: country.code,
      name: country.name.replace(/\s*\(the\)$/i, ''),
      value: country.code
    }));
    const sortedData = formattedData.sort((a, b) => a.name.localeCompare(b.name));
    return sortedData;
  }, []);

  const hearAboutUsOptions = useMemo(() => {
    return [
      { id: 'facebook', name: 'Facebook', value: 'facebook' },
      { id: 'linkedin', name: 'LinkedIn', value: 'linkedin' },
      { id: 'twitter', name: 'Twitter', value: 'twitter' },
      { id: 'google', name: 'Google Search', value: 'google' },
      { id: 'referral', name: 'Referral from a colleague', value: 'referral' },
      { id: 'advertisement', name: 'Advertisement', value: 'advertisement' },
      { id: 'conference', name: 'Conference/Event', value: 'conference' },
      { id: 'blog', name: 'Blog/Article', value: 'blog' },
      { id: 'other', name: 'Other', value: 'other' },
    ];
  }, []);

  const productOptions = useMemo(() => {
    return [
      { id: 'soc2', name: 'SOC2 Compliance', value: 'soc2' },
      { id: 'gdpr', name: 'GDPR Compliance', value: 'gdpr' },
      { id: 'hipaa', name: 'HIPAA Compliance', value: 'hipaa' },
      { id: 'security', name: 'Security Compliance', value: 'security' },
      { id: 'other', name: 'Other', value: 'other' },
    ];
  }, []);

  const onSubmit = (data) => {
    const toastId = toast.loading('Loading...');
    // console.log(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={'720'}
    >
      <ModalHeader
        headerClassWrapper=''
        onClose={onClose}
        closeIcon={
          <div className='flex items-center justify-center rounded-full p-4'>
            <Image
              src={cardBankIcon}
              alt='Warning'
              width={45}
              height={45}
              className='card-icon'
              style={{
                filter:
                  'invert(24%) sepia(97%) saturate(3066%) hue-rotate(215deg) brightness(99%) contrast(105%)',
              }}
            />
          </div>
        }
        closeIconClassWrapper=''
      />
      <ModalBody className='pt-0 pr-[20px] md:pr-[75px] pb-[30px] md:pb-[75px] pl-[20px] md:pl-[75px]'>
        <Heading
          title={'Get a Demo'}
          type='h2'
        />
        <Heading
          title=''
          isNewLine={false}
          type='h4'
          weight='bold'
          align='left'
          lineHeight={'35'}
          className='heroSection__heading'
        >
          <span className='heading__extra-light'>Find out what </span>{' '}
          <span className='heading__medium'>UbiComply</span>{' '}
          <span className='heading__extra-light'>can do for your </span>{' '}
          <span className='heading__medium'>business.</span>
        </Heading>

        <Text
          size='fs-20'
          color='neutral-900'
          className={'mt-4 mb-5'}
        >
          You can reach us anytime via{' '}
          <a
            href='mailto:info@ubicomply.ai'
            className='form-modal__email-link'
          >
            info@ubicomply.ai
          </a>
        </Text>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='form-modal__wrapper'
        >
          <div className='form-modal__input-wrapper'>
            <div className='form-modal__field'>
              <div className='form-modal__label'>
                <Text
                  color='neutral-700'
                  size='fs-14'
                  weight='medium'
                  htmlFor='email'
                  type='label'
                >
                  Work Email *
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
                      placeholder='you@company.com'
                    />
                  );
                }}
              />
            </div>
            <div className='form-modal__field'>
              <div className='form-modal__label'>
                <Text
                  color='neutral-700'
                  size='fs-14'
                  weight='medium'
                  htmlFor='numberOfEmployees'
                  type='label'
                >
                  Number of Employees *
                </Text>
              </div>
              <Controller
                name='numberOfEmployees'
                control={control}
                rules={{
                  required: 'Number of Employees is Required',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Provide a valid Number of Employees',
                  },
                }}
                render={({ field, fieldState }) => {
                  return (
                    <DropDown
                      type={'object'}
                      value={field.value}
                      data={Array.from({ length: 10 }, (_, i) => {
                        const start = i * 10 + 1;
                        const end = start + 9;
                        return {
                          name: `${start - 1} - ${end}`,
                          id: start - 1,
                        };
                      })}
                      placeholder='Please select'
                    />
                  );
                }}
              />
            </div>
            <div className='form-modal__field'>
              <div className='form-modal__grid form-modal__grid--2-cols'>
                <div>
                  <div className='form-modal__label'>
                    <Text
                      color='neutral-700'
                      size='fs-14'
                      weight='medium'
                      htmlFor='firstName'
                      type='label'
                    >
                      First Name *
                    </Text>
                  </div>
                  <Controller
                    name='firstName'
                    control={control}
                    rules={{
                      required: 'First Name is Required',
                    }}
                    render={({ field, fieldState }) => {
                      return (
                        <TextInput
                          value={field.value}
                          setValue={(value) => {
                            setValue('firstName', value);
                            trigger('firstName');
                          }}
                          errorMessage={fieldState.error && fieldState.error.message}
                          size='medium'
                          id='firstName'
                          placeholder='First name'
                        />
                      );
                    }}
                  />
                </div>
                <div>
                  <div className='form-modal__label'>
                    <Text
                      color='neutral-700'
                      size='fs-14'
                      weight='medium'
                      htmlFor='lastName'
                      type='label'
                    >
                      Last Name *
                    </Text>
                  </div>
                  <Controller
                    name='lastName'
                    control={control}
                    rules={{
                      required: 'Last Name is Required',
                    }}
                    render={({ field, fieldState }) => {
                      return (
                        <TextInput
                          value={field.value}
                          setValue={(value) => {
                            setValue('lastName', value);
                            trigger('lastName');
                          }}
                          errorMessage={fieldState.error && fieldState.error.message}
                          size='medium'
                          id='lastName'
                          placeholder='Last name'
                        />
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='form-modal__field'>
              <div className='form-modal__grid form-modal__grid--2-cols'>
                <div>
                  <div className='form-modal__label'>
                    <Text
                      color='neutral-700'
                      size='fs-14'
                      weight='medium'
                      htmlFor='companyName'
                      type='label'
                    >
                      Company Name *
                    </Text>
                  </div>
                  <Controller
                    name='companyName'
                    control={control}
                    rules={{
                      required: 'Company Name is Required',
                    }}
                    render={({ field, fieldState }) => {
                      return (
                        <TextInput
                          value={field.value}
                          setValue={(value) => {
                            setValue('companyName', value);
                            trigger('companyName');
                          }}
                          errorMessage={fieldState.error && fieldState.error.message}
                          size='medium'
                          id='companyName'
                          placeholder='Company name'
                        />
                      );
                    }}
                  />
                </div>
                <div>
                  <div className='form-modal__label'>
                    <Text
                      color='neutral-700'
                      size='fs-14'
                      weight='medium'
                      htmlFor='jobTitle'
                      type='label'
                    >
                      Job Title *
                    </Text>
                  </div>
                  <Controller
                    name='jobTitle'
                    control={control}
                    rules={{
                      required: 'Job Title is Required',
                    }}
                    render={({ field, fieldState }) => {
                      return (
                        <TextInput
                          value={field.value}
                          setValue={(value) => {
                            setValue('jobTitle', value);
                            trigger('jobTitle');
                          }}
                          errorMessage={fieldState.error && fieldState.error.message}
                          size='medium'
                          id='jobTitle'
                          placeholder='Enter your job title'
                        />
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='form-modal__field'>
              <div className='form-modal__label'>
                <Text
                  color='neutral-700'
                  size='fs-14'
                  weight='medium'
                  htmlFor='country'
                  type='label'
                >
                  Country *
                </Text>
              </div>
              <Controller
                name='country'
                control={control}
                rules={{
                  required: 'Country is Required',
                }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <DropDown
                        type='string'
                        value={field.value}
                        data={getFormattedCountries}
                        placeholder='Select country'
                        setValue={(value) => {
                          setValue('country', value);
                          trigger('country');
                        }}
                        isFixedHeight={true}
                      />
                      {fieldState.error && (
                        <p className='form-modal__error'>{fieldState.error.message}</p>
                      )}
                    </>
                  );
                }}
              />
            </div>
            <div className='form-modal__field'>
              <div className='form-modal__label'>
                <Text
                  color='neutral-700'
                  size='fs-14'
                  weight='medium'
                  htmlFor='hearAboutUs'
                  type='label'
                >
                  How did you hear about us? *
                </Text>
              </div>
              <Controller
                name='hearAboutUs'
                control={control}
                rules={{
                  required: 'Please select how you heard about us',
                }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <DropDown
                        type='object'
                        value={field.value}
                        data={hearAboutUsOptions}
                        placeholder='Please select'
                        setValue={(value) => {
                          setValue('hearAboutUs', value);
                          trigger('hearAboutUs');
                        }}
                        isFixedHeight={true}
                      />
                      {fieldState.error && (
                        <p className='form-modal__error'>{fieldState.error.message}</p>
                      )}
                    </>
                  );
                }}
              />
            </div>
            <div className='form-modal__field'>
              <div className='form-modal__label'>
                <Text
                  color='neutral-700'
                  size='fs-14'
                  weight='medium'
                  htmlFor='interestedProducts'
                  type='label'
                  className='mb-5'
                >
                  Which product(s) are you interested in? *
                </Text>
              </div>
              <Controller
                name='interestedProducts'
                control={control}
                rules={{
                  validate: (value) => value.length > 0 || 'Please select at least one product',
                }}
                render={({ field, fieldState }) => {
                  const handleCheckboxChange = (productValue) => {
                    const currentValues = field.value || [];
                    const newValues = currentValues.includes(productValue)
                      ? currentValues.filter((v) => v !== productValue)
                      : [...currentValues, productValue];
                    setValue('interestedProducts', newValues);
                    trigger('interestedProducts');
                  };

                  return (
                    <>
                      <div className='form-modal__checkbox-group'>
                        {productOptions.map((product) => (
                          <Index
                            key={product.id}
                            id={product.id}
                            value={product.value}
                            checked={field.value?.includes(product.value) || false}
                            onChange={() => handleCheckboxChange(product.value)}
                            label={product.name}
                          />
                        ))}
                      </div>
                      {fieldState.error && (
                        <p className='form-modal__error'>{fieldState.error.message}</p>
                      )}
                    </>
                  );
                }}
              />
            </div>
          </div>
          <Button
            isFullWidth
            type='primary'
            size='large'
            radius='pill'
          >
            Get Started
          </Button>
        </form>
      </ModalBody>
      {/*<ModalFooter></ModalFooter>*/}
    </Modal>
  );
};
