import { ButtonHTMLAttributes } from 'react';

import './button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isOutlined?: boolean;
}

export function Button({ isOutlined = false, children, ...rest }: ButtonProps) {
  return (
    <button className={`button ${isOutlined && 'outlined'}`} {...rest}>
      {children}
    </button>
  );
}
