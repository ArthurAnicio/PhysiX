import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/styles.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import TextBox from "../../components/textbox";
import Submit from "../../components/submit";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")

function LogInStudent() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div>
      <Header path="/" title="Login Estudante"/>
      <div id="student-container">
        <div id="login-window">
          <header><img src={smlIcon} width="70px"/></header>
          <h1>Usuário</h1>
          <TextBox type="text" value={name} onChange={(e) => {setName(e.target.value)}}/>
          <h1>Email</h1>
          <TextBox type="text" value={email} onChange={(e) => {setName(e.target.value)}}/>
          <h1>Senha</h1>
          <TextBox type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
          <Link to="" id="student-forgotpass">Esqueci minha senha</Link>
          <Submit label="Entrar"/>
          <Submit label="Cadastrar"/>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default LogInStudent;
