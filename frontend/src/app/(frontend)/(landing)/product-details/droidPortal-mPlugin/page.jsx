import Image from 'next/image';

import EyeCatch from '@/components/eye-catch';
import FeatureChecklist from '@/components/features-checklist';
import Heading from '@/components/heading';
import Text from '@/components/text';
import { productsData } from '@/data/products-data';
import { createMetadata } from '@/data/seo-config';

import './index.scss';

export async function generateMetadata() {
  const product = productsData.find((p) => p.slug === 'droidPortal-mPlugin');
  return createMetadata(
    `${product.title} | HIPAAChecker Product Details`,
    product.description,
    `/product-details/droidPortal-mPlugin`
  );
}

const ProductDetails = () => {
  return (
    <div className='productDetails'>
      <EyeCatch
        param='droidPortal-mPlugin'
        parentParam='product-details'
      />
      <div className='productDetails__container-background'>
        <div className='productDetails__heading'>
          <Heading
            title={'Understanding the Inner of Our Product'}
            type='h3'
            color='neutral-800'
            align='center'
          />
        </div>
        <div className='productDetails__container'>
          <div className='productDetails__content'>
            <div>
              <div className='productDetails__container__title'>Unified DroidPortal Is Here</div>
              <Text
                color='neutral-500'
                size='fs-18'
              >
                <strong>DroidPortal</strong> is lightweight, cloud-native, and can check real-world
                APK vulnerabilities with a single click using our website. Upload an APK file or a
                link to your git codebase and see the HIPAA reports instantly.
              </Text>
            </div>
            <Image
              src='/images/common/androidStudio-details.svg'
              className='productDetails__container__portal-image'
              width={435}
              height={272}
              alt='unified image'
            />
          </div>

          <div className='productDetails__content productDetails__content--sp-reverse'>
            <Image
              src='/images/common/plugin.svg'
              className='productDetails__container__plugin-image'
              width={438}
              height={300}
              alt='unified image'
            />
            <div>
              <div className='productDetails__container__title'>
                Android Studio Plugin (mPlugin)
              </div>
              <Text
                color='neutral-500'
                size='fs-18'
              >
                Install mPlugin into your IDE and see the real-time HIPAA reports and suggestions to
                fix the codebase vulnerabilities.
              </Text>
            </div>
          </div>

          <div className='productDetails__content productDetails__content--sp-reverse'>
            <Image
              src='/images/common/scan-details.svg'
              className='productDetails__container__scan-image'
              width={403}
              height={260}
              alt='scan image'
            />
            <div>
              <div className='productDetails__container__title'>Scan and Fix Vulnerabilities</div>
              <Text
                color='neutral-500'
                size='fs-18'
              >
                Identify the vulnerability risk level within code segments and fix them using
                HIPAAChecker suggestions.
              </Text>
            </div>
          </div>

          <div className='productDetails__content'>
            <div>
              <div className='productDetails__container__title'>HIPAA-Compliance Watermark</div>
              <Text
                color='neutral-500'
                size='fs-18'
              >
                Evaluate your applications’ HIPAA Score and watermark as verified HIPAA compliance
                before uploading to the marketplace.
              </Text>
            </div>
            <Image
              src='/images/common/score-details.svg'
              className='productDetails__container__certified-image'
              width={466}
              height={265}
              alt='unified image'
            />
          </div>

          <div className='productDetails__content productDetails__content--sp-reverse'>
            <Image
              src='/images/common/check-product-page.svg'
              className='productDetails__container__checker-image'
              width={456}
              height={255}
              alt='unified image'
            />
            <div>
              <div className='productDetails__container__title'>
                Elevate your Trust and Outcomes
              </div>
              <Text
                color='neutral-500'
                size='fs-18'
              >
                Make Your app safe and secure. Contact our expert team for an quick solution to
                reduce data breaches and privacy violations.
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className='productDetails__check-feature'>
        <div className='productDetails__check-feature__heading'>
          <Heading
            title={'Check all features'}
            type='h2'
            color='neutral-800'
            align='center'
          />
        </div>
        <FeatureChecklist />
        <div className='productDetails__youtube__heading'>
          <Heading
            title={'See How Our DroidPortal & mPlugin Works Below'}
            type='h2'
            color='neutral-800'
            align='center'
          />
        </div>

        <iframe
          className='productDetails__youtube__player'
          width='1041'
          height='571'
          src='https://www.youtube.com/embed/nfrFJEOHrk8?si=tOiYhsFZ8c4rYYsI'
          title='YouTube video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          referrerPolicy='strict-origin-when-cross-origin'
          allowFullScreen
        ></iframe>
        <iframe
          className='productDetails__youtube__player-sp'
          width='335'
          height='250'
          src='https://www.youtube.com/embed/nfrFJEOHrk8?si=tOiYhsFZ8c4rYYsI'
          title='YouTube video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          referrerPolicy='strict-origin-when-cross-origin'
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default ProductDetails;