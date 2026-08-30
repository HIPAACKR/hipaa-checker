const githubRepoUrlRegex =
  /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+(\/)?(\.git)?$/;

export const saveToLocalStorage = async (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('time', JSON.stringify(Date.now()));
  }
};

export const saveToLocalFilesDataStorage = async (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('filesData', JSON.stringify(data));
  }
};

export const saveToLocalRulesDataStorage = async (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rulesData', JSON.stringify(data));
  }
};

export const saveToCookies = () => {
  document.cookie = 'isLoggedIn=true; path=/; Secure; SameSite=Strict; max-age=' + 7 * 24 * 60 * 60;
};

export const clearCookies = () => {
  document.cookie =
    'isLoggedIn=false; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 UTC';
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Invalid Date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const decodeString = (encodedStr) => decodeURIComponent(encodedStr);

export const extractSubstring = (path = '') => {
  const pathSegments = path.split('/');
  return pathSegments.slice(-2).join('-');
};

export const extractSubstringForFilter = (path = '') => {
  const pathSegments = path.split('/');
  return pathSegments.slice(-2).join('/');
};

export const isInt = (num) => Number.isInteger(num);

export const convertToSegmentData = (type, data = []) => {
  let total = 1,
    critical = 0,
    high = 0,
    medium = 0,
    low = 0,
    no_risk = 0;
  if (type === 'summarize') {
    critical = data?.critical || 0;
    high = data?.high || 0;
    medium = data?.medium || 0;
    low = data?.low || 0;
    no_risk = data?.no_risk || 0;
  } else if (Array.isArray(data)) {
    data.forEach((rule) => {
      critical += rule.critical_risk_count || 0;
      high += rule.high_risk_count || 0;
      medium += rule.medium_risk_count || 0;
      low += rule.low_risk_count || 0;
      no_risk += rule.no_risk_count || 0;
    });
  }
  total = critical + high + medium + low + no_risk || 1;

  const segments = [
    { color: 'cornell-red', percent: (critical * 100) / total },
    { color: 'red', percent: (high * 100) / total },
    { color: 'orange', percent: (medium * 100) / total },
    { color: 'iris-blue', percent: (low * 100) / total },
    { color: 'green', percent: (no_risk * 100) / total },
  ];

  if (!segments.some((item) => item.percent > 0)) segments[4].percent = 100;

  return segments;
};

export function isValidGitHubRepoUrl(url) {
  return githubRepoUrlRegex.test(url);
}

export function cleanFilename(filename) {
  return filename.replace(/[/-]+/g, '-');
}

export function cleanRuleName(filename) {
  return filename.replace(/\//g, '');
}

export function maxPercentageCount(data) {
  if (!Array.isArray(data) || data.length === 0) return null;
  // console.log("data:", data)
  const result = data.reduce((max, item) => (item.percent > max.percent ? item : max), data[0]);
  // console.log("result:", result)
  return result;
}

export function convertToSubcurrency(amount, factor = 100) {
  return Math.round(amount * factor);
}

/**
 * Parse phone number and extract country code and other details using libphonenumber-js
 * @param {string} phoneNumber - Phone number string (with or without country code)
 * @returns {Object} Object containing countryCode, phoneCode, number, full, and isValid
 */
export function parsePhoneNumberData(phoneNumber) {
  const defaultReturn = {
    countryCode: 'US',
    phoneCode: '+1',
    number: '',
    full: '',
    isValid: false,
  };

  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return defaultReturn;
  }

  // Clean the phone number - remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  if (digitsOnly.length === 0) {
    return defaultReturn;
  }

  try {
    // Dynamic import is needed for client-side usage
    const { parsePhoneNumber, getCountryCallingCode } = require('libphonenumber-js');

    // Add + prefix if not present
    const phoneWithPrefix = phoneNumber.startsWith('+') ? phoneNumber : `+${digitsOnly}`;

    try {
      const parsedNumber = parsePhoneNumber(phoneWithPrefix);

      if (parsedNumber) {
        const countryCode = parsedNumber.country || 'US';
        const callingCode = getCountryCallingCode(countryCode);

        return {
          countryCode: countryCode,
          phoneCode: `+${callingCode}`,
          number: digitsOnly,
          full: phoneWithPrefix,
          isValid: parsedNumber.isValid(),
        };
      }
    } catch (parseError) {
      // If parsing fails, fall back to manual detection
      // console.warn('Phone number parsing failed, using fallback:', parseError.message);
    }
  } catch (importError) {
    // If libphonenumber-js is not available, use fallback
    // console.warn('libphonenumber-js not available, using fallback');
  }

  // Fallback: Manual country code detection
  return fallbackParsePhoneNumber(digitsOnly);
}

/**
 * Fallback phone number parser when libphonenumber-js is not available
 * @param {string} digitsOnly - Phone number with only digits
 * @returns {Object} Phone data object
 */
function fallbackParsePhoneNumber(digitsOnly) {
  const countryCodeMap = {
    '1': 'US', '7': 'RU', '20': 'EG', '27': 'ZA', '30': 'GR', '31': 'NL',
    '32': 'BE', '33': 'FR', '34': 'ES', '36': 'HU', '39': 'IT', '40': 'RO',
    '41': 'CH', '43': 'AT', '44': 'GB', '45': 'DK', '46': 'SE', '47': 'NO',
    '48': 'PL', '49': 'DE', '52': 'MX', '54': 'AR', '55': 'BR', '60': 'MY',
    '61': 'AU', '62': 'ID', '63': 'PH', '64': 'NZ', '65': 'SG', '66': 'TH',
    '81': 'JP', '82': 'KR', '84': 'VN', '86': 'CN', '90': 'TR', '91': 'IN',
    '92': 'PK', '94': 'LK', '95': 'MM', '98': 'IR', '212': 'MA', '213': 'DZ',
    '216': 'TN', '234': 'NG', '254': 'KE', '351': 'PT', '353': 'IE', '358': 'FI',
    '370': 'LT', '371': 'LV', '372': 'EE', '373': 'MD', '374': 'AM', '375': 'BY',
    '376': 'AD', '377': 'MC', '378': 'SM', '380': 'UA', '381': 'RS', '382': 'ME',
    '383': 'XK', '385': 'HR', '386': 'SI', '387': 'BA', '389': 'MK', '420': 'CZ',
    '421': 'SK', '423': 'LI', '880': 'BD', '886': 'TW', '960': 'MV', '961': 'LB',
    '962': 'JO', '963': 'SY', '964': 'IQ', '965': 'KW', '966': 'SA', '967': 'YE',
    '968': 'OM', '970': 'PS', '971': 'AE', '972': 'IL', '973': 'BH', '974': 'QA',
    '975': 'BT', '976': 'MN', '977': 'NP', '992': 'TJ', '993': 'TM', '994': 'AZ',
    '995': 'GE', '996': 'KG', '998': 'UZ',
  };

  let matchedCountryCode = 'US';
  let matchedPhoneCode = '+1';

  // Try 3-digit codes first, then 2-digit, then 1-digit
  for (let len = 3; len >= 1; len--) {
    const code = digitsOnly.substring(0, len);
    if (countryCodeMap[code]) {
      matchedCountryCode = countryCodeMap[code];
      matchedPhoneCode = `+${code}`;
      break;
    }
  }

  const isValid = digitsOnly.length >= 7 && digitsOnly.length <= 15;

  return {
    countryCode: matchedCountryCode,
    phoneCode: matchedPhoneCode,
    number: digitsOnly,
    full: `+${digitsOnly}`,
    isValid: isValid,
  };
}

/**
 * Format phone number for API submission (returns E.164 format: +[country code][number])
 * @param {Object} phoneData - Phone data object from PhoneInput component
 * @returns {string} Phone number in E.164 format (with +)
 */
export function formatPhoneNumberForAPI(phoneData) {
  if (!phoneData || !phoneData.full) {
    return '';
  }
  // Return the full phone number in E.164 format (+countrycode + number)
  // Ensure it starts with '+' for services like Twilio
  return phoneData.full.startsWith('+') ? phoneData.full : `+${phoneData.full}`;
}

export default convertToSubcurrency;

/**
 * Format number with thousands separator (e.g., 1,000 -> 1K, 1,500 -> 1.5K)
 * Safely handles numbers, strings, null, undefined, and invalid inputs
 * @param {number|string} num - The number to format (can be number or numeric string)
 * @returns {string} Formatted number string with 'K' suffix for thousands
 */
export const formatNumberWithThousandsSuffix = (num) => {
  try {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;

    if (isNaN(numValue) || numValue === null || numValue === undefined) {
      return '0';
    }

    if (numValue >= 1000) {
      return (numValue / 1000).toFixed(2).replace(/\.?0+$/, '') + 'K';
    }

    return Math.floor(numValue).toString();
  } catch (error) {
    // console.error('Error formatting number:', error);
    // Return safe fallback
    return '0';
  }
};