import React from 'react';

const FullScreenLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
        <p className="mt-4 text-white text-lg font-medium">Processing...</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
