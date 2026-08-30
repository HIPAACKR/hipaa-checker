import Image from 'next/image';
import Link from 'next/link';

import Heading from '../heading';
import Subtitle from '../subtitle';
import Text from '../text';

import './transmissionSecurity.css';

const TransmissionSecurity = () => {
  return (
    <div className='transmissionSecurity transmissionSecurity--border'>
      <Heading
        title={'Transmission Security'}
        type='h4'
        color='neutral-800'
      />
      <Text
        size='fs-16'
        color='neutral-700'
      >
        This standards refer to implementing technical security measures to guard against
        unauthorized access to electronically protected health information that is being transmitted
        over an electronic communications network.
      </Text>

      <Image
        src={'/images/common/transmission-security-feature-image.svg'}
        alt='transmission-security-image'
        style={{ margin: '20px 0px 20px 0px' }}
        width={800}
        height={170}
      />

      <div className='featureContent--mt-20 featureContent--mb-20'>
        <Subtitle>
          HIPAAChecker to Guard Against Unauthorized PHI Transmission Over Network Communication
        </Subtitle>
        <Text
          size='fs-16'
          color='neutral-700'
        >
          To guard against unauthorized transmission of Protected Health Information (PHI) over
          network communication, HIPAAChecker measures{' '}
          <Link href={'/features?search=access-control'}>Access Control</Link>,{' '}
          <Link href={'/features?search=integrity-controls-over-transmission'}>
            Integrity Controls
          </Link>
          , Secure Communication Protocols, and{' '}
          <Link href={'/features?search=phi-encryption'}>PHI Encryption methods</Link>.
        </Text>
      </div>
      <Subtitle>Data Flow Analysis</Subtitle>
      <Text
        size='fs-16'
        color='neutral-700'
      >
        The HIPAAChecker Dynamic Analysis process identifies potential vulnerabilities related to
        data handling, such as buffer overflows, SQL injection, or cross-site scripting (XSS). We
        also check whether or not unauthorized access to PHI transmitted over a communication
        network is being restricted.
      </Text>
    </div>
  );
};

export default TransmissionSecurity;
