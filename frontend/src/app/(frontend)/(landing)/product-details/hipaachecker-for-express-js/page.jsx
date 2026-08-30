import Image from 'next/image';

import EyeCatch from '@/components/eye-catch';
import FeatureChecklist from '@/components/features-checklist';
import Heading from '@/components/heading';
import Text from '@/components/text';
import { productsData } from '@/data/products-data';
import { createMetadata } from '@/data/seo-config';

import './index.scss';

export async function generateMetadata() {
  const product = productsData.find((p) => p.slug === 'hipaachecker-for-express-js');
  return createMetadata(
    `${product.title} | HIPAAChecker Product Details`,
    product.description,
    `/product-details/hipaachecker-for-express-js`
  );
}

const ProductDetails = () => {
  return (
    <div className='productDetails'>
      <EyeCatch
        param='hipaachecker-for-express-js'
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
              <div className='productDetails__container__title'>Unified JSPortal is here</div>
              <Text
                color='neutral-500'
                size='fs-18'
              >
                <strong>JSPortal</strong> is lightweight, cloud-native, and can check real-world
                Express.js webapp vulnerabilities with a single click using our website. Upload an
                codebase or link your git and see the HIPAA reports instantly.
              </Text>
            </div>
            <Image
              src='/images/common/express-details.svg'
              className='productDetails__container__portal-image'
              width={435}
              height={272}
              alt='unified image'
            />
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
                Evaluate your web app’s HIPAA Score and watermark as verified HIPAA-compliance
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
                Make your web app safe and secure. Contact our expert team for an quick solution to
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
            title={'See How our JSPortal Works Below'}
            type='h2'
            color='neutral-800'
            align='center'
          />
        </div>

        <iframe
          className='productDetails__youtube__player'
          width='1041'
          height='571'
          src="https://www.youtube.com/embed/el3fUmtggC0"
          
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
          src="https://www.youtube.com/embed/el3fUmtggC0"
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