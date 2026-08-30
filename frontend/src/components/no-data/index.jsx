import Image from 'next/image';

import Text from '../text';

import './index.scss';

export default function NoData({ title }) {
  return (
    <div className='noData'>
      <Image
        className='noData__image'
        src={'/images/icons/empty-box.svg'}
        width={72}
        height={57}
        alt='empty '
      />
      <Text
        size='fs-16'
        color='neutral-600'
        weight='semi-bold'
      >
        {title ? title : 'No data available.'}
      </Text>
    </div>
  );
}
