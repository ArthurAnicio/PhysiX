import React, { InputHTMLAttributes } from "react";
import "./styles.css";
import { Link } from "react-router-dom";

interface ButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  path: string;
  icon?: any;
}
const Button: React.FC<ButtonProps> = ({ label, path, icon: Icon, ...rest }) => {
  return (
    <Link id="link" to={path}>
      <div id="icn">{Icon && <Icon />}</div><div id="lbl">{label}</div>
    </Link>
  );
};

export default Button;
