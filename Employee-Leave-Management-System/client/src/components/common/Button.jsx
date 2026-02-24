import React from "react";

const Button = ({ children, type = "button", variant = "primary", className = "", ...props }) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-slate-800 to-zinc-900 text-white hover:from-slate-700 hover:to-zinc-800 focus:ring-slate-500 shadow-md shadow-zinc-300/50",
    secondary: "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 focus:ring-zinc-400",
    outline: "border-2 border-zinc-300 text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button type={type} className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
