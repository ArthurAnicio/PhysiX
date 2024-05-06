import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/styles.css";
import Button from "../../components/button";
import Switch from "../../components/switch";
import Footer from "../../components/footer";
import AtomSVG from "../../assets/images/icons/atom";
import giveClasses from "../../assets/images/icons/giveClasses";
import study from "../../assets/images/icons/study";

let mainLogo = require("../../assets/images/imgs/grandeClaroPng.png");

function Landing() {
  return (
    <div id="container">
      <header>
        <AtomSVG id={"atom1"} />
        <AtomSVG id={"atom2"} />
        <Switch />
        <div id="header-container">
          <img src={mainLogo} alt="Logo PhysiX" />
          <h2>Divirta-se estudando física!</h2>
          <h1>Entrar</h1>
        </div>
      </header>
      <main>
        <Button label="Sou um estudante" path="/log_in_student" icon={study}/>
        <Button label="Sou um professor" path="/log_in_teacher" icon={giveClasses}/>
      </main>
      <Footer />
    </div>
  );
}
export default Landing;
