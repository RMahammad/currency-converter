const LoadingDialog = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-6 bg-white rounded-md shadow-lg flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
        <p className="text-gray-700 font-semibold text-center">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingDialog;
