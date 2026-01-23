import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({ name, label, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <input name={name} {...props} />
    </div>
  );
};

export default Input;
