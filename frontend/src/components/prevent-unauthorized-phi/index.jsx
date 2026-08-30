'use client';

import { useState } from 'react';
import Link from 'next/link';

import Heading from '../heading';
import Subtitle from '../subtitle';
import Text from '../text';

import './index.scss';

const PreventUnauthorizedPhi = () => {
  const [activeTab, setActiveTab] = useState('dataIntegrity');

  return (
    <div className='preventUnauthorizedPhi'>
      <Heading
        title={'HIPAACHECKER TO PROTECT UNAUTHORIZED PHI ALTERATION AND DESTRUCTION'}
        type='h4'
        color='neutral-800'
      />
      <Text
        size='fs-16'
        color='neutral-700'
      >
        HIPAAChekcer checks <Link href={'/features?search=access-control'}>Access Control</Link> and
        <Link href={'/features?search=audit-controls'}> Audit Controls</Link> to ensure that only
        authorized individuals can access PHI. Moreover, to protect the PHI data from alteration and
        destruction, we examine:
      </Text>

      {/* Tab Navigation */}
      <div className='tabs'>
        <button
          className={`tab ${activeTab === 'dataIntegrity' ? 'active' : ''}`}
          onClick={() => setActiveTab('dataIntegrity')}
        >
          Data Integrity Controls
        </button>
        <button
          className={`tab ${activeTab === 'backupRecovery' ? 'active' : ''}`}
          onClick={() => setActiveTab('backupRecovery')}
        >
          Backup and Recovery Procedures
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dataIntegrity' && (
        <div className='tabContent'>
          <Subtitle>Data Integrity Controls:</Subtitle>
          <ul>
            <li>
              <Text
                size='fs-16'
                color='neutral-700'
              >
                Check the implementation of data integrity controls, such as digital signatures,
                hash functions, or checksums, to detect unauthorized modifications to PHI during
                storage or transmission.
              </Text>
            </li>
            <li>
              <Text
                size='fs-16'
                color='neutral-700'
              >
                Check procedures for verifying the integrity of PHI and taking appropriate actions
                in case of detected alterations.
              </Text>
            </li>
          </ul>
        </div>
      )}

      {activeTab === 'backupRecovery' && (
        <div className='tabContent'>
          <Subtitle>Backup and Recovery Procedures:</Subtitle>
          <ul>
            <li>
              <Text
                size='fs-16'
                color='neutral-700'
              >
                Check whether the data backup and recovery procedures improve or not to protect
                against data loss or destruction.
              </Text>
            </li>
            <li>
              <Text
                size='fs-16'
                color='neutral-700'
              >
                We also check whether there is an offsite backup location to protect against
                physical damage or disasters.
              </Text>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PreventUnauthorizedPhi;
