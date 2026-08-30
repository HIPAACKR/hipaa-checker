'use client';

import Image from 'next/image';

import { landingPage } from '@/data/static-data';

const { userGuidelineData } = landingPage;

const UserGuidelineClient = ({ activeStep }) => {
  if (activeStep === null || activeStep === undefined) return null;

  const step = userGuidelineData[activeStep];

  return (
    <div className="userGuideline__content">
      <div className="userGuideline__install-step__title">
        {step.title}
      </div>

      {step.description && (
        <p
          className="userGuideline__install-step__description"
          dangerouslySetInnerHTML={{ __html: step.description }}
        ></p>
      )}

      {step.title === 'More on this topic' && (
        <div className="userGuideline__gitHub">
          <Image
            quality={100}
            src="/images/common/github-upload-process.svg"
            alt="copy and paste image"
            className="userGuideline__install-step__instruction-image__content"
            width={1280}
            height={1280}
          />
        </div>
      )}
      {step.image && step.title !== 'More on this topic' && (
        <div className="userGuideline__install-step__instruction-image">
          <Image
            quality={100}
            src={`/images/common/${step.image}.svg`}
            alt="instruction image"
            className="userGuideline__install-step__instruction-image__content"
            width={1280}
            height={1280}
          />
        </div>
      )}
    </div>
  );
};

export default UserGuidelineClient;
