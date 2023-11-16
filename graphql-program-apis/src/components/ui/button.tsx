import React from "react";

interface RoundedButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button: React.FC<RoundedButtonProps> = ({
  children,
  onClick,
  className,
  type,
  disabled,
}) => {
  return (
    <button
      className={`rounded-full text-sm font-medium px-4 disabled:cursor-not-allowed py-2 bg-brand text-white hover:enabled:bg-brand/80 focus:outline-none ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
