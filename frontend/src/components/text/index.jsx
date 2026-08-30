import './index.scss';

const Text = ({
  children,
  align = 'left',
  color = 'dark',
  weight = 'regular',
  size = 'fs-16',
  htmlFor,
  type = 'p',
  className,
}) => {
  let CustomTag = `${type}`;
  return (
    <CustomTag
      className={`text ${className || ''}`}
      data-align={align}
      data-color={color}
      data-weight={weight}
      data-size={size}
      htmlFor={htmlFor}
    >
      {children}
    </CustomTag>
  );
};

export default Text;
