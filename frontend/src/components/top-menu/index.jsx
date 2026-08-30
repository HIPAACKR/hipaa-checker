'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { featuresTabs } from '@/data/features-data';
import { subMenuDetails } from '@/data/sub-details';

import './index.scss';

const TopMenu = () => {
  const param = usePathname().split('/').pop();
  const subMenuParent = usePathname().split('/')[1];
  const router = useRouter();
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);

  const handleProductClick = (slug) => {
    setIsProductsMenuOpen(false);
    router.push(`/product-details/${slug}`);
  };

  const handleEnterpriseClick = () => {
    setIsProductsMenuOpen(false);
    router.push('/enterprise-solution');
  };

  return (
    <nav className='topMenu'>
      <menu className='topMenu__menu'>
        <ul className='topMenu__menu__items'>

          <li className='topMenu__menu__item-wrapper'>
            <Link className='topMenu__menu__item' href='/'>
              <span className={`topMenu__menu__name ${param === '' ? 'topMenu__menu__name--active' : ''}`}>
                Home
              </span>
            </Link>
          </li>


          <li className='topMenu__menu__item-wrapper'>
            <Link className='topMenu__menu__item' href={`/features?search=${featuresTabs[0].slug}`}>
              <span className={`topMenu__menu__name ${param === 'features' ? 'topMenu__menu__name--active' : ''}`}>
                Features
              </span>
            </Link>
          </li>


          <li 
            className='topMenu__menu__item-wrapper'
            onMouseEnter={() => setIsProductsMenuOpen(true)}
            onMouseLeave={() => setIsProductsMenuOpen(false)}
          >
            <div className='topMenu__menu__item'>
              <div className='topMenu__menu__arrow'>
                <span
                  className={`topMenu__menu__name ${
                    param === 'products' || subMenuParent === 'product-details'
                      ? 'topMenu__menu__name--active'
                      : ''
                  }`}
                >
                  Products
                </span>
                <div className='topMenu__menu__arrow-icon'>
                  <Image
                   src='/images/icons/Down-arrow-icon.svg'
                   fill alt='arrow-icon' />
                </div>
              </div>
            </div>


            <div className={`topMenu__menuOverlay ${isProductsMenuOpen ? 'topMenu__menuOverlay--open' : ''}`}>
             <div className='topMenu__menuWrapper topMenu__menuWrapper--products'>

                <div>
                  <div className="topMenu__productsHeader">PRODUCTS</div>
                  <div className='topMenu__productsContainer'>
                    {subMenuDetails.map((product) => (
                      <div
                        key={product.slug}
                        className='topMenu__productItem'
                        onClick={() => handleProductClick(product.slug)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className='topMenu__productIcon'>
                          <Image
                            src={`/images/icons/${product.icon}`}
                            alt={product.title}
                            width={48}
                            height={48}
                          />
                        </div>
                        <div className='topMenu__productContent'>
                          <div className='topMenu__productTitleWrapper'>
                            <span className='topMenu__productTitle'>{product.title}</span>
                           
                          </div>
                          <p className='topMenu__productDesc'>{product.description}</p>
                          <button
                            type="button"
                            className="topMenu__learnMoreLink"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product.slug);
                            }}
                          >
                            <span className="text">Learn more</span>
                            <Image
                              src="/images/icons/sub_right_arrow.svg"
                              alt="Right Arrow"
                              width={18}
                              height={18}
                              className="arrow"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                <div className='topMenu__othersPlatform'>
                  <div className='topMenu__othersHeader'>OTHERS PLATFORM</div>

                  <div
                    className='topMenu__othersItem'
                    onClick={handleEnterpriseClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className='topMenu__productTitleWrapper'>
                      <h4 className='topMenu__productTitle'>Enterprise Solution</h4>
                      <Image
                        src="/images/icons/badge.svg"
                        alt="New badge"
                        width={51}
                        height={26}
                        className="topMenu__badge"
                      />
                    </div>
                    <p>An on-premise deployment model designed to provide greater control, security, and alignment with HIPAA requirements.</p>
                    <button
                      type="button"
                      className="topMenu__learnMoreLink"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnterpriseClick();
                      }}
                    >
                      <span className="text">Learn more</span>
                      <Image
                        src="/images/icons/sub_right_arrow.svg"
                        alt="Right Arrow"
                        width={18}
                        height={18}
                        className="arrow"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
          {/* <li className='topMenu__menu__item-wrapper'>
            <Link className='topMenu__menu__item' href='/pricing'>
              <span className={`topMenu__menu__name ${param === 'pricing' ? 'topMenu__menu__name--active' : ''}`}>
                Pricing
              </span>
            </Link>
          </li> */}

          <li className='topMenu__menu__item-wrapper'>
            <Link
              className={`topMenu__menu__item`}
              href='/documentation'
            >
              <span
                className={`topMenu__menu__name ${param === 'documentation' ? 'topMenu__menu__name--active' : ''} `}
              >
                Documentation
              </span>
            </Link>
          </li>
           <li className='topMenu__menu__item-wrapper'>
            <Link
              className={`topMenu__menu__item`}
              href='/blog-page'
            >
              <span
                className={`topMenu__menu__name ${param === 'blogs' ? 'topMenu__menu__name--active' : ''} `}
              >
                Blogs 
              </span>
            </Link>
          </li>

          <li className='topMenu__menu__item-wrapper'>
            <Link className='topMenu__menu__item' href='/downloads'>
              <span className={`topMenu__menu__name ${param === 'downloads' ? 'topMenu__menu__name--active' : ''}`}>
                Downloads
              </span>
            </Link>
          </li>
        </ul>
      </menu>
    </nav>
  );
};

export default TopMenu;