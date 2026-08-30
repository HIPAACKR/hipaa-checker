import EyeCatch from '@/components/eye-catch';
import Heading from '@/components/heading';
import { PrivacyPolicyData } from '@/data/privacy-policy-data';
import { privacyPolicyPageMetadata } from '@/data/seo-config';

import './index.scss';

export const metadata = privacyPolicyPageMetadata;

const PrivacyPolicy = () => {
  return (
    <div className='privacyPolicy'>
      <EyeCatch param='privacy-policy' />

      <div className='privacyPolicy__body'>
        <div className='privacyPolicy__sectionWrapper'>
          <Heading
            title={'Terms Of Use and Privacy Policy'}
            type='h4'
            color='neutral-800'
          />
        </div>

        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.disclaimer.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point1.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point1.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point2.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point2.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point3.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point3.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point4.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point4.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point5.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point5.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point6.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point6.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point7.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point7.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point8.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point8.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point9.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point9.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point10.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point10.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point11.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point11.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point12.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point12.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point13.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point13.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point14.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point14.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point15.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point15.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point16.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point16.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point17.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point17.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point18.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point18.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point19.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point19.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point20.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point20.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point21.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point21.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point22.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point22.description }} />
        <div className='font-bold text-xl'>{PrivacyPolicyData.point23.title}</div>
        <div dangerouslySetInnerHTML={{ __html: PrivacyPolicyData.point23.description }} />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
