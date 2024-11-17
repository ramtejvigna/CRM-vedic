import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading data...</h3>
    </div>
  );
};

export default LoadingState;
