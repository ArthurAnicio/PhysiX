import React, { InputHTMLAttributes } from "react";
import styles from "./Header.module.css";
import AtomSVG from "../../assets/images/icons/atom";
import { Link, useNavigate } from "react-router-dom";
import { parse } from "path";
let mainLogo = require("../../assets/images/imgs/grandeClaroPng.png");

interface HeaderParam extends InputHTMLAttributes<HTMLInputElement> {
  state: number;
  title: string;
} 

const Header: React.FC<HeaderParam> = ({ state, title }) => {
  console.log(state)
  let path = "/"
  let stateType = ""

function handleRedirect(loginType: number) {
  switch (loginType){
    case 0:
    path = "/";
    break
    case 1:
    path = "/student_area";
    stateType = "userId"
    break
    case 2:
    path = "/teacher_area"
    stateType = "teacherId"
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
    <div id={styles.headerDefault}>
      <div id={styles.headerLogo}>
        <img src={mainLogo} onClick={handleNavigate}/>
      </div>
      <div id={styles.titleSection}>
      <h1>{title}</h1>
      </div>
      <div id={styles.atomContainer}>
        <AtomSVG id={styles.atomHeader} />
      </div>
    </div>
  );
};
export default Header;
