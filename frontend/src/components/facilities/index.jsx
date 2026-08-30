import Image from 'next/image';

import { landingPage } from '@/data/static-data';

import Text from '../text';

import './index.scss';

const Facilities = () => {
  const { items } = landingPage.facilities;
  return (
    <div className='facilities'>
      <div className='facilities__content'>
        {items?.map((item, index) => (
          <div
            key={index}
            className='facilities__check-content'
          >
            <Image
              src='/images/icons/checkmark-green.svg'
              width={28}
              height={28}
              alt='Checkmark icon'
            />
            <Text
              color='neutral-700'
              size='fs-18'
            >
              {item}
            </Text>
          </div>
        ))}
      </div>

      <div className='facilities__banner'>
        <Image
          className='facilities__banner__image'
          quality={100}
          src={'/images/common/facilities-banner-bg.svg'}
          alt='Facilities banner background'
          fill
        />

        <Image
          className='facilities__banner__logo'
          quality={100}
          src={'/images/common/facilities-banner-logo.svg'}
          alt='Facilities banner logo'
          width={168}
          height={190}
        />

        <Image
          className='facilities__banner__shadow'
          quality={100}
          src={'/images/common/facilities-banner-shadow.svg'}
          alt='Facilities banner shadow'
          width={274}
          height={274}
        />
      </div>
    </div>
  );
};

export default Facilities;
