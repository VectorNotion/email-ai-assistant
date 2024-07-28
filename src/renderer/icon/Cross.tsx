import React from 'react';

type CrossProps = {
  className?: string;
};

export default function Cross({ className }: CrossProps) {
  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="100%"
      height="100%"
      className={className}
    >
      <path
        fill="currentColor"
        d="M256,31.1c-124.2,0-224.9,100.7-224.9,224.9s100.7,224.9,224.9,224.9,224.9-100.7,224.9-224.9S380.2,31.1,256,31.1ZM357.2,313.8c8,8,8,20.9,0,28.9l-14.5,14.5c-8,8-20.9,8-28.9,0l-57.8-57.8-57.8,57.8c-8,8-20.9,8-28.9,0l-14.5-14.5c-8-8-8-20.9,0-28.9l57.8-57.8-57.8-57.8c-8-8-8-20.9,0-28.9l14.5-14.5c8-8,20.9-8,28.9,0l57.8,57.8,57.8-57.8c8-8,20.9-8,28.9,0l14.5,14.5c8,8,8,20.9,0,28.9l-57.8,57.8,57.8,57.8Z"
      />
    </svg>
  );
}

Cross.defaultProps = {
  className: '',
};
