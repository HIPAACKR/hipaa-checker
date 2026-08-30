import Heading from '../heading';
import Text from '../text';

import './integrityControls.css';

const IntegrityControls = () => {
  return (
    <div className='integrityControls integrityControls--border'>
      <Heading
        title={'INTEGRITY CONTROLS (Addressable) - § 164.312(e)(2)(i)'}
        type='h4'
        color='neutral-800'
      />
      <Text
        size='fs-16'
        color='neutral-700'
      >
        This standard requires implementing security measures to ensure that electronically
        transmitted electronic protected health information is not improperly modified without
        detection until disposed of. HIPAAChecker measures to:
      </Text>
      <div className='featureContent--ml-50 featureContent--mt-8'>
        <ul
          style={{
            marginLeft: '0px', // Set the margin directly to see if it reduces indentation
            paddingLeft: '0px',
          }}
          className='fs-16 neutral-700 list-no-indent'
        >
          <li>
            <b>Prevent PHI Modification Over Data Transmission:</b> These measures ensure that
            transmitted EPHI is not improperly modified without detection until disposed of.
          </li>
          <li>
            <b>Secure External API Calls:</b> Check proper authorization header implementation to
            secure external API calls.
          </li>
          <li>
            <b>PKIX:</b> Checks the revocation status of certificates with the PKIX algorithm.
          </li>
          <li>
            <b>Secure SSL Connection:</b> Check whether HTTPS is implemented to secure connection
            for data transmission or not.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default IntegrityControls;
