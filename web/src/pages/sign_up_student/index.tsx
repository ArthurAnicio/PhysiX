import React, { useState, useEffect, MouseEventHandler } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUpStu.module.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import TextBox from "../../components/textbox";
import Submit from "../../components/submit";
import api from "../../services/api";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")

function SignUpStudent() {
  const history = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  
  function signUp() {
    api.post('/user',{
      name,
      email,
      password,
    }).then(() => {
      alert('Cadastro realizado com sucesso!');
      history('/log_in_student')
    }).catch((err) => {
      alert('Erro no cadastro!');
      console.log(err);
    })
  } 
  
  return ( 
    <div className={styles.signUpBody}>
      <Header path="/" title="Cadastro Estudante"/>
      <div id={styles.signUpContainer}>
        <div id={styles.signUpWindow}>
          <header><img src={smlIcon} width="70px"/></header>
          <section id={styles.inputsMain}>
          <h1>Usuário</h1>
          <TextBox type="text" value={name} onChange={(e) => {setName(e.target.value)}}/>
          <h1>Email</h1>
          <TextBox type="text" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
          <h1>Senha</h1>
          <TextBox type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
          <Submit className={styles.btn} label="Cadastrar" onClick={signUp}/>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default SignUpStudent;
