import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/button';
import Heading from '@/components/heading';
import Subtitle from '@/components/subtitle';

import './index.scss';

export default function NotFoundComponent() {
  return (
    <div className='notFound'>
      <Image
        className='notFound__image'
        src={'/images/icons/404.svg'}
        width={419}
        height={145}
        alt='404'
      />
      <div>
        <Heading
          type='h3'
          title={'Page not found'}
          align='center'
          color='neutral-700'
        />
        <Subtitle>The page you are looking for moved or doesn’t exist.</Subtitle>
        <div className='notFound__button'>
          <Link href={'/'}>
            <Button
              type='secondary'
              size='large'
              icon={'arrowLeft'}
              iconPosition={'before'}
            >
              Go back Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
