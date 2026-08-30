'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import AdminHeader from '@/components/admin-header';
import AdminSidebar from '@/components/admin-sidebar';
import SelectOptionProvider from '@/context/selectOptionContext';
import { get } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import useIsSpDevice from '@/utils/useSpDevice';

import TanstackProvider from '../../../provider/TanstackProvider';

import './layout.scss';

export default function AdminLayout({ children }) {
  const route = useRouter();
  const sidebarRef = useRef(null);
  const isSpDevice = useIsSpDevice();
  const [showSidebar, setShowSidebar] = useState(!isSpDevice);
  const param = usePathname().split('/').pop();

  const fetchUserData = async () => {
    try {
      const response = await get(API_ENDPOINTS.USER, true);
    } catch (error) {}
  };
  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowSidebar(!isSpDevice);
  }, [isSpDevice]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    }
    if (window.innerWidth < 1366) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  return (
    <SelectOptionProvider>
      <div className='custom_container'>
        <div className={`container__sidebar ${!showSidebar ? 'container__sidebarClose' : ''}`}>
          <div
            ref={sidebarRef}
            className='container__sidebar--overlay'
          ></div>
          {showSidebar && (
            <AdminSidebar
              setSidebarClose={() => {
                setShowSidebar(false);
              }}
            />
          )}
        </div>
        <main className={`main ${showSidebar ? 'main--sidebarOpen' : ''}`}>
          <AdminHeader toggleSidebar={toggleSidebar} />
          <div
            className={`content ${param !== 'specific-report-details' && param !== 'code-view' && param !== 'specific-rule-sp' ? 'content--padding-height' : ''}`}
          >
            <TanstackProvider>{children}</TanstackProvider>
          </div>
        </main>
        {/*<Content showSidebar={showSidebar} >{children}</Content>*/}
      </div>
    </SelectOptionProvider>
  );
}
