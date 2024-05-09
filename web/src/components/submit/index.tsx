import React, { MouseEventHandler, InputHTMLAttributes, ButtonHTMLAttributes} from "react";
import "./styles.css";

interface ButtonParams extends ButtonHTMLAttributes<HTMLButtonElement> {
    label:string;

}
const Submit: React.FC<ButtonParams> = ({ label,...rest}) => {
  return (
    <button {...rest}>{label}</button>
  );
};

export default Submit;
