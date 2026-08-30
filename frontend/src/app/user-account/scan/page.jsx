import Image from 'next/image';
import Link from 'next/link';

import Breadcrumb from '@/components/breadcrumb';
import Heading from '@/components/heading';
import Text from '@/components/text';

import './index.scss';

const Scan = () => {
  const paths = [
    { name: 'Scanner', url: '/user-account/scan' },
    { name: 'New Scan', url: '/user-account/scan' },
  ];
  return (
    <div className='scan'>
      <Breadcrumb
        header={'New Scan'}
        paths={paths}
      />

      <div className='scan__section-option'>
        <div className='scan__section-option__header'>
          <Heading
            title={'Select your option'}
            type='h4'
            color='neutral-700'
            align='center'
          />
          <Text
            color='neutral-400'
            size='fs-18'
            align='center'
          >
            Choose your option for scan your application.
          </Text>
        </div>
        <div className='scan__section-option__upload'>
          <Link
            href={'/user-account/scan/file-upload'}
            className='scan__section-option__file'
          >
            <Image
              src='/images/icons/upload-file-icon.svg'
              width={60}
              height={60}
              alt='file logo'
            />
            <Text
              color='neutral-800'
              size='fs-20'
              weight='semi-bold'
            >
              Upload file
            </Text>

            <Text
              color='neutral-600'
              size='fs-14'
            >
              Supported file formats are .zip and .apk
            </Text>
          </Link>
          <Text
            color='neutral-400'
            size='fs-24'
          >
            or
          </Text>

          <Link
            href={'/user-account/scan/github-url-upload'}
            className='scan__section-option__url'
          >
            <Image
              src='/images/icons/github-url-icon.svg'
              width={60}
              height={60}
              alt='github logo'
            />
            <Text
              color='neutral-800'
              size='fs-20'
              weight='semi-bold'
            >
              Github URL
            </Text>

            <Text
              color='neutral-600'
              size='fs-14'
            >
              Share your Github Repository URL.
            </Text>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Scan;
