'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Heading from '../heading';
import Text from '../text';

import './index.scss';

const AccessControl = () => {
  const [activeTab, setActiveTab] = useState('hipaaRule');

  return (
    <div className='accessControl'>
      <div className='featureContent--mb-20'>
        <Heading
          title={'Access Control'}
          type='h4'
          color='neutral-800'
        />
        <Text
          size='fs-16'
          color='neutral-700'
        >
          {'The Security Rule defines access in § 164.304 as '}
          <span className='featureContent--italic'>
            {`“the ability or the means necessary to read, write, modify, or communicate data/information or otherwise use any system resource. [`}
            <Link
              target='_blank'
              href={'https://www.hhs.gov/hipaa/for-professionals/privacy/index.html'}
            >
              HIPAA Privacy Rule
            </Link>
            {`].”`}
          </span>
        </Text>
      </div>
      {/* Banner */}
      <div className='banner'>
        <Image
          src={'/images/common/access-control-feature-image.svg'}
          alt='Access Control Banner'
          layout='responsive'
          width={1200}
          height={300}
        />
      </div>

      {/* Tabs Navigation */}
      <div className='tabs'>
        <button
          className={`tab ${activeTab === 'hipaaRule' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('hipaaRule')}
        >
          HIPAA Privacy Rule
        </button>
        <button
          className={`tab ${activeTab === 'hipaaChecker' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('hipaaChecker')}
        >
          HIPAAChecker Access Control
        </button>
        <button
          className={`tab ${activeTab === 'hipaaRestrict' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('hipaaRestrict')}
        >
          Restricting Sensitive Resources
        </button>
      </div>

      {/* Tabs Content */}
      <div className='tabContent'>
        {activeTab === 'hipaaRule' && (
          <div>
            <Heading
              title={'What is the HIPAA Privacy Rule?'}
              type='h5'
              color='neutral-800'
            />
            <Text
              size='fs-16'
              color='neutral-700'
            >
              Appropriate safeguards to protect the privacy of{' '}
              <b>Personal Health Information (PHI)</b> and set limits and conditions on the uses and
              disclosures to restrict information access without patient authorization. HIPAA
              Privacy Rules:
            </Text>
            <ul>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  Apply to health care providers that conduct health information transactions
                  electronically.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  Set rules to safeguard and use Protected Health Information.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  Ensure {`patient's`} rights over their health information.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  Restrict the disclosure of protected health information by covered entities
                  without explicit patient authorization except for purposes of treatment, payment,
                  and health care operations.
                </Text>
              </li>
            </ul>
          </div>
        )}
        {activeTab === 'hipaaChecker' && (
          <div>
            <Heading
              title={'HIPAAChecker to check and validate Access Control'}
              type='h5'
              color='neutral-800'
            />
            <Text
              size='fs-16'
              color='neutral-700'
            >
              HIPAAChecker assesses software/application codebase to scan and fix vulnerabilities in
              technical safeguards for protecting electronic PHI and sensitive resources.
              HIPAAChecker provides:
            </Text>
            <ul>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Role-Based Access Control</b> - Check if Users can only access data necessary
                  for their role.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Attribute-Based Access Control</b> - Access decisions are based on attributes
                  of the user, resource, environment conditions, etc.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>OAuth 2.0</b> - Check external {`applications' `}access to user data/resources
                  using the OAuth 2.0 protocol.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>OpenID Connect</b> - Check the implementation authentication layer on top of
                  OAuth 2.0 to verify user identities.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Multi-Factor Authentication</b> - Verify if the system requires multiple
                  authentication factors, such as a password combined with a one-time code, to
                  ensure robust identity verification.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Encrypted Authentication</b> - Assess if the application securely authorizes
                  access using public/private key pairs or digital certificates to prevent
                  unauthorized access.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Granular Authorization</b> - Check if access permissions are narrowly defined,
                  allowing users to interact with only specific sensitive data fields or objects as
                  necessary.
                </Text>
              </li>
            </ul>
          </div>
        )}
        {activeTab === 'hipaaRestrict' && (
          <div>
            <Heading
              title={'Restricts Illegal Access to Sensitive Resources'}
              type='h5'
              color='neutral-800'
            />
            <Text
              size='fs-16'
              color='neutral-700'
            >
              Implementing robust access controls and security measures is crucial to protect
              sensitive resources from illegal access attempts. Here are some key strategies that
              HIPAAChecker identifies:
            </Text>
            <ul>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Sensitive Data Identification</b> - Identify sensitive data/resources based on
                  the user’s level of confidentiality and criticality.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Least Privilege Access</b> - Check whether users are granted only the minimum
                  permissions and access required to access legitimate resources. Identify excessive
                  privileges that expand the risk surface.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Encryption</b> - Detect the implementation of strong encryption (e.g., AES-256)
                  or weak (e.g., SHA-1) to protect data at rest and in transit across networks.
                </Text>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessControl;
