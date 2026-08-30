import Image from 'next/image';

import Heading from '../heading';
import Text from '../text';

import './dataIntegrity.css';

const DataIntegrity = () => {
  return (
    <div className='dataIntegrity dataIntegrity--border'>
      <Heading
        title={'Integrity'}
        type='h4'
        color='neutral-800'
      />
      <Text
        size='fs-16'
        color='neutral-700'
      >
        Integrity is defined in the Security Rule, at § 164.304, as “the property that data or
        information have not been altered or destroyed in an unauthorized manner.” Protecting the
        integrity of EPHI is a primary goal of the Security Rule. HIPAAChecker will ensure the
        technical integrity of your system. Your healthcare software or application must implement{' '}
        <b>
          MECHANISM TO AUTHENTICATE ELECTRONIC PROTECTED HEALTH INFORMATION (Addressable) - §
          164.312(c)(2).
        </b>
      </Text>
      <Image
        src={'/images/common/data-integrity-feature-image.svg'}
        alt='data-integrity-image'
        style={{ margin: '20px 0px' }}
        width={800}
        height={170}
      />
    </div>
  );
};

export default DataIntegrity;
