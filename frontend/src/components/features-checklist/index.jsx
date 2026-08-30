'use client';

import Image from 'next/image';
import Link from 'next/link';

import { featureArray } from '@/utils/constant-data';

import Text from '../text';

import './index.scss';

const FeatureChecklist = () => {
  return (
    <div className='featuresChecklist'>
      <div className='featuresChecklist__details'>
        {featureArray?.slice(0, featureArray?.length / 2 + 1)?.map((feature, index) => (
          <Link
            href={`/features?search=${feature?.slug}`}
            key={index}
            className='featuresChecklist__check-content'
          >
            <Image
              src='/images/icons/checkmark-circle.svg'
              width={28}
              height={28}
              alt='check'
            />

            <Text
              color='neutral-700'
              size='fs-18'
            >
              {feature?.title}
            </Text>
          </Link>
        ))}
      </div>
      <div className=' featuresChecklist__details '>
        {featureArray
          ?.slice(featureArray?.length / 2 + 1, featureArray?.length)
          ?.map((feature, index) => (
            <Link
              key={index}
              href={`/features?search=${feature?.slug}`}
              className='featuresChecklist__check-content'
            >
              <Image
                src='/images/icons/checkmark-circle.svg'
                width={28}
                height={28}
                alt='check'
              />
              <Text
                color='neutral-700'
                size='fs-18'
              >
                {feature?.title}
              </Text>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default FeatureChecklist;
