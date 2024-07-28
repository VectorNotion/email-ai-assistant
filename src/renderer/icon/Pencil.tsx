import React from 'react';

export default function Pencil({ className }: { className?: string }) {
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
        d="M370.16,36.83c9.75-4.04,20.2-6.12,30.76-6.12s21.01,2.08,30.76,6.12c9.75,4.04,18.61,9.96,26.07,17.42,7.46,7.46,13.38,16.32,17.42,26.08,4.04,9.75,6.12,20.2,6.12,30.76s-2.08,21.01-6.12,30.76c-4.04,9.75-9.96,18.61-17.42,26.07l-11.67,11.67-113.66-113.67,11.67-11.67c7.46-7.46,16.32-13.38,26.07-17.42Z"
      />
      <path
        className="cls-1"
        fill="currentColor"
        d="M300.55,97.79l-232.56,232.56c-2.77,2.77-4.77,6.22-5.8,10l-30.68,112.48c-2.13,7.8.09,16.14,5.8,21.86,5.72,5.72,14.06,7.93,21.86,5.81l112.48-30.68c3.78-1.03,7.23-3.03,10-5.81l232.56-232.56-113.66-113.67Z"
      />
    </svg>
  );
}

Pencil.defaultProps = {
  className: '',
};
