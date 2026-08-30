'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import arrowDown from '@/../public/images/icons/arrowDown.svg';
import { featuresTabs, menuOfSubMenu } from '@/data/features-data';

import Text from '../text';

import './index.scss';

const TabFeature = ({ selectedOptionUrl }) => {
  const [activeTab, setActiveTab] = useState(selectedOptionUrl);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [openedMenu, setOpenedMenu] = useState([]);

  const [dropDownPlaceholder, setDropDownPlaceholder] = useState(featuresTabs?.[0]?.title);
  const route = useRouter();
  useEffect(() => {
    setOpenedMenu([menuOfSubMenu[selectedOptionUrl], selectedOptionUrl]);
  }, [selectedOptionUrl]);
  useEffect(() => {
    if (selectedOptionUrl) {
      const isValidLink = featuresTabs?.some((item) => {
        if (item?.slug == selectedOptionUrl) {
          setActiveTab(item?.slug);
          setDropDownPlaceholder(item?.title);
          return true;
        } else {
          if (item?.subtitle) {
            const isMatched = item?.subtitle?.some((sub) => {
              if (sub?.slug == selectedOptionUrl) {
                setActiveTab(sub?.slug);
                setDropDownPlaceholder(sub?.subTitleName);
                return true;
              }
            });
            if (isMatched) return true;
          }
        }
      });
      if (!isValidLink) route.push(`/features?search=${featuresTabs?.[0]?.slug}`);
    } else setActiveTab(featuresTabs?.[0]?.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptionUrl]);

  const isSubMenuActive = (slug) => {
    let activeMenu;
    featuresTabs?.some((item) => {
      const isMatched = item?.subtitle?.some((sub) => {
        if (sub?.slug === selectedOptionUrl) {
          activeMenu = item?.slug;
          return true;
        }
      });
      if (isMatched) return true;
    });
    return slug == activeMenu;
  };

  const handleFeatureClick = (title, slug) => {
    if (!menuOfSubMenu[slug]) {
      setOpenedMenu([]);
    }
    setTimeout(() => {
      setActiveTab(slug);
      setDropDownPlaceholder(title);
      setDropDownOpen(false);
      setOpenedMenu([slug]);
      route.push('/features?search=' + slug, { scroll: false });
    }, 600);
  };

  return (
    <div className='tabFeature'>
      <Text
        size='fs-18'
        color='primary-500'
        weight='medium'
      >
        HIPAAChecker Features
      </Text>
      {featuresTabs?.map((feature, index) => (
        <div key={index}>
          <input
            type='checkbox'
            id={`feature-${index}`}
            name='feature-toggle'
            className='tabFeature__tabMenu__toggle-radio'
            checked={openedMenu.includes(feature?.slug)}
          />
          <label htmlFor={`feature-${index}`}>
            <div
              className={`tabFeature__tabMenu__defaultTab ${activeTab === feature.slug || isSubMenuActive(feature?.slug) ? 'tabFeature__tabMenu__activeTab' : ''}`}
            >
              <div
                onClick={() => {
                  handleFeatureClick(feature?.title, feature?.slug);
                }}
              >
                <Text
                  size='fs-16'
                  color='neutral-600'
                >
                  {feature?.title}
                </Text>
              </div>
              {feature?.subtitle && (
                <div
                  className='tabFeature__tabMenu__arrow-icon'
                  onClick={() => {
                    if (openedMenu.includes(feature?.slug)) {
                      setOpenedMenu(openedMenu.filter((item) => item != feature?.slug));
                    } else {
                      setOpenedMenu([...openedMenu, feature?.slug]);
                    }
                  }}
                />
              )}
            </div>
          </label>
          <div className='tabFeature__tabMenu__subtitle'>
            {feature?.subtitle?.map((sub, innerIndex) => (
              <div
                key={innerIndex}
                className={`tabFeature__tabMenu__defaultSub ${activeTab === sub.slug ? 'tabFeature__tabMenu__activeSub' : ''}`}
                onClick={() => {
                  handleFeatureClick(sub?.subTitleName, sub?.slug);
                }}
              >
                <Text
                  size='fs-16'
                  color='neutral-600'
                >
                  {sub?.subTitleName}
                </Text>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className='tabFeature-sp'>
        <div
          className='tabFeature-sp__placeHolder'
          onClick={() => setDropDownOpen(!dropDownOpen)}
        >
          <Text
            size='fs-16'
            color='neutral-700'
          >
            {dropDownPlaceholder}
          </Text>
          <Image
            className={`${dropDownOpen ? 'tabFeature-sp__dropDown--open' : ''}`}
            src={arrowDown.src}
            width={8}
            height={5}
            alt='arrow-down'
          />
        </div>
        {dropDownOpen && (
          <div className='tabFeature-sp__featuresWrapper'>
            {featuresTabs?.map((feature, index) => (
              <div
                key={index}
                className='tabFeature-sp__menuWrapper'
              >
                <div
                  className={`tabFeature-sp__feature ${dropDownPlaceholder === feature?.title || isSubMenuActive(feature?.slug) ? 'tabFeature-sp__feature--active' : ''}`}
                  onClick={() => {
                    handleFeatureClick(feature?.title, feature?.slug);
                  }}
                >
                  <Text
                    size='fs-14'
                    color='neutral-600'
                  >
                    {feature?.title}
                  </Text>
                </div>
                {feature?.subtitle && (
                  <div className='tabFeature-sp__subtitle'>
                    {feature?.subtitle?.map((sub, innerIndex) => (
                      <div
                        key={innerIndex}
                        className={`tabFeature-sp__defaultSub ${activeTab === sub.slug ? 'tabFeature-sp__activeSub' : ''}`}
                        onClick={() => {
                          handleFeatureClick(sub?.subTitleName, sub?.slug);
                        }}
                      >
                        <Text
                          size='fs-14'
                          color='neutral-600'
                        >
                          {sub?.subTitleName}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabFeature;
