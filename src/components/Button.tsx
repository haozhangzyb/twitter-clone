import type { FC, ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import clx from "classnames";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  small?: boolean;
  gray?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: FC<ButtonProps> = ({
  small = false,
  gray = false,
  className = "",
  children,
  ...props
}) => {
  const sizeClasses = small ? "px-2 py-1" : "px-4 py-2 font-bold";
  const colorClasses = gray
    ? "bg-gray-400 hover:bg-gray-300 focus-visible:bg-gray-300"
    : "bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400";

  return (
    <button
      className={clx(
        className,
        "rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses,
        colorClasses
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
