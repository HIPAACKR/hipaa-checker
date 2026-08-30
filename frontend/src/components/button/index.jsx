import Link from 'next/link';

import './index.scss';

const Button = ({
  children,
  size = 'large',
  type = 'primary',
  onClick,
  href,
  target,
  isFullWidth,
  isDisabled,
  icon,
  iconPosition,
  animateIcon = false,
  className = '',
  radius = 'rounded',
}) => {
  if (type == 'link') {
    return (
      <Link
        className='button'
        href={href}
        target={target}
        data-size={size}
        data-type={type}
        data-radius={radius}
      >
        <Content
          icon={icon}
          iconPosition={iconPosition}
          animateIcon={animateIcon}
        >
          {children}
        </Content>
      </Link>
    );
  } else {
    return (
      <button
        className={`button ${isFullWidth ? 'button--isFullWidth' : ''} ${className}`}
        onClick={onClick}
        disabled={isDisabled}
        data-size={size}
        data-type={type}
        data-radius={radius}
      >
        <Content
          icon={icon}
          iconPosition={iconPosition}
          animateIcon={animateIcon}
        >
          {children}
        </Content>
      </button>
    );
  }
};

const Content = ({ icon, iconPosition, children, animateIcon }) => {
  return (
    <div className='button__content'>
      {icon && iconPosition === 'before' && (
        <div className='button__content__icon'>
          <div className={`button--${icon} button--icon-color`}></div>
        </div>
      )}
      {children}
      {icon && iconPosition === 'after' && (
        <div className='button__content__icon'>
          <div
            className={`button--${icon} button--icon-color ${animateIcon ? `button--${icon}--animated` : ''}  `}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Button;
