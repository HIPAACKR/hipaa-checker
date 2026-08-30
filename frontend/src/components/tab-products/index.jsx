'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import './index.scss';

const TabProducts = ({ options, selectedOptionUrl }) => {
  const [activeTab, setActiveTab] = useState(options?.[0]?.url);
  const route = useRouter();
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
    <div className='productTabs'>
      {options?.map((item, index) => (
        <div
          key={index}
          className={`productTabs__tab ${activeTab === item?.url && 'productTabs__tab--active'}`}
          onClick={() => {
            setActiveTab(item?.url);
            route.push(`/products?filter=${item?.url}`, { scroll: false });
          }}
        >
          {item?.title}
        </div>
      ))}
    </div>
  );
};

export default TabProducts;
