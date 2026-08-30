
const Badge = ({ className = '', variant = 'default', children, ...props }) => {
  const getVariantClasses = (variant) => {
    switch (variant) {
      case 'secondary':
        return 'border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'destructive':
        return 'border-transparent bg-red-500 text-white hover:bg-red-600';
      case 'outline':
        return 'text-gray-800 border-gray-300';
      case 'custom':
        return '';  
      default:
        return 'border-transparent bg-blue-500 text-white hover:bg-blue-600';
    }
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${getVariantClasses(variant)} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };