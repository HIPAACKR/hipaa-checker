import './index.scss';

const Icon = ({ name, color, size }) => (
  <span className={`icon icon--${name} icon--${color} icon--${size}`} />
);

export default Icon;
