import React, { MouseEventHandler, InputHTMLAttributes} from "react";
import "./styles.css";

interface ButtonParams extends InputHTMLAttributes<HTMLInputElement> {
    label:string;
}
const Submit: React.FC<ButtonParams> = ({ label, ...rest}) => {
  return (
    <button>{label}</button>
  );
};

export default Submit;
