'use client';
import Image from 'next/image';
import Link from 'next/link';

import Newsletter from '../newsletter';

import './index.scss';

const solutions = [
  {
    id: 0,
    link: '/product-details/droidPortal-mPlugin',
    title: 'Android',
  },
  {
    id: 1,
    link: '/product-details/x-plugin',
    title: 'iOS',
  },
  {
    id: 2,
    link: '/product-details/hipaachecker-for-python-django',
    title: 'Python Django',
  },
  {
    id: 3,
    link: '/product-details/hipaachecker-for-php-laravel',
    title: 'Laravel',
  },
  {
    id: 4,
    link: '/product-details/hipaachecker-for-ruby-on-rails',
    title: 'Ruby on Rails',
  },
  {
    id: 5,
    link: '/product-details/hipaachecker-for-express-js',
    title: 'Express.js',
  },
  {
    id: 6,
    link: '/product-details/hipaachecker-for-dot-net',
    title: '.NET',
  },
  {
    id: 7,
    link: '/product-details/hipaachecker-for-spring-boot',
    title: 'Spring Boot',
  },
];

const company = [
  {
    id: 0,
    link: '/contact-us',
    title: 'Contact Us',
  },
  {
    id: 1,
    link: '/privacy-policy',
    title: 'Privacy Policy',
  },
  {
    id: 2,
    link: '/terms-conditions',
    title: 'Terms & Condition',
  },
];
const products = [
  {
    id: 0,
    icon: '/images/icons/hipaalogo.svg',
    link: 'https://www.hipaachecker.health/',
    alt: 'HIPAA Product',
  },
  {
    id: 1,
    icon: '/images/icons/gdprproductlogo.svg',
    link: 'https://www.gdprcheck.ai/',
    alt: 'GDPR Product',
  },
  {
    id: 2,
    icon: '/images/icons/soc2logo.svg',
    link: 'https://www.soc2check.ai/',
    alt: 'SOC2 Product',
  },
  {
    id: 3,
    icon: '/images/icons/iso27001logo.svg',
    link: 'https://www.securitycompliance.tech/',
    alt: 'ISO 27001 Product',
  },
];

const upcomingProducts = [
  {
    id: 0,
    icon: '/images/icons/iso42001logo.svg',
    alt: 'ISO 45001',
  },
  {
    id: 1,
    icon: '/images/icons/nistlogo.svg',
    alt: 'NIST',
  },
  {
    id: 2,
    icon: '/images/icons/pcidsslogo.svg',
    alt: 'PCI DSS',
  },
  {
    id: 3,
    icon: '/images/icons/CMMC_logo_for_footer.svg',
    alt: 'CMMC',
  },
];

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer__container'>
        <div className='footer__wrapper'>
          <div className='footer__icons-description'>
            <div className='footer__logo-description'>
              <Image
                className='footer__logo'
                src='/images/common/hipaachecker-logo.svg'
                alt='hipaachecker-footer logo'
                width={196}
                height={35}
              />
              <div className='footer__description'>
                Enhance data security through controlled access to protected health information (PHI). Support HIPAA compliance across your development and deployment workflows.
              </div>
            </div>
          </div>
          <div className='footer__company-resource'>
            <div className='footer__company'>
              <h3 className='footer__company-title'>Company</h3>
              <div className='footer__company-links'>
                {company?.map((link) => (
                  <Link
                    className='footer__company-link'
                    key={link.id}
                    href={link.link}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className='footer__resource'>
              <h3 className='footer__resource-title'>Products</h3>
              <div className='footer__resource-links'>
                {solutions?.map((link) => (
                  <Link
                    className='footer__resource-link'
                    key={link.id}
                    href={link.link}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Newsletter />
        </div>
        {/* Products and Upcoming Products Section */}
        <div className='footer__products-section'>
          <div className='footer__products'>
            <h3 className='footer__products-title'>Products </h3>
            <div className='footer__products-icons'>
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={product.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='footer__product-link'
                >
                  <Image
                    src={product.icon}
                    alt={product.alt}
                    width={60}
                    height={60}
                    className='footer__product-icon'
                  />
                </Link>
              ))}
            </div>
          </div>
          
          <div className='footer__upcoming-products'>
            <h3 className='footer__upcoming-products-title'>Upcoming Products</h3>
            <div className='footer__upcoming-products-icons'>
              {upcomingProducts.map((product) => (
                <div
                  key={product.id}
                  className='footer__upcoming-product'
                >
                  <Image
                    src={product.icon}
                    alt={product.alt}
                    width={60}
                    height={60}
                    className='footer__upcoming-product-icon'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='footer__notice-wrapper'>
        This project is funded by{' '}
        <strong className='footer__strong'>NIH-STTR Phase I, NIH-STTR Phase II</strong> and{' '}
        <strong className='footer__strong'>
          the Center for Technology Commercialization (CTC), Wisconsin, USA.
        </strong>
      </div>
      <div className='footer__container'>
        <div className='footer__copywrite-wrapper'>
          <p className='footer__copywrite'>
            {`© ${new Date().getFullYear()} UbiComply. All rights reserved.`}
          </p>
          <div className='footer__icons'>
            {/* <Link
              target='_blank'
              href='/#'
            >
              <Image
                className='footer__icon'
                src='/images/icons/x.svg'
                alt='twitter-logo'
                width={40}
                height={40}
              />
            </Link> */}

            <Link
              target='_blank'
              href='https://youtube.com/@hipaachecker-y9e?si=I-_8jOFYkAWN2O5K'
            >
              <Image
                className='footer__icon'
                src='/images/icons/youtube.svg'
                alt='youtube-logo'
                width={40}
                height={40}
              />
            </Link>

            <Link
              target='_blank'
              href='https://www.linkedin.com/company/106729801/admin/dashboard/'
            >
              <Image
                className='footer__icon'
                src='/images/icons/linkedin.svg'
                alt='linkedin-logo'
                width={40}
                height={34}
              />
            </Link>

            <Link
              target='_blank'
              href='https://www.facebook.com/HipaaChecker'
            >
              <Image
                className='footer__icon'
                src='/images/icons/facebook.svg'
                alt='facebook logo'
                width={40}
                height={40}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
