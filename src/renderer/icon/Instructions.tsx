import React from 'react';

export default function Instructions({ className }: { className?: string }) {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="100%"
      height="100%"
      className={className}
    >
      <path
        className="cls-1"
        fill="currentColor"
        d="M212.62,475.56c7.31,7.99,20.98,3.62,20.98-7.21V77.13c-22.39-22.39-46.75-31.99-72.03-37.57-44.8-9.88-84.68-7.74-109.08-4.56-27.03,3.52-42.83,27.56-42.83,51.21v294.72c0,31.87,26.61,57,57.51,55.98,25.57-.84,61.07.06,93.22,7.83,24.52,5.92,40.11,17.58,52.22,30.81Z"
      />
      <path
        className="cls-1"
        fill="currentColor"
        d="M299.38,475.56c-7.31,7.99-20.98,3.62-20.98-7.21V77.13c22.39-22.39,46.74-31.99,72.03-37.57,44.8-9.88,84.68-7.74,109.08-4.56,27.04,3.52,42.83,27.56,42.83,51.21v294.72c0,31.87-26.61,57-57.51,55.98-25.57-.84-61.07.06-93.22,7.83-24.52,5.92-40.12,17.58-52.22,30.81Z"
      />
    </svg>
  );
}

Instructions.defaultProps = {
  className: '',
};
