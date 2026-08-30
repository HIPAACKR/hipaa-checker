'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '../button';
import Heading from '../heading';

import './index.scss';

const CardFeature = ({ type, image, title, description, slug }) => {
  const route = useRouter();
  return (
    <div
      className={`cardFeature cardFeature--${type}`}
      onClick={() => {
        if (type === 'landingPage') route.push(`/features?search=${slug}`);
      }}
    >
      <div className='cardFeature__image'>
        <Image
          width={28}
          height={28}
          src={`/images/icons/${image}.svg`}
          alt={image}
        />
      </div>
      <div className='cardFeature__textWrapper'>
        <Heading
          title={title}
          type={type === 'landingPage' ? 'h5' : 'h6'}
          color={type === 'landingPage' ? 'neutral-800' : 'neutral-700'}
        />
        <p className='cardFeature__textWrapper__description'>{description}</p>
      </div>

      {type !== 'landingPage' && (
        <Link
          href={`/features?search=${slug}`}
          className='cardFeature__buttonWrapper'
        >
          <Button
            type='secondary'
            size='large'
          >
            View details
          </Button>
        </Link>
      )}
    </div>
  );
};

export default CardFeature;
