import React, { useState, useEffect, MouseEventHandler } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginStudent.module.css";
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
        const response = await api.get('/user', {params : { name, email, password}})
        console.log(response.data);
        if(response.status === 200){
          console.log(response.data.id) 
          history('/student_area', {state:{userId: response.data.id}})
        }
        else{
            alert('Usuário não encontrado')
        }
    } 
    return (
        <div className={styles.loginBody}>
            <Header path="/" title="Login Estudante"/>
            <div id={styles.loginContainer}>
                <div id={styles.loginWindow}>
                    <header><img src={smlIcon} width="70px"/></header>
                    <section id={styles.inputsMain}>
                    <h1>Usuário</h1>
                    <TextBox type="text" value={name} onChange={(e) => {setName(e.target.value)}}/>
                    <h1>Email</h1>
                    <TextBox type="text" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                    <h1>Senha</h1>
                    <TextBox type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                    <Link to="/forgot_password" id={styles.purpleLink}>Esqueci a senha</Link>
                    <Submit className={styles.btn} label="Entrar" onClick={validateLogin}/>
                    <Link to="/sign_up_student" id={styles.purpleLink}>Criar  uma conta</Link>
                    </section>
                </div>
            </div>
            <Footer /> 
        </div>
    )
}

export default LogInStudent;