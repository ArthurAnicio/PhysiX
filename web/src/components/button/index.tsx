import React, { InputHTMLAttributes } from "react";
import "./styles.css";
import { Link } from "react-router-dom";

interface ButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  path: string;
}
const Button: React.FC<ButtonProps> = ({ label, path, ...rest }) => {
  return (
    <Link id="link" to={path}>
      {label}
    </Link>
  );
};

export default Button;
