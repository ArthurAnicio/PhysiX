import React, { ChangeEventHandler, InputHTMLAttributes} from "react";
import "./styles.css";

interface TextParams extends InputHTMLAttributes<HTMLInputElement> {
    type:string;
}
const TextBox: React.FC<TextParams> = ({ type, ...rest}) => {
  return (
    <input type={type} {...rest}/>
  );
};

export default TextBox;