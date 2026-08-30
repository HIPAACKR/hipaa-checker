import AccessControl from '../access-control';
import AuditControls from '../audit-controls';
import Authentication from '../authentication';
import DataIntegrity from '../data-integrity';
import EncryptionDecryption from '../encryption-decryption';
import IntegrityControls from '../integrity-controls';
import PhiEmergencyAccess from '../phi-emergency-access';
import PhiEncryption from '../phi-encryption';
import PreventUnauthorizedPhi from '../prevent-unauthorized-phi';
import SessionManagement from '../session-management';
import TransmissionSecurity from '../transmission-security';
import UuidTracking from '../uuid-tracking';

import './index.scss';

const FeatureContent = ({ selectedOptionUrl }) => {
  return (
    <div className='featureContent'>
      {(!selectedOptionUrl || selectedOptionUrl === 'access-control') && <AccessControl />}
      {selectedOptionUrl === 'uuid-tracking' && <UuidTracking />}
      {selectedOptionUrl === 'phi-emergency-access' && <PhiEmergencyAccess />}
      {selectedOptionUrl === 'session-management' && <SessionManagement />}
      {selectedOptionUrl === 'encryption-decryption' && <EncryptionDecryption />}

      {selectedOptionUrl === 'audit-controls' && <AuditControls />}

      {selectedOptionUrl === 'data-integrity' && <DataIntegrity />}
      {selectedOptionUrl === 'prevent-unauthorized-phi-alteration-destruction' && (
        <PreventUnauthorizedPhi />
      )}

      {selectedOptionUrl === 'authentication' && <Authentication />}

      {selectedOptionUrl === 'transmission-security' && <TransmissionSecurity />}
      {selectedOptionUrl === 'integrity-controls-over-transmission' && <IntegrityControls />}
      {selectedOptionUrl === 'phi-encryption' && <PhiEncryption />}
    </div>
  );
};

export default FeatureContent;
