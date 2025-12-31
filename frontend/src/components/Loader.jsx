import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-24 h-24">
        {/* Outer half ring */}
        <span className="absolute inset-0 rounded-full border-5 border-indigo-500 border-t-transparent border-l-transparent animate-spin"></span>

        {/* Middle half ring */}
        <span className="absolute inset-2 rounded-full border-5 border-purple-500 border-b-transparent border-r-transparent animate-spin-slow"></span>

        {/* Inner half ring */}
        <span className="absolute inset-4 rounded-full border-5 border-blue-500 border-t-transparent border-r-transparent animate-spin"></span>
      </div>

      {/* Custom animation */}
      <style>
        {`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 1.5s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
