'use client';
import { useState } from 'react';

import Button from '@/components/button';
import EyeCatch from '@/components/eye-catch';
import Heading from '@/components/heading';
import Subtitle from '@/components/subtitle';
import Text from '@/components/text';
import TextInput from '@/components/textInput';
import {post} from '@/utils/api-service';

import './index.scss';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    // phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

 const handleSubmit = async () => {
  
  if (
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.email.trim() ||
    !formData.message.trim()
  ) {
    setSubmitStatus({
      type: 'error',
      message: 'Please fill in all required fields.',
    });

    setTimeout(() => {
      setSubmitStatus(null);
    }, 3000);

    return; 
  }

  setIsSubmitting(true);
  setSubmitStatus(null);

  try {
    await post(
      'contact_us',
      {
        user_contacts: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          message: formData.message,
        },
      },
      true,
      false,
      1,
    );

    setSubmitStatus({
      type: 'success',
      message: 'Your message has been sent successfully!',
    });

    setTimeout(() => {
      setSubmitStatus(null);
    }, 3000);

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    });
  } catch (error) {
    setSubmitStatus({
      type: 'error',
      message:
        error?.response?.data?.message ||
        'Failed to send message. Please try again.',
    });

    setTimeout(() => {
      setSubmitStatus(null);
    }, 3000);
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <div className='contactUs'>
      <EyeCatch param='contact-us' />

      <div className='contactUs__body'>
        <div className='contactUs__content'>
          <div className='contactUs__content__textWrapper'>
            <Heading
              type='h3'
              title={'Contact us'}
              color={'primary-850'}
              align='left'
            />

            <Subtitle>How can we help?</Subtitle>
            <Text size='fs-16' color='neutral-700'>
              Have a question? Fill out the form below, and we&apos;ll get back to you as soon as
              possible.
            </Text>
          </div>
          
          <div className='contactUs__content__form'>
           <TextInput
            size='medium'
            placeholder='First name'
            value={formData.firstName}
            setValue={(value) => handleInputChange('firstName', value)}
          />

          <TextInput
            size='medium'
            placeholder='Last name'
            value={formData.lastName}
            setValue={(value) => handleInputChange('lastName', value)}
          />

          <TextInput
            size='medium'
            placeholder='Email address'
            type='email'
            value={formData.email}
            setValue={(value) => handleInputChange('email', value)}
          />
            
          <textarea
            className='contactUs__content__form__textArea'
            placeholder='Describe your issue'
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
          />          
            {submitStatus && (
              <div className={`contactUs__content__form__status contactUs__content__form__status--${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}
            
            <Button
              isFullWidth
              type='primary'
              size='large'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;