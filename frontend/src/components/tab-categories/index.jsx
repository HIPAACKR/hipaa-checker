'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Heading from '../heading';

import './index.scss';

const TabCategories = ({ options, selectedOptionUrl }) => {
  const [activeCategory, setActiveCategory] = useState(options?.[0]?.url);
  const route = useRouter();
  useEffect(() => {
    const findAny = options?.some((item) => {
      if (item?.url == selectedOptionUrl) {
        setActiveCategory(item?.url);
        return true;
      }
      return false;
    });
    if (!findAny) {
      setActiveCategory(options?.[0]?.url);
    }
  }, [selectedOptionUrl, options]);

  return (
    <div className='tabCategories'>
      <Heading
        title={'Categories'}
        type='h6'
      />
      <div className='tabCategories__categories'>
        {options?.map((item, index) => (
          <div
            key={index}
            className={`tabCategories__category ${activeCategory === item?.url && 'tabCategories__category--active'}`}
            onClick={() => {
              route.push(`/downloads?category=${item?.url}`, { scroll: false });
              setActiveCategory(item?.url);
            }}
          >
            {item?.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabCategories;
