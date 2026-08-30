const CommonDialog = ({ isOpen, onClose, title, children, disableClose = false }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded-md shadow-lg w-1/2'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>{title}</h2>
          <button
            onClick={onClose}
            disabled={disableClose}
            className={`text-2xl ${disableClose ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default CommonDialog;
