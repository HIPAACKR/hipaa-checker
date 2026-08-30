import Image from 'next/image';
import Link from 'next/link';

import Button from '../button';
import Heading from '../heading';
import Text from '../text';

import './index.scss';

const data = {
  'terms-conditions': {
    breadcrumb: 'Terms & conditions',
    title: 'Terms and conditions',
    description:
      'By accessing our website, you are agreeing to be bound by these terms of service, all applicable laws and regulations.',
  },
  downloads: {
    breadcrumb: 'Downloads',
    title: 'Download HIPAAChecker plugin',
    description: 'Download your preferred plugin , install and ready to code.',
  },
  blogs: {
    breadcrumb: 'Blogs',
    title: 'Blogs',  
    description:
      'Discover how easy HIPAA compliance can be with HIPAAChecker. Stop letting privacy regulations slow down innovation.',
  },

  'privacy-policy': {
    breadcrumb: 'Privacy Policy',
    title: 'Privacy Policy',
    description:
      'By accessing our website, you are agreeing to be bound by these terms of service, all applicable laws and regulations.',
  },
  products: {
    breadcrumb: 'Our Products',
    title: 'Explore our Products',
    description: 'Discover solutions that drive your software/applications to HIPAA standards.',
  },
  'contact-us': {
    breadcrumb: 'Contact us',
    title: 'Contact our Support',
    description: 'Reach out to us below. Our team responds fast!',
  },
  features: {
    breadcrumb: 'Features',
    title: 'Features',
    description:
      'By accessing our website, you are agreeing to be bound by these terms of service, all applicable laws and regulations.',
  },
  documentation: {
    breadcrumb: 'Documentation',
    title: 'Documentation',
    description:'How to scan your application with HIPAAChecker',
  },
  pricing: {
    breadcrumb: 'Pricing',
    title: 'Pricing & Subscription',
    description:
      'Contact our sales team if you need any assistance to pick appropriate subscription plan for your company',
  },
};

const productDetails = {
  'droidPortal-mPlugin': {
    title: `DroidPortal & mPlugin for Android`,
    description:
      'Your One-Stop Security Solution for Android Apps. Securing mHealth Android Apps with Real-Time HIPAA Compliance Checker.',
    image: 'droidPortal-mPlugin',
    icon: 'androidStudio.svg',
    platform: 'Android Studio',
  },
  'x-plugin': {
    title: `xPlugin for iOS`,
    description:
      'Your One-Stop Security Solution for Apple iOS Apps. Securing mHealth iOS Apps with Real-Time HIPAA Compliance Checker.',
    image: 'x-plugin',
    icon: 'ios.svg',
    platform: 'iOS',
  },
  'hipaachecker-for-python-django': {
    title: `HIPAAChecker for Python Django`,
    description:
      'Your One-Stop HIPAA Security Solution for Python Django web application framework.',
    image: 'hipaachecker-for-python-django',
    icon: 'python.svg',
    platform: 'Python Django',
  },
  'hipaachecker-for-php-laravel': {
    title: `HIPAAChecker for PHP Laravel`,
    description: 'Your One-Stop HIPAA Security Solution for PHP Laravel web application framework.',
    image: 'hipaachecker-for-php-laravel',
    icon: 'laravel.svg',
    platform: 'PHP -Laravel',
  },
  'hipaachecker-for-ruby-on-rails': {
    title: `HIPAAChecker for Ruby on Rails`,
    description:
      'Your One-Stop HIPAA Security Solution for Ruby on Rails web application framework.',
    image: 'hipaachecker-for-ruby-on-ralis',
    icon: 'rails.svg',
    platform: 'Ruby on Rails',
  },
  'hipaachecker-for-express-js': {
    title: `HIPAAChecker for Express.js`,
    description:
      'Your One-Stop HIPAA Security Solution for Javascript Express.js web application framework.',
    image: 'hipaachecker-for-express-js',
    icon: 'express.svg',
    platform: 'ExpressJS',
  },
  'hipaachecker-for-dot-net': {
    title: `HIPAAChecker for .NET`,
    description:
      'Your One-Stop HIPAA Security Solution for .NET web application framework.',
    image: 'hipaachecker-for-dot-net',
    icon: 'dotnet.svg',
    platform: '.NET',
  },
  'hipaachecker-for-spring-boot': {
    title: `HIPAAChecker for Spring Boot`,
    description:
      'Your One-Stop HIPAA Security Solution for Spring Boot web application framework.',
    image: 'hipaachecker-for-spring-boot',
    icon: 'spring.svg',
    platform: 'Spring Boot',
  },
  'enterprise-solution': {
    title: `Enterprise HIPAA Compliance`,
    description:
      'Our One-Stop, On-Premise HIPAA Compliance Platform for Enterprise Use.',
    image: 'enterprisesolution',
    icon: 'enterprise.svg',
    platform: 'On-Premise / Docker',
  },
  

};
const EyeCatch = ({ param, parentParam }) => {
  return (
    <div className={`eyeCatch eyeCatch--${param}`}>
      {(param === 'developer-guideline' || param === 'user-guideline') && (
        <div
          className={`${param === 'developer-guideline' ? 'eyeCatch__developer-guideline' : 'eyeCatch__user-guideline'}`}
        />
      )}
      {param !== 'developer-guideline' &&
        param !== 'user-guideline' &&
        parentParam !== 'product-details' && (
          <div  className={`eyeCatch__hero-section ${productDetails[param]?.image ? 'pt-[80px]' : 'pt-[70px]'}`}>
            <div className='eyeCatch__hero-section__content'>
              <div>
                <Link
                  href={'/'}
                  className='eyeCatch__hero-section__old-breadcrumb'
                >
                  Home
                </Link>
                <Text
                  color='white'
                  size='fs-18'
                >
                  /
                </Text>
                <Text
                  color='white'
                  size='fs-14'
                  weight='medium'
                >
                  {data[param]?.breadcrumb}
                </Text>
              </div>
              <div className='eyeCatch__hero-section__textWrapper'>
                <Heading
                  type='h2'
                  title={data[param]?.title}
                  color={'white'}
                  align='center'
                />
                <p className='eyeCatch__hero-section__description'>{data[param]?.description}</p>
              </div>
            </div>
          </div>
        )}
      {parentParam === 'product-details' && (
        <div className={`eyeCatch__hero-section ${productDetails[param]?.image ? 'pt-[80px]' : 'pt-[70px]'}`}>
          <div className='eyeCatch__hero-section__product-container'>
            <div className='eyeCatch__hero-section__product'>
              <div className='eyeCatch__hero-section__product__details'>
                <Heading
                  type='h1'
                  title={`${productDetails[param]?.title}`}
                  color={'white'}
                  align='left'
                />
                <p className='eyeCatch__hero-section__product__description eyeCatch__hero-section__product__description--mb'>
                  {productDetails[param]?.description}
                </p>
                <Link href={'/sign-in'} className='eyeCatch__hero-section__product__button-wrapper'>
                  <Button
                    size='large'
                    type='secondary'
                    icon={'arrowRight'}
                    animateIcon={true}
                    iconPosition={'after'}
                  >
                    Get started
                  </Button>
                </Link>
                <div className='eyeCatch__hero-section__product__content'>
                <div>
                  <div className='eyeCatch__hero-section__product__title'>Platform</div>
                  <div className='eyeCatch__hero-section__product__platform'>
                    <Image
                      quality={100}
                      className='eyeCatch__hero-section__product__platform-image'
                      src={`/images/icons/${productDetails[param]?.icon}`}
                      height={50}
                      width={50}
                      alt={productDetails[param]?.platform}
                    />
                    <span className='eyeCatch__hero-section__product__description'>
                      {productDetails[param]?.platform}
                    </span>
                  </div>
                </div>
                {param === 'droidPortal-mPlugin' && (
                  <div>
                    <div className='eyeCatch__hero-section__product__title'>Version</div>

                    <div className='eyeCatch__hero-section__product__description'>3.0</div>
                  </div>
                )}
                {param === 'enterprise-solution' && (
                  <div>
                    <div className='eyeCatch__hero-section__product__title'>Version</div>

                    <div className='eyeCatch__hero-section__product__description'>28.4.0</div>
                  </div>
                )}
              </div>
              </div>
              
              
            </div>
           <div className='eyeCatch__hero-section__product-image-container'>
          <Image         
            quality={100}
            className='eyeCatch__hero-section__product-container__image'
            src={`/images/common/${productDetails[param]?.image}.png`}
            width={650}
            height={370}
            alt={productDetails[param]?.title}
          />
      </div>
    </div>
  </div> 
)}
  </div>
  );
};

export default EyeCatch;