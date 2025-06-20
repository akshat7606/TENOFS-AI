import React from 'react';
import classNames from 'classnames';

export const Button = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'rounded-xl px-4 py-2 font-medium transition-all';
  const variants = {
    default: 'bg-purple-600 text-white hover:bg-purple-700',
    outline: 'border border-purple-600 text-purple-600 hover:bg-purple-50',
    ghost: 'text-purple-600 hover:underline'
  };

  return (
    <button
      className={classNames(baseStyles, variants[variant] || variants.default, className)}
      {...props}
    >
      {children}
    </button>
  );
};
