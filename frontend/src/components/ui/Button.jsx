
const Button = ({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}) => {
  const getVariantClasses = (variant) => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'outline':
        return 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-800';
      case 'secondary':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'ghost':
        return 'hover:bg-gray-100 text-gray-800';
      case 'link':
        return 'text-blue-500 underline-offset-4 hover:underline bg-transparent';
      default:
        return 'bg-blue-500 text-white hover:bg-blue-600';
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'h-9 rounded-md px-3 text-sm';
      case 'lg':
        return 'h-11 rounded-md px-8 text-base';
      case 'icon':
        return 'h-10 w-10';
      default:
        return 'h-10 px-4 py-2 text-sm';
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${getVariantClasses(variant)} ${getSizeClasses(size)} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };