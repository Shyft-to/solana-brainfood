import React, { ReactNode, ElementType } from "react";

interface IconButtonProps {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  as?: ElementType;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  as,
  label,
  onClick,
  href,
  target,
  rel,
  className,
}) => {
  const Component = as || "button";

  return (
    <Component
      className={`flex items-center w-8 h-8 rounded-full focus:outline-none focus:ring focus:ring-brand ${className}`}
      onClick={onClick}
      href={href}
      target={target}
      rel={rel}
    >
      {children}
      <span className="sr-only">{label}</span>
    </Component>
  );
};

export default IconButton;
