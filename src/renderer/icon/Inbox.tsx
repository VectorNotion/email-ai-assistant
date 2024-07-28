import React from 'react';

export default function Inbox({ className }: { className?: string }) {
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
        d="M500.34,367.06c0,49.07-39.78,88.85-88.85,88.85H100.51c-49.07,0-88.85-39.78-88.85-88.85v-99.55c0-7.55,1.92-14.98,5.59-21.58L110.03,78.94c7.84-14.1,22.7-22.85,38.83-22.85h214.27c16.13,0,31,8.75,38.83,22.85l92.78,167c3.67,6.6,5.59,14.02,5.59,21.58v99.55ZM424.47,233.79h-79.62c-7.43,0-14.36,3.71-18.48,9.89l-37.83,56.75h-65.07l-37.83-56.75c-4.12-6.18-11.06-9.89-18.48-9.89h-79.62l67.87-122.17h201.2l67.87,122.17Z"
      />
    </svg>
  );
}

Inbox.defaultProps = {
  className: '',
};
