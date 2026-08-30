'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import Icon from '@/components/icon';
import useIsSpDevice from '@/utils/useSpDevice';

import './index.scss';

const MenuItem = ({ icon, title, link, subMenu, activePath, setSidebarClose }) => {
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const isSpDevice = useIsSpDevice();
  const toggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu);
  };

  const handleClick = () => {
    if (!subMenu) {
      setOpenSubMenu(false);
    }
  };

  const isActive = useCallback(
    (menuItemLink) => {
      return activePath === menuItemLink;
    },
    [activePath],
  );

  const anySubmenuItemActive = useCallback(() => {
    return subMenu && subMenu.some((item) => isActive(item.link));
  }, [subMenu, isActive]);

  const handleSidebar = () => {
    if (isSpDevice) setSidebarClose();
  };

  useEffect(() => {
    if (anySubmenuItemActive()) {
      setOpenSubMenu(true);
    }
  }, [activePath, anySubmenuItemActive]);

  return (
    <div
      onClick={handleClick}
      className={`menuItem ${isActive(link) || anySubmenuItemActive() ? 'active' : ''} ${openSubMenu ? 'open' : ''}`}
    >
      {!subMenu ? (
        <Link
          href={link}
          onClick={handleSidebar}
          className='menuItem__title'
        >
          {icon && (
            <Icon
              name={icon}
              color={'light-gray'}
              size={24}
            />
          )}
          {title}
        </Link>
      ) : (
        <div
          onClick={toggleSubMenu}
          className='menuItemSubNav'
        >
          <span className='menuItem__title'>
            {icon && (
              <Icon
                name={icon}
                color={'light-gray'}
                size={24}
              />
            )}
            {title}
          </span>
          {subMenu && (
            <Icon
              name='chevron-down'
              color='gray'
              size='20'
            />
          )}
        </div>
      )}

      {subMenu && openSubMenu && (
        <ul className='menuItem__subNav'>
          {subMenu.map((item, index) => (
            <li
              onClick={handleSidebar}
              key={index}
              className={`menuItem__subNavItem ${isActive(item.link) ? 'active' : ''}`}
            >
              <Link href={item.link}>{item.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuItem;
