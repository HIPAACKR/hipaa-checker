'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '../button';
import Heading from '../heading';
import Text from '../text';

import './index.scss';

const CardProduct = ({ title, description, logo, width, height, link, type }) => {
  const route = useRouter();
  return (
    <div className={`cardProduct cardProduct--${type}`}>
      <div className='cardProduct__textWrapper'>
        <Heading
          title={title}
          type={type === 'landingPage' ? 'h6' : 'h5'}
          color={type === 'landingPage' ? 'neutral-700' : 'neutral-800'}
        />
        <Text
          size='fs-16'
          color={type === 'landingPage' ? 'neutral-600' : 'neutral-500'}
        >
          {description}
        </Text>
      </div>
      {type === 'landingPage' ? (
         <Button
          type='secondary'
          size='medium'
          icon='arrowRightBold'
          iconPosition='after'
          animateIcon={true}
          onClick={() => {
            route.push(link);
          }}
          
        >
          Learn more
        </Button>
      ) : (
        <Button
          type='secondary'
          size='large'
          icon={'arrowRightBold'}
          iconPosition={'after'}
          animateIcon={true}
          onClick={() => {
            route.push(link);
          }}
        >
          Explore more
        </Button>
      )}
      <Image
        className={`cardProduct__logo cardProduct__logo__${logo}`}
        src={`/images/icons/${logo}.svg`}
        width={width}
        height={height}
        alt={logo}
      />
    </div>
  );
};

export default CardProduct;