import React from 'react';

export default function GmailIcon({ className }: { className?: string }) {
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
        d="M256,31.53c-123.97,0-224.47,100.5-224.47,224.47s100.5,224.47,224.47,224.47,224.47-100.5,224.47-224.47S379.97,31.53,256,31.53ZM381.71,333.16c0,9.47-7.67,17.14-17.14,17.14h-40.01v-97.13l-68.56,51.43-68.56-51.43v97.14h-40.01c-9.47,0-17.14-7.67-17.14-17.14h0v-145.71c0-21.19,24.19-33.29,41.14-20.57l16.01,12.02,68.56,51.41,68.56-51.43,16.01-11.99c16.94-12.71,41.14-.62,41.14,20.57v145.7Z"
      />
    </svg>
  );
}

GmailIcon.defaultProps = {
  className: '',
};
