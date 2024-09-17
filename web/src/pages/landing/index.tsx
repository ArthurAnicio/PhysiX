import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Landing.module.css";
import Button from "../../components/button";
import Switch from "../../components/switch";
import Footer from "../../components/footer";
import AtomSVG from "../../assets/images/icons/atom";
import giveClasses from "../../assets/images/icons/giveClasses";
import study from "../../assets/images/icons/study";

let mainLogo = require("../../assets/images/imgs/grandeClaroPng.png");

function Landing() {

  localStorage.setItem("loginType", "0");

  return (
    <div id={styles.container}>
      <header id={styles.landingHeader}>
        <AtomSVG id={styles.atom1} />
        <AtomSVG id={styles.atom2} />
        <Switch />
        <div id={styles.headerContainer}>
          <img src={mainLogo} alt="Logo PhysiX" />
          <h2>Divirta-se estudando física!</h2>
          <h1>Entrar</h1>
        </div>
      </header>
      <main id={styles.landingMain}>
        <Button label="Sou um estudante" path="/log_in_student" icon={study}/>
        <Button label="Sou um professor" path="/log_in_teacher" icon={giveClasses}/>
      </main>
      <Footer />
    </div>
  );
}
export default Landing;
