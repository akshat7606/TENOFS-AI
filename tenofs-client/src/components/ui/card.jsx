import React from 'react';
import classNames from 'classnames';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={classNames('bg-white bg-opacity-80 shadow-lg rounded-2xl backdrop-blur-md', className)}>{children}</div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={classNames('p-6', className)}>{children}</div>;
};