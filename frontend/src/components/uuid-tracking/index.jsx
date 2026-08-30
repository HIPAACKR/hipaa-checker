import Heading from '../heading';
import Text from '../text';

import './uuid.css';

const UuidTracking = () => {
  return (
    <div className='uuidTracking uuidTracking--border'>
      <Heading
        title={'UNIQUE USER IDENTIFICATION (Required) - § 164.312(a)(2)(i)'}
        type='h4'
        color='neutral-800'
      />
      <Text
        size='fs-16'
        color='neutral-700'
      >
        The Unique User Identification implementation specification states that a covered entity
        must{' '}
        <span className='featureContent--italic'>
          assign a unique name and/or number to identify and track user identity.
        </span>
      </Text>
      <div className='featureContent--mt-20 featureContent--mb-20' />
      <Heading
        title={'Patient’s Unique Identity Tracking'}
        type='h5'
        color='neutral-800'
      />
      <Text
        size='fs-16'
        color='neutral-700'
      >
        HIPAAChecker checks whether an application creates a unique primary key in the database for
        storing PHI.
      </Text>
    </div>
  );
};

export default UuidTracking;
