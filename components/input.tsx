import { ForwardedRef, forwardRef, InputHTMLAttributes } from "react";

interface InputProps {
  errors?: string[];
  name: string;
}

const _Input = (
  {
    errors = [],
    name,
    ...rest
  }: InputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <div className="flex flex-col gap-2 ">
      <input
        ref={ref}
        name={name}
        className="bg-orange-200 placeholder:text-neutral-500 text-neutral-800  focus:bg-orange-300  pl-5 rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-orange-500 focus:ring-3 ring-neutral-200 transition   "
        {...rest}
      />
      {errors.map((error, index) => (
        <span
          key={index}
          className="text-red-500  font-semibold rounded-sm bg-orange-50 ring-2 ring-red-500 px-3 mr-auto "
        >
          ⚠ {error}
        </span>
      ))}
    </div>
  );
};

export default forwardRef(_Input);
