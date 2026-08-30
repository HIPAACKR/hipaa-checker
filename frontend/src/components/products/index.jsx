'use client';
import { productsData } from '@/data/products-data';

import CardProduct from '../card-product';

import './index.scss';

const Products = () => {
  return (
    <div className='productsCardWrapper'>
      {productsData?.map((item) => (
        <CardProduct
          key={item.id}
          type={'landingPage'}
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

export default Products;