'use client';

import { useState } from 'react';
import Image from 'next/image';

import Heading from '@/components/heading';
import Text from '@/components/text';

import './index.scss';

const EnterpriseVideoSection = () => {
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <div className="EnterpriseVideoSection">
      <div className="EnterpriseVideoSection__badge">
        View Demo For Enterprise Self-Hosted Solution For HIPAA
      </div>

      <Heading
        type="h3"
        color="primary-900"
        align="center"
        weight="light"
        className="EnterpriseVideoSection__heading"
      >
        See <strong>Enterprise Self-Hosted Solution For HIPAA</strong>
        <span>Compliance In Action</span>
      </Heading>

      <Text
        size="fs-18"
        color="primary-900"
        align="center"
        className="EnterpriseVideoSection__description"
      >
        Watch A Live Walkthrough Of The UbiComply Platform And Discover How Enterprise Healthcare Teams Simplify
        Compliance Operations, Strengthen PHI Security, And Maintain Continuous Audit Readiness At Scale.
      </Text>

      <div className="EnterpriseVideoSection__thumbnailWrapper">
        {playVideo ? (
          <div className="EnterpriseVideoSection__videoContainer">
            <iframe
              src="https://www.youtube.com/embed/nfrFJEOHrk8?si=tOiYhsFZ8c4rYYsI"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div
            onClick={() => setPlayVideo(true)}
            className="EnterpriseVideoSection__thumbnailButton"
          >
            <Image
              src="/images/common/enterprise_thumb.svg"
              alt="Enterprise Video Thumbnail"
              width={920}
              height={500}
              className="EnterpriseVideoSection__thumbnail"
            />
          </div>
        )}

        <Text
          size="fs-14"
          color="primary-900"
          align="center"
          className="EnterpriseVideoSection__caption"
        >
          Watch this video plugin installation from here.
        </Text>
      </div>
    </div>
  );
};

export default EnterpriseVideoSection;