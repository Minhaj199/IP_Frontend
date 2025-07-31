

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black/20">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-t-primary-500 border-r-transparent border-b-primary-500 border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-t-primary-300 border-r-transparent border-b-primary-300 border-l-transparent rounded-full animate-spin-reverse"></div>
        <div className="absolute inset-8 bg-primary-500 rounded-full shadow-inner"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
