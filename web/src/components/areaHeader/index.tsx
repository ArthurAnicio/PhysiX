import React, { InputHTMLAttributes } from "react";
import "./styles.css";
import AtomSVG from "../../assets/images/icons/atom";
import { Link, useNavigate } from "react-router-dom";
import { parse } from "path";
let mainLogo = require("../../assets/images/imgs/grandeClaroPng.png");

interface HeaderParam extends InputHTMLAttributes<HTMLInputElement> {
  state: number;
  title: string;
  asideOpen: () => void
} 

const AreaHeader: React.FC<HeaderParam> = ({ state, title, asideOpen }) => {
  console.log(state)

  const navigate = useNavigate()

  function handleNavigate(){
    let loginToInt:number = 0
    const loginType = localStorage.getItem("loginType")
    if (loginType) {
      loginToInt = parseInt(loginType)
    }
    //handleRedirect(loginToInt)
    
    switch (loginToInt) {
      case 0:
        return navigate("/")
      case 1:
        return navigate("/student_area", {state: {userId: state}})
      case 2:
        return navigate("/teacher_area", {state: {teacherId: state}})
    }
  }
  return (
    <div id="headerDefault">
      <div id="openAside" onClick={asideOpen}>
        <i className="fa-solid fa-bars" ></i>
      </div>
      <h1>{title}</h1>
      <div id="atomContainer">
        <AtomSVG id={"atomHeader"} />
      </div>
    </div>
  );
};
export default AreaHeader;
