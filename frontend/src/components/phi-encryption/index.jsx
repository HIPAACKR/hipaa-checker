import Link from 'next/link';

import Heading from '../heading';
import Subtitle from '../subtitle';
import Text from '../text';

import './index.scss';

const PhiEncryption = () => {
  return (
    <div className='phiEncryption phiEncryption--border'>
      <div className='featureContent--mb-20'>
        <Heading
          title={'ENCRYPTION (Addressable) - § 164.312(e)(2)(ii)'}
          type='h4'
          color='neutral-800'
        />
        <Text
          size='fs-16'
          color='neutral-700'
        >
          Sample questions to consider for reasonable and appropriate PHI safeguard with strong
          encryption:
        </Text>
        <ul>
          <li>
            <Text
              size='fs-16'
              color='neutral-700'
            >
              How does the organization transmit EPHI?
            </Text>
          </li>
          <li>
            <Text
              size='fs-16'
              color='neutral-700'
            >
              How often does the organization transmit EPHI?
            </Text>
          </li>
          <li>
            <Text
              size='fs-16'
              color='neutral-700'
            >
              Based on the risk analysis, is encryption needed to protect EPHI during transmission?
            </Text>
          </li>
          <li>
            <Text
              size='fs-16'
              color='neutral-700'
            >
              What methods of encryption will be used to protect the transmission of EPHI?
            </Text>
          </li>
        </ul>
      </div>
      <Subtitle>HIPAAChecker to Secure PHI Transmission with Appropriate Encryption</Subtitle>
      <Text
        size='fs-16'
        color='neutral-700'
      >
        In addition to{' '}
        <Link href={'/features?search=encryption-decryption'}>ENCRYPTION AND DECRYPTION</Link>,
        HIPAAChecker identifies the following PHI encryption methods for strong data transmission
        protection:
      </Text>
      <div className='featureContent--ml-50 featureContent--mt-8'>
        <ul
          style={{
            marginLeft: '0px', // Set the margin directly to see if it reduces indentation
            paddingLeft: '0px',
          }}
          className='fs-16 neutral-700 list-reduced-indent'
        >
          <li>
            <b>PHI ENCODING:</b> Identify whether to implement Base64 or Other Encoding methods
          </li>
          <li>
            <b>PHI DECODING:</b> Identify whether to implement Base64 or Other Decoding methods
          </li>
          <li>
            <b>Realm Database:</b> Check whether a mobile application implements Realm Database. If
            implemented, does it satisfy security requirements such as Data at Rest, Data at
            Transit, Authentication and Authorization, Data Integrity, etc?
          </li>
          <li>
            <b>SQL Cipher:</b> If an application uses an SQLite database, it must implement
            SQLCipher. SQLCipher provides 256-bit AES encryption to SQLite database files.
            HIPAAChecker identifies vulnerabilities in SQLite database file encryption.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PhiEncryption;
