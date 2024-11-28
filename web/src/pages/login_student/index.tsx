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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [stateId, setStateId] = useState(0)

    async function validateLogin() {
        if(username && password) {
        try {
        const response = await api.get('/user', {params : { username, password}})
        if(response.status === 200){
            if (response.data.verified == 1) {
                localStorage.setItem("loginType", "1");
                setStateId(response.data.id)
                history('/student_area', {state:{userId: response.data.id}})
            } else {
                history('/unverified_student', {state:{email: response.data.email}})
            }
        }
        else{
            alert('Usuário não encontrado')
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Login e/ou senha incorretos!')
    }
    } else {
        alert('Preencha todo os campos!')
    }
    } 
    return (
        <div className={styles.loginBody}>
            <Header state={stateId} title="Login Estudante"/>
            <div id={styles.loginContainer}>
                <div id={styles.loginWindow}>
                    <header><img src={smlIcon} width="70px"/></header>
                    <section id={styles.inputsMain}>
                    <h1>Usuário</h1>
                    <TextBox type="text" value={username} onChange={(e) => {setUsername(e.target.value)}} placeholder="Digite seu nome de usuário ou email"/>
                    <h1>Senha</h1>
                    <TextBox type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Digite sua senha"/>
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