'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '../button';
import Heading from '../heading';
import Text from '../text';

import './index.scss';

const OurProducts = () => {
  const router = useRouter();

  const productsData = [
    {
      id: 1,
      title: 'DroidPortal & mPlugin for Android',
      description: 'Identify and remediate HIPAA-related security vulnerabilities in Android applications during development.',
      technology: 'android',
      gradient: 'green',
      slug: 'droidPortal-mPlugin',
      icon: 'android.png'
    },
    {
      id: 2,
      title: 'xPlugin for iOS',
      description: 'Integrate HIPAA technical safeguard checks directly into Xcode during the iOS app development process.',
      technology: 'ios',
      gradient: 'orange',
      slug: 'x-plugin',
      icon: 'ios.png'
    },
    {
      id: 3,
      title: 'HIPAAChecker for Python Django',
      description: 'Support HIPAA technical safeguards within Python Django web applications.',
      technology: 'python',
      gradient: 'blue',
      slug: 'hipaachecker-for-python-django',
      icon: 'python.png'

    },
    {
      id: 4,
      title: 'HIPAAChecker for PHP Laravel',
      description: 'Support HIPAA technical safeguards within PHP Laravel applications.',
      technology: 'laravel',
      gradient: 'red',
      slug: 'hipaachecker-for-php-laravel',
      icon: 'php.png'
    },
    {
      id: 5,
      title: 'HIPAAChecker for Ruby on Rails',
      description: 'Support HIPAA technical safeguards within Ruby on Rails applications.',
      technology: 'rails',
      gradient: 'red',
      slug: 'hipaachecker-for-ruby-on-rails',
      icon: 'rails.png'
    },
    {
      id: 6,
      title: 'HIPAAChecker for Express.js',
      description: 'Identify and address HIPAA-related security issues within JavaScript Express.js codebases.',
      technology: 'express',
      gradient: 'purple',
      slug: 'hipaachecker-for-express-js',
      icon: 'ex.png'
    },
    {
      id: 7,
      title: 'HIPAAChecker for .NET',
      description: 'Support HIPAA technical safeguards within .NET applications.',
      technology: 'dotnet',
      gradient: 'lightblue',
      slug: 'hipaachecker-for-dot-net',
      icon: 'net.png'
    },
    {
      id: 8,
      title: 'DroidPortal & mPlugin for Android',
      description: 'Identify and remediate HIPAA-related security vulnerabilities in Android applications during development.',
      technology: 'android',
      gradient: 'lightgreen',
      slug: 'droidPortal-mPlugin',
      icon: 'mandroid.png'
    }
  ];

  return (
    <div className="ourProducts">
      <div className="ourProducts__header">
        <Heading
          title="OUR PRODUCTS"
          type="h6"
          color="neutral-400"
          align="center"
        />
        <Heading
          title="Solutions designed to help applications meet HIPAA technical safeguard requirements across platforms and frameworks."
          type="h2"
          color="neutral-800"
          
         
        />
      </div>
      
      <div className="ourProducts__grid">
        {productsData.map((product) => (
          <div key={product.id} className={`ourProducts__card ourProducts__card--${product.gradient}`}>
             <div className="ourProducts__card__content">
              <Heading
                title={product.title}
                type="h7"
                color="neutral-800"
                align="center"
                isNewLine={true}
              />
            
             <Image
                src={`/images/common/${product.icon}`}
                alt={product.title}
                width={150}
                height={150}
                className="mx-auto"
                
              />
           
              <Text size="fs-14" color="neutral-600" align='center'>
                {product.description}
              </Text>
              <Button type="secondary" size="small"               
                onClick={() => router.push(`/product-details/${product.slug}`)}
              >
                LEARN MORE
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurProducts;
