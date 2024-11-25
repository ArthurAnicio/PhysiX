import React, { ChangeEventHandler, InputHTMLAttributes } from "react";
import styles from "./TextBox.module.css";

interface TextParams extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
}
const TextBox: React.FC<TextParams> = ({ type, ...rest }) => {
  return <input type={type} id={styles.textBox} {...rest} />;
};

export default TextBox;
