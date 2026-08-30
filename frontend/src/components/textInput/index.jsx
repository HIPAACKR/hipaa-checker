'use client';
import { useState } from 'react';
import Image from 'next/image';

import email from '@/../public/images/icons/email.svg';
import eyeClose from '@/../public/images/icons/eyeClose.svg';
import eyeOpen from '@/../public/images/icons/eyeOpen.svg';

import Text from '../text';

import './index.scss';

const TextInput = ({
  value,
  setValue,
  type = 'text',
  size = 'small',
  placeholder,
  hint,
  placeholderColor = 'default',
  textColor = 'dark',
  errorMessage,
  id,
  background = '',
  padding = '',
  radius = 'rounded',
  customInputWrapperClass = '',
  customDisabledClass = 'bg-[#F9FAFB] cursor-not-allowed',
  isDisabled = false,
}) => {
  // const [data, setData] = useState(value);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  // const handleChange = (e) => {
  //   setData(e.target.value);
  //   if (setValue) setValue(e.target.value);
  // };

  return (
    <div
      className={`textInput textInput--${size} 
         ${errorMessage && ' textInput--error'}
         ${isDisabled && ' cursor-not-allowed'}
        `}
    >
      <div
        className={`textInput__wrapper ${customInputWrapperClass} ${isDisabled ? customDisabledClass : ''}`}
        data-background={background}
        data-padding={padding}
        data-placeholder-color={placeholderColor}
        data-radius={radius}
      >
        {type == 'email' && (
          <Image
            src={email.src}
            alt='eye'
            width={18}
            height={18}
          />
        )}
        <input
          className={`textInput__input ${isDisabled && ' cursor-not-allowed'}`}
          type={type == 'password' && !isPasswordVisible ? 'password' : 'text'}
          data-size={size}
          data-background={background}
          data-padding={padding}
          data-placeholder-color={placeholderColor}
          data-text-color={textColor} 
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          id={id}
          disabled={isDisabled}
        />
        {type == 'password' && (
          <Image
            src={isPasswordVisible ? eyeClose.src : eyeOpen.src}
            onClick={() => setPasswordVisible((pre) => !pre)}
            className='textInput--cursor-pointer'
            alt='eye'
            width={17}
            height={14}
          />
        )}
      </div>
      {hint && !errorMessage && (
        <div className='textInput--mt-4'>
          <Text
            size='fs-12'
            color='neutral-500'
          >
            {hint}
          </Text>
        </div>
      )}
      {errorMessage && (
        <div className='textInput--mt-4'>
          <Text
            size='fs-12'
            color='radical-red'
          >
            {errorMessage}
          </Text>
        </div>
      )}
    </div>
  );
};

export default TextInput;
