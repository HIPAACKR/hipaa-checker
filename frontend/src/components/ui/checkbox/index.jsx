'use client';

import './index.scss';

export const Index = ({
  id,
  name,
  value,
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
  ...props
}) => {
  return (
    <div className={`checkbox-wrapper ${className}`}>
      <input
        type='checkbox'
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className='checkbox'
        {...props}
      />
      {label && (
        <label htmlFor={id} className='checkbox-label'>
          {label}
        </label>
      )}
    </div>
  );
};

