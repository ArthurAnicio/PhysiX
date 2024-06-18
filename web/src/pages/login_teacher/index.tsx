import React, { useState, useEffect, MouseEventHandler } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import TextBox from "../../components/textbox";
import Submit from "../../components/submit";
import api from "../../services/api";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")

function LogInTeacher() {
    const history = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')

    async function validateLogin() {
        const response = await api.get('/teacher-login', {params : { name, email, password}})
        console.log(response.data);
        if(response.status === 200){
          console.log(response.data.id)  
          history('/teacher_area', {state:{teacherId: response.data.id}})
        }
        else{
            alert('Professor não encontrado')
        }
    }
    return (
        <div>
            <Header path="/" title="Login Professor"/>
            <div id="teacher-container">
                <div id="login-window">
                    <header><img src={smlIcon} width="70px"/></header>
                    <h1>Usuário</h1>
                    <TextBox type="text" value={name} onChange={(e) => {setName(e.target.value)}}/>
                    <h1>Email</h1>
                    <TextBox type="text" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                    <h1>Senha</h1>
                    <TextBox type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                    <Link to="/sign_up_teacher" id="create-teacher">Crie uma conta</Link>
                    <Submit className="btn" label="Entrar" onClick={validateLogin}/>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default LogInTeacher;