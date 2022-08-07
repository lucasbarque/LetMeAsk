import { ButtonHTMLAttributes } from 'react';

import './button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button(props: ButtonProps) {
  return (
    <button className='button' {...props}>
      {props.children}
    </button>
  );
}
