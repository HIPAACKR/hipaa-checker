import Image from 'next/image';

import Heading from '../heading';
import Subtitle from '../subtitle';
import Text from '../text';

import './authentication.css';

const Authentication = () => {
  return (
    <div className='authentication authentication--border'>
      <div className='featureContent--mb-20'>
        <Heading
          title={'Person or Entity Authentication'}
          type='h4'
          color='neutral-800'
        />
        <Text
          size='fs-16'
          color='neutral-700'
        >
          Person or entity authentication requires implementing procedures to verify that the person
          or entity seeking access to electronic protected health information is the one claimed.
        </Text>
        <Image
          src={'/images/common/authentication-feature-image.svg'}
          alt='authentication-image'
          style={{ margin: '20px 0px 20px 0px' }}
          width={800}
          height={170}
        />
      </div>
      <Subtitle>HIPAAChecker for PHI Access Authentication Validation</Subtitle>
      <Text
        size='fs-16'
        color='neutral-700'
      >
        HIPAAChecker scan authentication methods that can be employed in your software:
      </Text>
      <ul>
        <li>
          <Text
            size='fs-16'
            color='neutral-700'
          >
            <b>Common Authentication Methods: </b> HIPAAChecker validates appropriate authentication
            methods for your software application. We identify vulnerabilities in Password-based
            Auth, FireBaseAuth, oAuth 2.0, Token-based Auth, etc.
          </Text>
        </li>
        <li>
          <Text
            size='fs-16'
            color='neutral-700'
          >
            <b>Biometric Authentication: </b>Reduce the risk of shared or compromised credentials
            with biometric identifiers such as fingerprints, iris scans, or facial recognition for
            user authentication.
          </Text>
        </li>
        <li>
          <Text
            size='fs-16'
            color='neutral-700'
          >
            <b>SMS or Email-based Authentication: </b>Validate one-time passcode (OTP) or
            verification code to the user’s registered mobile phone number or email address.
          </Text>
        </li>
        <li>
          <Text
            size='fs-16'
            color='neutral-700'
          >
            <b>Social Media or Federated Identity Authentication: </b>Check whether third-party
            identity providers (e.g., Google, Facebook, or Twitter) or federated identity providers
            have appropriate methods for PHI access authentication.
          </Text>
        </li>
        <li>
          <Text
            size='fs-16'
            color='neutral-700'
          >
            <b>Multi-factor Authentication (MFA): </b>Check whether multiple factors (e.g., password
            plus one-time code) are required to verify identity before granting PHI access.
          </Text>
        </li>
      </ul>
    </div>
  );
};

export default Authentication;
