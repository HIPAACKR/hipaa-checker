import Image from 'next/image';

import { landingPage } from '@/data/static-data';

import Button from '../button';
import Heading from '../heading';
import Text from '../text';

import './index.scss';

const SafeguardsItems = () => {
  const { items } = landingPage.safeguards;
  return (
    <div className='safeguardsItems'>
      {items?.map((item, index) => (
        <div
          key={index}
          className='safeguardsItems__card'
        >
          <div className='safeguardsItems__card__header'>
            <Image
              className='safeguardsItems__card__icon'
              src={`/images/icons/${item.icon}.svg`}
              alt={item.icon}
              width={56}
              height={56}
            />
            <Heading
              type='h5'
              title={item.title}
              color='neutral-800'
              align='left'
            />
          </div>

          <div className='safeguardsItems__card__textWrapper'>
            <Text
              size='fs-18'
              color='neutral-700'
              align='left'
            >
              {item.description}
            </Text>
          </div>

          <Button
            icon='arrowRightLightPrimary'
            iconPosition='after'
            type='link'
            href={`/features?search=${item?.url}`}
            animateIcon={true}
          >
            Read More
          </Button>
        </div>

      ))}
    </div>
  );
};

export default SafeguardsItems;