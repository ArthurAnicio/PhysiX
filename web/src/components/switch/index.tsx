import React, { InputHTMLAttributes } from "react";
import "./styles.css";

interface ButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  path: string;
}
function Switch() {
  return (
    <div className="switch">
        <div></div>
    </div>
  )
};

export default Switch;