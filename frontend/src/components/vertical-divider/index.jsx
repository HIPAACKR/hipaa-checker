import './index.scss';

const VerticalDivider = ({ className = '', style = {} }) => (
  <div
    className={`vertical_divider ${className}`}
    style={style}
    aria-hidden="true"
  />
);

export default VerticalDivider;