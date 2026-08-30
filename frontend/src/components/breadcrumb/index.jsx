import Image from 'next/image';
import Link from 'next/link';

import Text from '../text';

import './index.scss';

const Breadcrumb = ({ header, backButtonURL, paths }) => {
  return (
    <div className='breadcrumb'>
      <div className='breadcrumb__wrapper'>
        {paths?.map((item, index) =>
          index !== paths.length - 1 ? (
            <span
              key={index}
              className='breadcrumb__wrapper'
            >
              <Link href={item.url}>
                <Text
                  color='neutral-400'
                  size='fs-12'
                  weight='medium'
                >
                  {item.name}
                </Text>
              </Link>
              <Text
                color='neutral-400'
                size='fs-12'
                weight='medium'
              >
                /
              </Text>
            </span>
          ) : (
            <Text
              key={index}
              color='neutral-600'
              size='fs-12'
              weight='medium'
            >
              {item.name}
            </Text>
          ),
        )}
      </div>

      <div className='breadcrumb__header'>
        {backButtonURL && (
          <Link href={backButtonURL}>
            <Image
              className='breadcrumb__header__backButton'
              src='/images/icons/circle-left-arrow.svg'
              width={32}
              height={32}
              alt='arrow logo'
            />
          </Link>
        )}
        <Text
          color='neutral-800'
          size='fs-18'
          weight='semi-bold'
        >
          {header}
        </Text>
      </div>
    </div>
  );
};

export default Breadcrumb;
