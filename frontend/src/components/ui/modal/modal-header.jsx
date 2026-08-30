'use client';

import Image from 'next/image';

import crossIcon from '@/../public/images/icons/cross-icon.svg';

export const ModalHeader = ({
  icon,
  title,
  subtitle,
  onClose,
  iconBgColor = '',
  iconColor = 'text-blue-500',
  headerClassWrapper = 'p-6 pb-4 border-b bg-[#FBFBFB]',
  closeIcon,
  closeIconClassWrapper = 'bg-white p-4 rounded-[30px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)]',
}) => {
  return (
    <div className={`flex items-start justify-between ${headerClassWrapper}`}>
      <div className='flex items-start gap-3 flex-1'>
        {icon && (
          <div className={`${iconBgColor} p-2 border rounded-lg`}>
            <div className={iconColor}>{icon}</div>
          </div>
        )}
        <div className='flex-1'>
          <h2 className='text-lg font-semibold'>{title}</h2>
          {subtitle && <p className='text-sm text-gray-600'>{subtitle}</p>}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={closeIconClassWrapper}
          aria-label='Close modal'
        >
          {closeIcon ? (
            closeIcon
          ) : (
            <Image
              src={crossIcon}
              alt='Close'
              width={12}
              height={12}
              style={{
                filter:
                  'invert(37%) sepia(93%) saturate(2303%) hue-rotate(188deg) brightness(99%) contrast(101%)',
              }}
              className='[&>svg]:stroke-[2px]'
            />
          )}
        </button>
      )}
    </div>
  );
};