import React, { useId, ForwardedRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const Input = React.forwardRef(function Input(
  {
    label,
    type = 'text',
    className = '',
    ...props
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const id = useId();
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`form-control ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;
