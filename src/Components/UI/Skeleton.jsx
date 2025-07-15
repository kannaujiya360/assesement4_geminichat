import React from 'react';
import clsx from 'clsx';

function Skeleton({ width = 'w-full', height = 'h-5', className }) {
  return (
    <div
      className={clsx('animate-pulse bg-gray-300 dark:bg-gray-700 rounded', width, height, className)}
    />
  );
}

export default Skeleton;
