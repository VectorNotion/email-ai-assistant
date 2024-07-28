import React from 'react';

export default function Tick({ className }: { className?: string }) {
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
        d="M32.26,256c0-123.57,100.17-223.74,223.74-223.74s223.74,100.17,223.74,223.74-100.17,223.74-223.74,223.74S32.26,379.57,32.26,256ZM386.5,209.3c7.93-7.96,7.9-20.84-.06-28.76l-14.41-14.35c-7.96-7.93-20.84-7.9-28.76.06l-117.39,117.9-67.55-66.61c-8-7.89-20.88-7.8-28.76.2l-14.28,14.48c-7.89,8-7.8,20.88.2,28.76l96.38,95.03c7.97,7.86,20.79,7.8,28.69-.13l145.96-146.59Z"
      />
    </svg>
  );
}

Tick.defaultProps = {
  className: '',
};
