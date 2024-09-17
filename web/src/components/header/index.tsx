import React, { InputHTMLAttributes } from "react";
import "./styles.css";
import AtomSVG from "../../assets/images/icons/atom";
import { Link, useNavigate } from "react-router-dom";
import { parse } from "path";
let mainLogo = require("../../assets/images/imgs/grandeClaroPng.png");

interface HeaderParam extends InputHTMLAttributes<HTMLInputElement> {
  state: number;
  title: string;
} 

const Header: React.FC<HeaderParam> = ({ state, title }) => {

  let path = "/"


function handleRedirect(loginType: number) {
  switch (loginType){
    case 0:
    path = "/";
    break
    case 1:
    path = "/student_area";
    break
    case 2:
    path = "/teacher_area"
    break

  }
}

  const navigate = useNavigate()

  function handleNavigate(){
    let loginToInt:number = 0
    const loginType = localStorage.getItem("loginType")
    if (loginType) {
      loginToInt = parseInt(loginType)
    }
    handleRedirect(loginToInt)

    navigate(path, {state: {state}})
  }
  return (
    <div id="headerDefault">
      <div id="headerLogo">

        <img src={mainLogo} onClick={handleNavigate}/> 

      </div>
      <h1>{title}</h1>
      <div id="atomContainer">
        <AtomSVG id={"atomHeader"} />
      </div>
    </div>
  );
};
export default Header;
