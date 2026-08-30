'use client';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import SubscriptionContext from '@/context/subscriptionContext';
import useIsSpDevice from '@/utils/useSpDevice';

import AdminHeaderHome from '../admin-header-home';
import Button from '../button';
import NavBar from '../nav-bar';
import TopMenu from '../top-menu';

import './index.scss';

const Header = ({ menu, dropdownMenus, appConfig }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  const { userData } = useContext(SubscriptionContext);
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const isSpDevice = useIsSpDevice();

  useEffect(() => {
    if (!isSpDevice) setIsActive(false);
  }, [isSpDevice]);

  const handleGetStartedClick = () => {
    // Redirect to the sign-in page
    window.location.href = '/sign-in';
  };

  return (
    <div className={`header ${isActive ? 'header-active' : ''}`}>
      <header className='header__wrapper'>
        <div className='header__container'>
          <div className='header__logo'>
            <Image
              className='header__logo__image'
              src='/images/common/hipaachecker-logo.svg'
              quality={100}
              sizes='100%'
              onClick={() => {
                router.push('/');
                setIsActive(false);
              }}
              fill
              alt='Hipaachecker logo'
            />
          </div>
          <TopMenu />
          <div className='header__button-group'>
            {user && userData ? (
              <AdminHeaderHome />
            ) : (
              <Button
                size='large'
                type='primary'
                icon={'arrowRight'}
                animateIcon={true}
                iconPosition={'after'}
                onClick={handleGetStartedClick}
                style={{ color: '#0f172a' }}
              >
                Get started
              </Button>
            )}
          </div>
          <div
            onClick={() => setIsActive((prev) => !prev)}
            className='header__toggle-bar'
          >
            <Image
              src={`${isActive ? '/images/icons/cross-icon.svg' : '/images/icons/humbarger.svg'}`}
              fill
              alt='humbarger-icon'
            />
          </div>
        </div>
      </header>

      <div
        style={{
          height: isActive ? `calc( 100% - 70px )` : '0',
        //   backgroundColor: '#101828',
          scrollBehavior: 'smooth',
          zIndex: '100',
          position: 'absolute',
          left: 0,
          right: 0,
          overflow: 'auto',
        }}
        className={`header__menu`}
      >
        <NavBar
          menuItems={menu}
          dropdownMenus={dropdownMenus}
          appConfig={appConfig}
          setIsActive={setIsActive}
        />
      </div>
    </div>
  );
};

export default Header;
