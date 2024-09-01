import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginTeacher.module.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import TextBox from "../../components/textbox";
import Submit from "../../components/submit";
import api from "../../services/api";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png");

function LogInTeacher() {
    const history = useNavigate();
    const [name, setName] = useState(''); 
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    async function validateLogin() {
        try {
            const response = await api.get('/teacher-login', { params: { name, email, password } });
            if (response.status === 200) {
                history('/teacher_area', { state: {teacherId: response.data.id}});
            } else {
                alert('Professor não encontrado');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    }

    return (
        <div className={styles.loginBody}>
            <Header path="/" title="Login Professor"/>
            <div id={styles.loginContainer}>
                <div id={styles.loginWindow}>
                    <header><img src={smlIcon} width="70px"/></header>
                    <section id={styles.inputsMain}>
                    <h1>Usuário</h1>
                    <TextBox type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
                    <h1>Email</h1>
                    <TextBox type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    <h1>Senha</h1>
                    <TextBox type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />       
                    <Link to="/forgot_password" id={styles.purpleLink}>Esqueci a senha</Link>
                    <Submit className={styles.btn} label="Entrar" onClick={validateLogin} />
                    <Link to="/sign_up_teacher" id={styles.purpleLink}>Crie uma conta</Link>
                    </section>
                </div> 
            </div>
            <Footer />
        </div>
    );
}

export default LogInTeacher;
