import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-primary to-primary-dark text-white " +
      "shadow-[0_8px_30px_rgb(0,0,0,0.12)] " +
      "hover:from-primary-dark hover:to-primary " +
      "hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",

    secondary:
      "bg-transparent text-neutral-300 border border-neutral-700 hover:bg-neutral-800 hover:text-white",

    outline:
      "bg-transparent border border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white",
  };

  const sizeStyles = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};

export default Button;
