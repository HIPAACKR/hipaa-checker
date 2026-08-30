import './index.scss';

const Tooltip = ({ children, TooltipText, type = 'p' }) => {
  let CustomTag = `${type}`;
  return (
    <CustomTag
      className={`tooltip`}
      data-title={TooltipText}
    >
      {children}
    </CustomTag>
  );
};

export default Tooltip;
