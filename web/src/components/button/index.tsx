import React, { InputHTMLAttributes } from "react";
import './styles.css'
import { Link } from "react-router-dom";

interface ButtonProps extends InputHTMLAttributes<HTMLInputElement>{
    label: string;
    path: string;
}
const Button: React.FC<ButtonProps>=({label, path, ...rest}) => {
    return(
        <Link id="link" to={path}>
            {label}
            <div className="arrow-wrapper">
                <div className="arrow"></div>

             </div>
        </Link>    
    )
}

export default Button;