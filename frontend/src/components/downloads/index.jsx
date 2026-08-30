'use client';
import { useEffect, useState } from 'react';

import CardPlugin from '../card-plugin';
import NoData from '../no-data';

import './index.scss';

const Downloads = ({ productsData, selectedOptionUrl, options }) => {
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [activeCtegory, setActiveCategory] = useState(options?.[0]?.url);

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

  useEffect(() => {
    if (activeCtegory == 'all') {
      setFilteredProducts(productsData);
    } else {
      const data = productsData?.filter((item) => {
        if (item?.category.toLowerCase() == activeCtegory) {
          return item;
        }
      });
      setFilteredProducts(data);
    }
  }, [activeCtegory, productsData]);

  return (
    <div className='downloadsCards'>
      {filteredProducts?.length ? (
        <>
          {filteredProducts?.map((item, index) => (
            <CardPlugin
              key={item.id}
              title={item.title}
              description={item.description}
              logo={`/images/icons/${item.icon}.svg`}
              width={item.width}
              height={item.height}
            />
          ))}
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default Downloads;
