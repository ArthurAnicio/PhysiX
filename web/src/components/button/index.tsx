import React, { InputHTMLAttributes } from "react";
import "./styles.css";
import { Link } from "react-router-dom";

interface ButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  path: string;
  icon?: any;
}
const Button: React.FC<ButtonProps> = ({ label, path, icon, ...rest }) => {
  return (
    <Link id="link" to={path}>
      {icon} {label}
    </Link>
  );
};

export default Button;
