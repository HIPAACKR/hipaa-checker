import Button from '@/components/button';
import Heading from '@/components/heading';
import Text from '@/components/text';

import './index.scss';

const ForgotPasswordMail = () => {
  return (
    <div className='forgotPasswordMail'>
      <div className='forgotPasswordMail__content'>
        <div className='forgotPasswordMail__header'>
          <Heading
            title={'Check your email'}
            type='h4'
            color='neutral-700'
            align='center'
          />
          <Text
            color='neutral-500'
            size='fs-16'
            align='center'
          >
            We just sent a link to{' '}
            <span className='forgotPasswordMail__mail-address'>{`demomail@gmail.com`}</span> For the
            instructions in your email to reset your password.
          </Text>
        </div>
        <div className='forgotPasswordMail__form__wrapper'>
          <Button
            type='link'
            size='medium'
            href={'/'}
          >
            Resend Verification Email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordMail;
