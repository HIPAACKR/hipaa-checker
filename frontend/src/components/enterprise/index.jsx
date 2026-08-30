import Image from 'next/image';

import { landingPage } from '@/data/static-data';

import Heading from '../heading';
import Text from '../text';

import './index.scss';

const EnterpriseItems = () => {
  const { items } = landingPage.Enterprise;
  return (
    <div className='EnterpriseItems'>
      {items?.map((item, index) => (
        <div
          key={index}
          className={'EnterpriseItems__card'}
        >
          <div className='EnterpriseItems__card__header'>
            <Image
              className='EnterpriseItems__card__icon'
              src={`/images/icons/${item.icon}.svg`}
              alt={item.icon}
              width={56}
              height={56}
              
            />
            <Heading
              type='h5'
              size='fs-24'
              title={item.title}
              color="white"
              align='left'
            />   
          </div>

          <div className='EnterpriseItems__card__textWrapper'>
            <Text
              size='fs-18'
              color= "white"
              align='left'
            >
              {item.description}
            </Text>
          </div>

          
        </div>

      ))}
    </div>
  );
};

export default EnterpriseItems;