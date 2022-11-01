import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, error, ...rest } = props;

  return (
    <>
      {label ? <label>{label}</label> : null}
      <input ref={ref} {...rest} className={error ? 'has-error' : ''} />
      {error ? <span>{error}</span> : null}
    </>
  );
});

export { Input };
