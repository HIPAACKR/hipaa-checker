import Heading from '../heading';
import Text from '../text';

const PhiEmergencyAccess = () => {
  return (
    <div
      className='phiEmergencyAccess'
      style={{ border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px' }}
    >
      <Heading
        title='EMERGENCY ACCESS PROCEDURE (Required) - § 164.312(a)(2)(ii)'
        type='h4'
        color='neutral-800'
      />
      <Text
        size='fs-16'
        color='neutral-700'
        style={{ marginBottom: '20px' }}
      >
        This implementation specification requires a covered entity to{' '}
        <span className='featureContent--italic'>
          establish (and implement as needed) procedures for obtaining necessary electronic
          protected health information during an emergency.
        </span>
      </Text>

      <div style={{ marginTop: '20px' }}>
        <Heading
          title='HIPAAChecker to Evaluate Emergency Access Procedure'
          type='h5'
          color='neutral-800'
        />
      </div>

      <Text
        size='fs-16'
        color='neutral-700'
        style={{ marginBottom: '16px' }}
      >
        A strictly defined and controlled process should allow temporary elevated privileges under
        extenuating circumstances for emergency access to sensitive resources. HIPAAChecker
        evaluates the following emergency access procedure:
      </Text>

      <div className='featureContent--ml-50 featureContent--mt-8'>
        <Text
          size='fs-16'
          color='neutral-700'
          style={{ marginBottom: '16px' }}
        >
          <b>Authorization Protocol:</b> This step ensures that emergency access is granted only
          under legitimate circumstances and with proper authorization. It prevents misuse while
          allowing essential access when needed.
        </Text>
        <ul
          style={{ paddingLeft: '20px', marginBottom: '16px', color: '#4a4a4a', fontSize: '16px' }}
        >
          <li>
            Establish clear criteria for what qualifies as an emergency (e.g., patient in critical
            condition, system outage during treatment).
          </li>
          <li>
            Require electronic approval from a designated authority (e.g., data owner,
            administrator, or compliance officer).
          </li>
          <li>Ensure logs are secure and reviewable for compliance audits.</li>
          <li>
            Define and restrict the scope of access to only what is necessary for resolving the
            emergency.
          </li>
        </ul>
        <Text
          size='fs-16'
          color='neutral-700'
        >
          <b>Temporary Access:</b> Check whether the emergency access permission is revoked
          automatically after a defined time.
        </Text>
      </div>
    </div>
  );
};

export default PhiEmergencyAccess;
