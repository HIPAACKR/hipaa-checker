'use client';
import { useEffect, useState } from 'react';

import DeveloperGuidelineAndroid from '../developer-guideline-android';
import DeveloperGuidelineXcode from '../developer-guideline-xcode';

import './index.scss';

const DeveloperGuideline = ({ options, selectedOptionUrl }) => {
  const [activeDeveloperGuideline, setActiveDeveloperGuideline] = useState('android');

  useEffect(() => {
    const findAny = options?.some((item) => {
      if (item?.url == selectedOptionUrl) {
        setActiveDeveloperGuideline(item?.url);
        return true;
      }
      return false;
    });
    if (!findAny) {
      setActiveDeveloperGuideline(options?.[0]?.url);
    }
  }, [selectedOptionUrl, options]);

  return (
    <div className='developerGuideline '>
      {activeDeveloperGuideline == 'android' ? (
        <DeveloperGuidelineAndroid />
      ) : (
        <DeveloperGuidelineXcode />
      )}
    </div>
  );
};

export default DeveloperGuideline;
