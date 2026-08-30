'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname} from 'next/navigation';

import { featuresTabs } from '@/data/features-data';
import { productsData } from '@/data/products-data';

import Button from '../button';

import './index.scss';

const NavBar = ({ 
  setIsActive,
  menuItems = [
    { name: 'Home', href: '/', slug: '' },
    { name: 'Features', href: `/features?search=${featuresTabs[0].slug}`, slug: 'features' },
    { name: 'Documentation', href: '/documentation', slug: 'documentation' },
    { name: 'Downloads', href: '/downloads', slug: 'downloads' },
    
  ],
  dropdownMenus = {
    products: {
      name: 'Products',
      slug: 'products',
      subMenuParent: 'product-details',
      items: [
        { name: 'All Products', href: '/products', slug: 'products' },
        ...productsData?.map(item => ({
          name: item.title,
          href: `/product-details/${item.slug}`,
          slug: item.slug
        })) || []
      ]
    },

    /*
    manual: {
      name: 'Manual',
      activeParams: ['developer-guideline', 'user-guideline'],
      items: [
        { name: 'Developer Guideline', href: '/developer-guideline', slug: 'developer-guideline' },
        { name: 'User Guideline', href: '/user-guideline', slug: 'user-guideline' }
      ]
    }
    */
  },
  appConfig = {
    appLink: 'https://hipaachecker.health/sign-in',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=health.hipaachecker',
    buttonText: 'Get started'
  }
}) => {

  const [isProductsActive, setProductsActive] = useState(null);
  // const [isManualActive, setManualActive] = useState(null);
  const [productsHeight, setProductsHeight] = useState(0);
  // const [manualHeight, setManualHeight] = useState(0);
  const productsHeightRef = useRef(null);
  // const manualHeightRef = useRef(null);

  const param = usePathname().split('/').pop();
  const subMenuParent = usePathname().split('/')[1];

  const openAppOrRedirect = () => {
    const startTime = new Date().getTime();
    window.location.href = appConfig.appLink;
    setTimeout(() => {
      const endTime = new Date().getTime();
      if (endTime - startTime < 2000) {
        window.location.href = appConfig.playStoreUrl;
      }
    }, 1500);
  };

  useEffect(() => {
    setTimeout(() => {
      if (productsHeightRef.current) {
        setProductsHeight(
          isProductsActive ? productsHeightRef.current.scrollHeight : 0
        );
      }

      
      /*
      if (manualHeightRef.current) {
        setManualHeight(isManualActive ? manualHeightRef.current.scrollHeight : 0);
      }
      */
    }, 0);
  }, [
    productsHeightRef,
    isProductsActive,
    // manualHeightRef,
    // isManualActive
  ]);

  return (
    <nav className='navBar'>
      <ul className='navBar__menu-items'>
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              className={`navBar__menu__item`}
              href={item.href}
              onClick={() => setIsActive(false)}
            >
              <div className='navBar__menu__arrow'>
                <span
                  className={`navBar__menu__name ${
                    param === item.slug
                      ? 'navBar__menu__name--active'
                      : ''
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          </li>
        ))}

       
        <li
          onClick={() => {
            setProductsActive((prev) => !prev);
            // setManualActive(false); 
          }}
        >
          <div className={`navBar__menu__item`}>
            <div className='navBar__menu__arrow'>
              <span
                className={`navBar__menu__name ${
                  param === dropdownMenus.products.slug ||
                  subMenuParent == dropdownMenus.products.subMenuParent
                    ? 'navBar__menu__name--active'
                    : ''
                }`}
              >
                {dropdownMenus.products.name}
              </span>
              <div className='navBar__menu__arrow-icon'>
                <Image
                  src='/images/icons/Down-arrow-icon.svg'
                  fill
                  alt='arrow-icon'
                />
              </div>
            </div>

            <div
              ref={productsHeightRef}
              style={{
                height:
                  productsHeight !== null
                    ? `${productsHeight}px`
                    : 'auto',
              }}
              className='navBar__menu__sub-item'
            >
              <ul>
                {dropdownMenus.products.items.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={() => setIsActive(false)}
                    >
                      <span
                        className={`${
                          param == item.slug
                            ? 'navBar__menu__item--active'
                            : ''
                        }`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      </ul>

      <Link
        href={appConfig.appLink}
        className='navBar__menu__get-started-button'
        onClick={(e) => {
          e.preventDefault();
          setIsActive(false);
          openAppOrRedirect();
        }}
      >
        <Button
          isFullWidth
          type='primary'
          size='large'
          icon={'arrowRight'}
          iconPosition={'before'}
          animateIcon={true}
        >
          {appConfig.buttonText}
        </Button>
      </Link>
    </nav>
  );
};

export default NavBar;
