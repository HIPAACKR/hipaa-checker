'use client';

import { useState } from 'react';
import Link from 'next/link';

import Heading from '../heading';
import Subtitle from '../subtitle';
import Text from '../text';

import './enc-decr.css';

const EncryptionDecryption = () => {
  const [activeTab, setActiveTab] = useState('symmetric'); // Default to 'symmetric' tab

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className='encryptionDecryption'>
      <Heading
        title={'ENCRYPTION AND DECRYPTION (Addressable) - § 164.312(a)(2)(iv)'}
        type='h4'
        color='neutral-800'
      />
      <Text
        size='fs-16'
        color='neutral-700'
      >
        Preventing access to EPHI by persons or software programs that have not been granted access
        rights is essential. Healthcare software/applications must “Implement a mechanism to encrypt
        and decrypt electronic protected health information”. The goal of encryption is to protect
        EPHI from being accessed and viewed by unauthorized users.
      </Text>
      <div className='featureContent--mt-20 featureContent--mb-20'>
        <Subtitle>
          HIPAAChecker Assistance to Implement encryption and decryption procedures to secure PHI
          transmissions
        </Subtitle>
        <Text
          size='fs-16'
          color='neutral-700'
        >
          HIPAACkecker checks whether an application implements the{' '}
          <Link
            target='_blank'
            href={'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-175Br1.pdf'}
          >
            National Institute of Standards and Technology (NIST)
          </Link>{' '}
          approved encryption and decryption procedures to protect PHI. We identify vulnerabilities
          in your implemented encryption and decryption algorithms and show you how to improve
          security to meet NIST standards. Several types of encryption and decryption algorithms are
          used to secure data. Here are some of the most commonly used algorithms that HIPAAChecker
          inspects:
        </Text>
      </div>
      {/* Tab navigation */}
      <div className='tabs'>
        <button
          onClick={() => handleTabChange('symmetric')}
          className={activeTab === 'symmetric' ? 'active' : ''}
        >
          Symmetric-key Encryption
        </button>
        <button
          onClick={() => handleTabChange('asymmetric')}
          className={activeTab === 'asymmetric' ? 'active' : ''}
        >
          Asymmetric-key Encryption
        </button>
        <button
          onClick={() => handleTabChange('hash')}
          className={activeTab === 'hash' ? 'active' : ''}
        >
          Hash Functions
        </button>
        <button
          onClick={() => handleTabChange('block')}
          className={activeTab === 'block' ? 'active' : ''}
        >
          Block Ciphers
        </button>
      </div>

      {/* Tab content */}
      <div className='tabContent'>
        {activeTab === 'symmetric' && (
          <div>
            <Subtitle>Symmetric-key Encryption:</Subtitle>
            <Text
              size='fs-16'
              color='neutral-700'
            >
              In symmetric-key encryption, the same key is used for both encryption and decryption.
              Examples include:
            </Text>
            <ul>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Data Encryption Standard (DES):</b> An old symmetric-key algorithm that uses a
                  56-bit key. It’s considered{' '}
                  <span className='featureContent--red'>
                    <b>insecure</b>
                  </span>{' '}
                  due to its relatively small key size.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Triple DES (3DES):</b> A variant of DES that applies the DES algorithm three
                  times with different keys for increased security. This is also{' '}
                  <span className='featureContent--red'>vulnerable to cyber-attacks</span>.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Advanced Encryption Standard (AES):</b> A widely used symmetric-key algorithm
                  that supports key lengths of 128, 192, and 256 bits. AES is recommended by NIST
                  and is considered <span className='featureContent--green'>highly secure</span>.
                </Text>
              </li>
            </ul>
          </div>
        )}
        {activeTab === 'asymmetric' && (
          <div>
            <Subtitle>Asymmetric-key Encryption (Public-key Encryption):</Subtitle>
            <Text
              size='fs-16'
              color='neutral-700'
            >
              Public-key encryption and private-key decryption methods. Examples include:
            </Text>
            <ul>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>RSA (Rivest-Shamir-Adleman):</b> One of the most widely used public-key
                  cryptosystems and secure, based on the mathematical problem of factoring large
                  integers.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>Elliptic Curve Cryptography (ECC):</b> A type of public-key cryptography based
                  on the algebraic structure of elliptic curves over finite fields. ECC offers
                  smaller key sizes compared to RSA while providing{' '}
                  <span className='featureContent--green'>equivalent security</span>.
                </Text>
              </li>
            </ul>
          </div>
        )}
        {activeTab === 'hash' && (
          <div>
            <Subtitle>Hash Functions:</Subtitle>
            <Text
              size='fs-16'
              color='neutral-700'
            >
              HIPAAChecker ensures your implemented hash functions are strong and secure. Examples
              include:
            </Text>
            <ul>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>MD5 (Message Digest 5):</b> A <span className='featureContent--red'>weak</span>{' '}
                  hash function and may cause <span className='featureContent--red'>collision</span>
                  .
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>SHA (Secure Hash Algorithm):</b> A family of hash functions, including{' '}
                  <span className='featureContent--red'>SHA-1</span>, SHA-256,{' '}
                  <span className='featureContent--red'>SHA-384</span>, and SHA-512, with varying
                  digest sizes. Except for <span className='featureContent--green'>SHA-256</span>{' '}
                  and
                  <span className='featureContent--green'>SHA-512</span>, others are insecure.
                </Text>
              </li>
            </ul>
          </div>
        )}
        {activeTab === 'block' && (
          <div>
            <Subtitle>Block Ciphers:</Subtitle>
            <ul>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>ECB Mode:</b> ECB mode’s advantages are its simplicity and ability to
                  parallelize encryption and decryption operations. However,{' '}
                  <span className='featureContent--red'>ECB mode</span> is known to be{' '}
                  <span className='featureContent--red'>weak</span>, as it results in the same
                  ciphertext for identical blocks of plaintext. Alternative secure block cipher
                  methods are{' '}
                  <span className='featureContent--green'>
                    Cipher Block Chaining (CBC), Counter Mode (CTR), or galois/Counter Mode (GCM)
                  </span>
                  .
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>DES (Data Encryption Standard):</b> An older block cipher with a 64-bit block
                  size and 56-bit key size and its{' '}
                  <span className='featureContent--red'>insecure</span>.
                </Text>
              </li>
              <li>
                <Text
                  size='fs-16'
                  color='neutral-700'
                >
                  <b>AES (Advanced Encryption Standard):</b> A widely used block cipher with block
                  sizes of 128, 192, and 256 bits,{' '}
                  <span className='featureContent--green'>approved by NIST</span>.
                </Text>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncryptionDecryption;
