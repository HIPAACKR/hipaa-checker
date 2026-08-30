import './index.scss';

const Heading = ({
  title,
  children,
  isNewLine,
  align = 'left',
  type = 'h1',
  color = 'dark',
  weight = 'bold',
  className = '',
  lineHeight = ''
}) => {
  let CustomTag = `${type == 'hero' ? 'h1' : type}`;
  return (
    <CustomTag
      className={`heading ${className}`}
      data-weight={weight}
      data-align={align}
      data-color={color}
      data-type={type}
      data-newline={isNewLine}
      style={{ lineHeight: lineHeight ? lineHeight + 'px' : 'inherit' }}
    >
      {children || title}
    </CustomTag>
  );
};

export default Heading;
