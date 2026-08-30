
const Card = ({ className = '', children, ...props }) => (
  <div
    className={`rounded-lg border shadow-sm ${className.includes('bg-') ? className : `bg-white ${className}`}`}
    {...props}
  >
    {children}
  </div>
);

export { Card };