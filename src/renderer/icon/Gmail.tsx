import React from 'react';

export default function Gmail({ className }: { className?: string }) {
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
        d="M504.99,408.83c0,18.76-15.19,33.95-33.95,33.95h-79.24v-192.39l-135.8,101.88-135.8-101.88v192.41H40.96c-18.75,0-33.95-15.2-33.95-33.95V120.23c0-41.98,47.91-65.94,81.48-40.75l31.7,23.8,135.8,101.84,135.8-101.88,31.7-23.76c33.55-25.17,81.48-1.22,81.48,40.75v288.6Z"
      />
    </svg>
  );
}

Gmail.defaultProps = {
  className: '',
};
