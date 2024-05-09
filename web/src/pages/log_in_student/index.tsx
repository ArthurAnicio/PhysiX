import React, { useState, useEffect, MouseEventHandler } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/styles.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import TextBox from "../../components/textbox";
import Submit from "../../components/submit";
import api from "../../services/api";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")

function LogInStudent() {
  const history = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  
  async function validateLogin() {
    const validateLogin = await api.get('/user', {params : { name, email, password}}).catch((error) => {alert('Falha no login')})
    if(validateLogin){
      history('/teacher_list')
    }
  }
  
  function signUp() {
    api.post('/user',{
      name,
      email,
      password,
    }).then(() => {
      alert('Cadastro realizado com sucesso!');

    }).catch((err) => {
      alert('Erro no cadastro!');
      console.log(err);
    })
  }
  
  return (
    <div>
      <Header path="/" title="Login Estudante"/>
      <div id="student-container">
        <div id="login-window">
          <header><img src={smlIcon} width="70px"/></header>
          <h1>Usuário</h1>
          <TextBox type="text" value={name} onChange={(e) => {setName(e.target.value);console.log("a")}}/>
          <h1>Email</h1>
          <TextBox type="text" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
          <h1>Senha</h1>
          <TextBox type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
          <Link to="" id="student-forgotpass">Esqueci minha senha</Link>
          <Submit label="Entrar" onClick={validateLogin}/>
          <Submit label="Cadastrar" onClick={signUp}/>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default LogInStudent;
