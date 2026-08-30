import Carousel from '@/components/carousel';
import EyeCatch from '@/components/eye-catch';
import ProductList from '@/components/product-list';
import TabProducts from '@/components/tab-products';
import { productsData } from '@/data/products-data';
import { productsPageMetadata } from '@/data/seo-config';

import './index.scss';

export const metadata = productsPageMetadata;

const Products = ({ searchParams }) => {
  const options = [
    { title: 'All', url: 'all' },
    { title: 'Web', url: 'web' },
    { title: 'Mobile', url: 'mobile' },
  ];

  return (
    <div className='products'>
      <EyeCatch param='products' />
      <div className='products__section'>
        <div className='products__wrapper'>
          <TabProducts
            options={options}
            selectedOptionUrl={searchParams?.filter?.toString()}
          />

          <ProductList
            productsData={productsData}
            selectedOptionUrl={searchParams?.filter?.toString()}
            options={options}
          />
        </div>
      </div>
      <div className='products__carousel'>
        <Carousel />
      </div>
    </div>
  );
};

export default Products;
