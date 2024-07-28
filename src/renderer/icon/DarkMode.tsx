import React from 'react';

export default function DarkMode({ className }: { className?: string }) {
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
        d="M257.61,66.83c4.93-7.16,5.3-16.52.93-24.04-4.36-7.52-12.67-11.85-21.33-11.12C122.03,41.41,31.6,137.95,31.6,255.64c0,124.13,100.63,224.76,224.76,224.76,117.69,0,214.23-90.44,223.96-205.62.73-8.66-3.6-16.97-11.12-21.33-7.52-4.36-16.88-4-24.04.93-21.71,14.97-48.01,23.73-76.42,23.73-74.48,0-134.86-60.38-134.86-134.86,0-28.41,8.76-54.71,23.73-76.42Z"
      />
    </svg>
  );
}

DarkMode.defaultProps = {
  className: '',
};
