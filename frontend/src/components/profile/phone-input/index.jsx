import { useEffect, useState } from 'react';
import Image from 'next/image';
import * as contriesData from 'country-list';
import {
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
  parsePhoneNumber} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';

import helpcircle from '@/../public/images/icons/helpcircle.svg';
import DropDown from '@/components/drop-down';
import Text from '@/components/text';
import TextInput from '@/components/textInput';

import './index.scss';

const NANP_AREA_CODE_MAP = {
  AG: ['1268'],
  AI: ['1264'],
  AS: ['1684'],
  BB: ['1246'],
  BM: ['1441'],
  BS: ['1242'],
  DM: ['1767'],
  DO: ['1809', '1829', '1849'],
  GD: ['1473'],
  GU: ['1671'],
  JM: ['1876'],
  KN: ['1869'],
  KY: ['1345'],
  LC: ['1758'],
  MP: ['1670'],
  MS: ['1664'],
  PR: ['1787', '1939'],
  SX: ['1721'],
  TC: ['1649'],
  TT: ['1868'],
  VC: ['1784'],
  VG: ['1284'],
  VI: ['1340'],
};

const buildCountryPhoneData = (code) => {
  const specialPrefixes = NANP_AREA_CODE_MAP[code];
  if (specialPrefixes) {
    const formatted = specialPrefixes.map((prefix) =>
      prefix.startsWith('+') ? prefix : `+${prefix}`,
    );
    return {
      phoneCode: formatted[0],
      allowedPrefixes: formatted,
    };
  }

  const defaultCode = `+${getCountryCallingCode(code)}`;
  return {
    phoneCode: defaultCode,
    allowedPrefixes: [defaultCode],
  };
};

const PhoneInput = ({
  value,
  setValue,
  placeholder = '+1 (555) 000-0000',
  errorMessage,
  hint,
  isDisabled = false
}) => {
  const [countryCode, setCountryCode] = useState(value?.countryCode || 'US');
  const [phoneNumber, setPhoneNumber] = useState(value?.number || '');
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');  

  useEffect(() => {
    setCountries(getCountriesWithPhoneCodes());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update local state when value prop changes (e.g., when user data loads)
  useEffect(() => {
    if (value) {
      if (value.countryCode && value.countryCode !== countryCode) {
        setCountryCode(value.countryCode);
      }
      // Set phone number from value - use full number with + if available
      const displayValue = value.full || value.number || '';
      if (displayValue !== phoneNumber) {
        setPhoneNumber(displayValue);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.countryCode, value?.number, value?.full]);

  const getPlaceholderForCountry = (code) => {
    try {
      const example = getExampleNumber(code, examples);
      if (example) {
        return example.format('E.164'); // e.g., +8801812345678
      }
    } catch (e) {
    }

    const fallbackCode = countries.find(c => c.id === code)?.phoneCode || '+1';
    return `${fallbackCode}1234567890`;
  };

  const handleCountryChange = (newCountryCode) => {
    setCountryCode(newCountryCode);
    setPhoneNumber('');
    setError('');

    const selectedCountry = countries.find(c => c.id === newCountryCode);
    if (setValue && selectedCountry) {
      setValue({
        countryCode: selectedCountry.id,
        phoneCode: selectedCountry.phoneCode,
        number: '',
        full: '',
        isValid: false,
      });
    }
  };

  const handlePhoneChange = (val) => {
    const selectedCountry = countries.find(c => c.id === countryCode);
    if (!selectedCountry) {
        setError('Invalid country');
        return;
    }

    // Allow only + at the start and digits, remove all other characters
    let cleanedValue = val.replace(/[^\d+]/g, '');

    // Ensure + can only be at the beginning
    if (cleanedValue.includes('+')) {
      const plusCount = (cleanedValue.match(/\+/g) || []).length;
      if (plusCount > 1 || cleanedValue.indexOf('+') !== 0) {
        // Remove all + except the first one at position 0
        cleanedValue = '+' + cleanedValue.replace(/\+/g, '');
      }
    }

    // Extract only digits for validation
    const digitsOnly = cleanedValue.replace(/\D/g, '');

    setPhoneNumber(cleanedValue);

    if (digitsOnly.length === 0) {
        setError('');
        if (setValue) {
          setValue({
              countryCode: selectedCountry.id,
              phoneCode: selectedCountry.phoneCode,
              number: '',
              full: '',
              isValid: false,
          });
        }
        return;
    }

    const allowedPrefixes = selectedCountry.allowedPrefixes || [selectedCountry.phoneCode];
    const allowedPrefixDigits = allowedPrefixes.map(prefix => prefix.replace(/\D/g, ''));
    const matchedPrefixIndex = allowedPrefixDigits.findIndex(prefix => digitsOnly.startsWith(prefix));

    if (matchedPrefixIndex === -1) {
        const message = allowedPrefixes.length > 1
          ? `Phone number must start with one of: ${allowedPrefixes.join(', ')}`
          : `Phone number must start with ${allowedPrefixes[0]}`;
        setError(message);
        if (setValue) {
          setValue({
              countryCode: selectedCountry.id,
              phoneCode: allowedPrefixes[0],
              number: digitsOnly,
              full: `+${digitsOnly}`,
              isValid: false,
          });
        }
        return;
    }

    const matchedPrefix = allowedPrefixes[matchedPrefixIndex];

    const fullNumber = `+${digitsOnly}`;

    let newError = '';
    let isValid = false;

    try {
        // Parse with the SELECTED country to ensure proper validation
        const parsedNumber = parsePhoneNumber(fullNumber, countryCode);

        // Get example number for the selected country to determine expected length
        const example = getExampleNumber(countryCode, examples);

        // Use libphonenumber-js built-in validation
        if (parsedNumber.isValid()) {
            isValid = true;
            newError = '';
        } else {
            // Number is invalid - provide specific error message
            const nationalNumber = parsedNumber.nationalNumber;

            if (example && example.nationalNumber) {
                const expectedLength = example.nationalNumber.length;

                if (nationalNumber.length < expectedLength) {
                    newError = 'Phone number is too short';
                } else if (nationalNumber.length > expectedLength) {
                    newError = 'You entered too many digits';
                } else {
                    // Correct length but invalid format (e.g., doesn't match the pattern)
                    newError = 'Invalid phone number format';
                }
            } else {
                // No example available - use isPossible() to determine error
                if (parsedNumber.isPossible()) {
                    newError = 'Invalid phone number format';
                } else {
                    // Check if it's a length issue
                    const metadata = parsedNumber.metadata;
                    if (metadata) {
                        newError = 'Invalid phone number format';
                    } else {
                        newError = 'Invalid phone number';
                    }
                }
            }
        }
        
    } catch (e) {
        if(e.message.includes('TOO_SHORT')) {
            newError = 'Phone number is too short';
        } else if(e.message.includes('TOO_LONG')) {
            newError = 'You entered too many digits';
        } else if(e.message.includes('INVALID_COUNTRY')) {
            newError = 'Invalid country code';
        } else {
            newError = 'Invalid phone number';
        }
    }

    setError(newError);

    if (setValue) {
      setValue({
        countryCode: selectedCountry.id,
        phoneCode: matchedPrefix,
        number: digitsOnly,
        full: fullNumber,
        isValid: isValid,
      });
    }
  };

  const getCountriesWithPhoneCodes = () => {
    return contriesData
      .getData()
      .filter(({ code }) => isSupportedCountry(code))
      .map(({ code, name }) => {
        const { phoneCode, allowedPrefixes } = buildCountryPhoneData(code);
        return {
          id: code,
          name: `${code}`,
          phoneCode,
          allowedPrefixes,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <div className="phoneInput">
      <div className="phoneInput__wrapper">
        <div className="phoneInput__dropdown">
          <DropDown
            data={countries}
            type="object"
            placeholder="Select Country"
            value={countryCode}
            setValue={handleCountryChange}
            isDisabled={isDisabled}
          />
        </div>

        <div className="phoneInput__input">
          <TextInput
            value={phoneNumber}
            setValue={handlePhoneChange}
            type="tel"
            placeholder={getPlaceholderForCountry(countryCode)}
            hint={hint}
            isDisabled={isDisabled}
            customInputWrapperClass="phoneInput__inputWrapper"
          />
        </div>

        <div className="phoneInput__icon">
          <Image
            src={helpcircle}
            alt="info"
            width={18}
            height={18}
          />
        </div>


      </div>

        {(errorMessage || error) && (
          <div className='textInput--mt-4'>
            <Text
              size='fs-12'
              color='radical-red'
            >
              {errorMessage || error}
            </Text>
          </div>
        )}
    </div>
  );
};

export default PhoneInput;