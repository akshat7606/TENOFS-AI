import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-tr from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 transition-all shadow-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
