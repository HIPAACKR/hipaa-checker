import { useEffect, useRef, useState } from 'react';

import Icon from '../icon';

const ThreeDotDropDown = ({ text, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleItemClick = () => {
    onClick();
    setIsOpen(false);
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className='relative my-auto cursor-pointer'>
      <div onClick={toggleDropdown}>
        <Icon
          name='three-dots-vertical'
          size={16}
          color='gray'
        />
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className='absolute right-0 mt-4 w-24 bg-white border rounded shadow-lg z-10'
        >
          <ul>
            <li
              className='px-4 py-2 text-red-600 hover:bg-[#F5FAFF] cursor-pointer'
              onClick={handleItemClick}
            >
              {text}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThreeDotDropDown;
