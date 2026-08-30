'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { post } from '@/utils/api-service';

import Button from '../button';
import TextInput from '../textInput';

import './index.scss';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email validation
  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await post(
        'newsletter',
        {
          newsletter: {
            email: email.trim().toLowerCase(),
          },
        },
        true,
        false,
        1,
      );

      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
   } catch (error) {
  const apiError =
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    'Failed to subscribe. Please try again.';

  if (apiError.toLowerCase().includes('already')) {
    toast.info(apiError); 
  } else {
    toast.error(apiError);
  }
} finally {
  setIsSubmitting(false);
}

  };

  return (
    <div className="newsletter">
      <h3 className="newsletter__title">Newsletter</h3>

      <div className="newsletter__form-caption">
        <form className="newsletter__form" onSubmit={handleSubscribe}>
          <TextInput
            placeholder="Enter your email address"
            size="medium"
            grayPlaceholder
            textColor="light"
            value={email}
            setValue={setEmail}
          />

          <Button
            size="large"
            type="primary"
            icon="arrowRight"
            animateIcon
            iconPosition="after"
            disabled={isSubmitting}
            style={{ backgroundColor: '#0092E3', color: '#fff' }}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
