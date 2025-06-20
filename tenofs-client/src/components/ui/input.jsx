import React from 'react';
import classNames from 'classnames';

export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={classNames(
        'w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white bg-opacity-90',
        className
      )}
      {...props}
    />
  );
};