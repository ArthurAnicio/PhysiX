import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignUpTeach.module.css';
import api from '../../services/api';
import Button from '../../components/button';
import Header from '../../components/header';
import TextBox from '../../components/textbox';
import Submit from '../../components/submit';
import Select from '../../components/select';
import Input from '../../components/input';
import Footer from '../../components/footer';

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")
function SignUpTeacher(){
    const history = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');
    const [stateId, setStateId] = useState(0)

    function signUp() {
        if(name === '' || email === '' || password === '' || number === '' || cost === '' || description === ''){
            alert('Preencha todos os campos!');
            return;
        }else{
            api.post('/teacher', {
                name,
                email,
                number,
                password,
                description,
                cost: Number(cost),
            }).then(() => {
                alert('Cadastro realizado com sucesso!')
                history('/log_in_teacher')
            }).catch((err) => {
                alert('Erro no cadastro!');
                console.log(err);
            })
        }

        
    }

    
    return(
        <div className={styles.signUpBody}>
            <Header state={stateId} title='Bem vindo Professor' />
            <div id={styles.signUpContainer}>    
                <div id={styles.signUpWindow}>
                <header><img src={smlIcon} width="70px"/></header>
                <section id={styles.inputsMain}>
                <h1>Usuário</h1>
                <TextBox type="text" value={name} onChange={(e) => {setName(e.target.value);console.log("a")}}/>
                <h1>Email</h1>
                <TextBox type="text" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                <h1>Senha</h1>
                <TextBox type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                <h1>Telefone</h1>
                <TextBox type="text" value={number} onChange={(e) => {setNumber(e.target.value)}}/>
                <h1>Custo</h1>
                <TextBox type="text" value={cost} onChange={(e) => {setCost(e.target.value)}}/>
                <h1>Descrição</h1>
                <TextBox type="text" value={description} onChange={(e) => {setDescription(e.target.value)}}/>
                <Submit className={styles.btn} label="Cadastrar" onClick={signUp}/>
                </section>
                </div>
        
            </div>
            <Footer />
        </div>
        
    )
};
export default SignUpTeacher; 