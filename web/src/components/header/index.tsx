import React, { InputHTMLAttributes } from "react";
import "./styles.css";
import AtomSVG from "../../assets/images/icons/atom";
import { Link } from "react-router-dom";
let mainLogo = require("../../assets/images/imgs/grandeClaroPng.png");

interface HeaderParam extends InputHTMLAttributes<HTMLInputElement> {
    path: string;
    title: string;
}

const Header: React.FC<HeaderParam> = ({path, title}) => { 
    return(
        <div id="headerDefault">
            <Link to={path}><img src={mainLogo} id="headerLogo"/></Link>
            <h1>{title}</h1>
            <AtomSVG id={"atomHeader"}/>
        </div>
    )
}
export default Header;