'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { productsData } from '@/data/products-data';

import Button from '../button';
import Heading from '../heading';
import Subtitle from '../subtitle';

import './index.scss';

const StartFree = () => {
  const router = useRouter();
  const param = usePathname().split('/').pop();
  const parentParam = usePathname().split('/')[1];
  const [title, setTitle] = useState();
  const [discription, setDiscription] = useState();

  useEffect(() => {
    if (parentParam === 'product-details') {
      productsData?.some((product) => {
        if (product.slug === param) {
          setTitle(product?.freePlanTitle);
          setDiscription(product?.freePlanSubtitle);
        }
      });
    }
  }, [param, parentParam]);

  return (
    <div className='startFree'>
      {parentParam === 'product-details' ? (
        <div className='startFree__textWrapper'>
          <Heading
            title={title}
            type='h2'
            color='white'
            align='center'
          />
          <Subtitle>{discription}</Subtitle>
        </div>
      ) : (
        <div className='startFree__dualColorHeader'>
          
          <h2 className='text-3xl  text-white text-center md:text-5xl mb-6'>
            Ready to Automate<span className="font-bold "> HIPAA Compliance?</span>
          </h2>
          
          <Subtitle align='center'>
            <span className='startFree__subtitle'>
              See how HIPAAChecker helps teams integrate compliance into their development workflow without slowing delivery.
            </span>
          </Subtitle>       
        </div>
      )}
      <div className='startFree__button'>
        <Button
          isFullWidth
          type='primary'
          size='large'
          icon={'arrowRight'}
          animateIcon={true}
          iconPosition={'after'}          
          onClick={() => router.push('/sign-in')}
          style={{ backgroundColor: '#0092E3', color: '#fff' }}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default StartFree;