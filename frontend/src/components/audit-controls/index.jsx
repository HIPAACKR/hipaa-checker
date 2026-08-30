import Image from 'next/image';

import Heading from '../heading';
import Text from '../text';

import './auditControls.css';

const AuditControls = () => {
  return (
    <div className='auditControls auditControls--border'>
      <Heading
        title={'Audit Controls'}
        type='h4'
        color='neutral-800'
      />
      <Text
        size='fs-16'
        color='neutral-700'
      >
        HIPAA audit control standards require the implementation of “Hardware, software, and/or
        procedural mechanisms that record and examine activity in information systems that contain
        or use electronic protected health information.”
      </Text>

      <Image
        src={'/images/common/audit-control-feature-image.svg'}
        alt='audit-control'
        style={{ margin: '20px 0px' }}
        width={800}
        height={170}
      />

      <div className='featureContent--mt-8'>
        <Text
          size='fs-16'
          color='neutral-700'
        >
          <b>HIPAAChecker validates the appropriate implementation of </b> audit controls to record
          and examine activity that contains or uses PHI. We examine
          <b>
            {' '}
            Audit Logs, Audit Log Reviews, Access Monitoring, Access Control, and Accountability.
          </b>
        </Text>
      </div>
    </div>
  );
};

export default AuditControls;
