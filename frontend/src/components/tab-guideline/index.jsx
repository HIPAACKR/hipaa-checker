'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Text from '../text';

import './index.scss';

const TabGuideline = ({ options, selectedOptionUrl }) => {
  const [activeTab, setActiveTab] = useState('android');
  const router = useRouter();
  useEffect(() => {
    const findAny = options?.some((item) => {
      if (item?.url == selectedOptionUrl) {
        setActiveTab(item?.url);
        return true;
      }
      return false;
    });
    if (!findAny) {
      setActiveTab(options?.[0]?.url);
    }
  }, [selectedOptionUrl, options]);

  return (
    <div className='tab-guideline'>
      <div className='tab-guideline__content'>
        {options?.map((x, index) => (
          <div
            key={index}
            onClick={() => {
              setActiveTab(x?.url);
              router.push(`/developer-guideline?platform=${x?.url}`, { scroll: false });
            }}
            className={`tab-guideline__content__item  ${activeTab == x?.url ? 'tab-guideline__content__item--active' : ''} `}
          >
            <Text
              size='fs-18'
              color='neutral-500'
              weight='regular'
            >
              {x?.title}
            </Text>
          </div>
        ))}
      </div>
      <div className='tab-guideline__divider'></div>
    </div>
  );
};

export default TabGuideline;
