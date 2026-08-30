import Image from 'next/image';

import { landingPage } from '@/data/static-data';

import Heading from '../heading';
import Text from '../text';

import './index.scss';

const Solutions = () => {
  const { component, safety, visualization, implementation, securityDetails } =
    landingPage.solutions;
  return (
    <div className='solutions'>
      <div className='solutions__content'>
        <div className='solutions__cardWrapper'>
          <Card
            title={safety?.title}
            description={safety?.description}
          />
        </div>
        <div className='solutions__image-wrapper'>
          <Image
            src={'/images/common/solution-steps.svg'}
            alt='score'
            width={560}
            height={336}
          />
        </div>
      </div>
      <div className='solutions__content'>
        <div className='solutions__image-wrapper'>
          <Image
            className='solutions__content__image'
            src={'/images/common/solution-score.svg'}
            alt='score'
            width={560}
            height={325}
          />
        </div>

        <div className='solutions__cardWrapper'>
          <Card
            title={component?.title}
            description={component?.description}
          />
          <Card
            title={visualization?.title}
            description={visualization?.description}
          />
        </div>
      </div>

      <div className='solutions__content'>
        <div className='solutions__cardWrapper'>
          <Card
            title={implementation?.title}
            description={implementation?.description}
          />
          <Card
            title={securityDetails?.title}
            description={securityDetails?.description}
          />
        </div>
        <div className='solutions__image-wrapper'>
          <Image
            src={'/images/common/solution-code-highlight.svg'}
            alt='score'
            width={560}
            height={325}
          />
        </div>
      </div>
    </div>
  );
};

export default Solutions;

const Card = ({ title, description }) => {
  return (
    <div className='solutions__card'>
      <Heading
        type='h4'
        title={title}
        color='neutral-700'
      />
      <Text
        size='fs-18'
        color='neutral-700'
      >
        {description}
      </Text>
    </div>
  );
};
