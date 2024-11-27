import React, { InputHTMLAttributes } from "react";
import styles from "./AreaHeader.module.css";
import AtomSVG from "../../assets/images/icons/atom";
import { Link, useNavigate } from "react-router-dom";
import { parse } from "path";
let mainLogo = require("../../assets/images/imgs/grandeClaroPng.png");

interface HeaderParam extends InputHTMLAttributes<HTMLInputElement> {
  state: number;
  title: string;
  asideOpen: () => void;
}

const AreaHeader: React.FC<HeaderParam> = ({ state, title, asideOpen }) => {

  const navigate = useNavigate();

  function handleNavigate() {
    let loginToInt: number = 0;
    const loginType = localStorage.getItem("loginType");
    if (loginType) {
      loginToInt = parseInt(loginType);
    }
    //handleRedirect(loginToInt)

    switch (loginToInt) {
      case 0:
        return navigate("/");
      case 1:
        return navigate("/student_area", { state: { userId: state } });
      case 2:
        return navigate("/teacher_area", { state: { teacherId: state } });
    }
  }
  return (
    <div id={styles.headerDefault}>
      <div id={styles.openAside} onClick={asideOpen}>
        <i className="fa-solid fa-bars" id={styles.bars}></i>
      </div>
      <div className={styles.titleHeader}>
        <h1>{title}</h1>
      </div>
      <div id={styles.atomContainer}>
        <AtomSVG id={styles.atomHeader} />
      </div>
    </div>
  );
};
export default AreaHeader;
