import React, { InputHTMLAttributes } from "react";
import "./styles.css";
import AtomSVG from "../../assets/images/icons/atom";
import { Link } from "react-router-dom";
let mainLogo = require("../../assets/images/imgs/grandeClaroPng.png");

interface HeaderParam extends InputHTMLAttributes<HTMLInputElement> {
  path: string;
  title: string;
} 

const Header: React.FC<HeaderParam> = ({ path, title }) => {
  return (
    <div id="headerDefault">
      <div id="headerLogo">
      <Link to={path}>
        <img src={mainLogo}/>
      </Link>
      </div>
      <h1>{title}</h1>
      <div id="atomContainer">
        <AtomSVG id={"atomHeader"} />
      </div>
    </div>
  );
};
export default Header;
