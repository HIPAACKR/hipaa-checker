'use client';
import { useEffect, useState } from 'react';

import CardProduct from '../card-product';

import './index.scss';

const ProductList = ({ productsData, selectedOptionUrl, options }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(options?.[0]?.url);

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

  useEffect(() => {
    if (activeTab == 'all') {
      setFilteredProducts(productsData);
    } else {
      const data = productsData?.filter((item) => {
        if (item?.type.toLowerCase() == activeTab) {
          return item;
        }
      });
      setFilteredProducts(data);
    }
  }, [activeTab, productsData]);

  return (
    <div className='cardsWrapper'>
      {filteredProducts?.map((item, index) => (
        <CardProduct
          key={index}
          title={item.title}
          description={item.subtitle}
          logo={item.logo}
          width={item.width}
          height={item.height}
          link={`/product-details/${item.slug}`}
        />
      ))}
    </div>
  );
};

export default ProductList;
