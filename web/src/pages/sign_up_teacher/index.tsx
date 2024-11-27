import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignUpTeach.module.css';
import api from '../../services/api';
import Header from '../../components/header';
import TextBox from '../../components/textbox';
import Submit from '../../components/submit';
import Footer from '../../components/footer';
import PassCheck from "../../components/passcheck";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png");

function SignUpTeacher() {
    const history = useNavigate();
    const [stateId, setStateId] = useState(0);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');

    // Função para aplicar a máscara manualmente
    function handlePhoneInput(e: React.ChangeEvent<HTMLInputElement>) {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
        if (value.length > 11) value = value.slice(0, 11); // Limita a 11 caracteres

        if (value.length > 0) value = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7, 11)}`;
        setNumber(value);
    }

    // Função para converter o telefone no formato internacional
    function formatPhoneForAPI(phone: string): string {
        const cleanPhone = phone.replace(/\D/g, ''); // Remove a máscara
        return `55${cleanPhone}`; // Adiciona o código do país (Brasil = 55)
    }

    function signUp() {
        if (!passwordCorrect) {
            alert('Por favor complete todos os requisitos!');
            return;
        }
        if (!name || !email || !password || !number) {
            alert('Preencha todos os campos!');
            return;
        }

        // Converte o telefone para o formato esperado pela API do WhatsApp
        const formattedNumber = formatPhoneForAPI(number);

        api.post('/teacher', {
            name,
            email,
            number: formattedNumber, // Envia o número formatado
            password,
        }).then(async () => {
            try {
            await api.post('/verify-teacher', {email}).then(() => {
                alert('Usuário cadastrado, por favor verifique o seu email.');
            })} catch (err) {
                alert('Erro ao enviar email!');
                console.log(err);
            }
            history('/log_in_teacher');
        }).catch((err) => {
            alert('Erro no cadastro!');
            console.log(err);
        });
    }

    return (
        <div className={styles.signUpBody}>
            <Header state={stateId} title='Bem vindo Professor' />
            <div id={styles.signUpContainer}>
                <div id={styles.signUpWindow}>
                    <header><img src={smlIcon} width="70px" /></header>
                    <section id={styles.inputsMain}>
                        <h1>Usuário</h1>
                        <TextBox type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        <h1>Email</h1>
                        <TextBox type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <h1>Senha</h1>
                        <TextBox type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <PassCheck password={password} setCorrect={setPasswordCorrect} />
                        <h1>Telefone</h1>
                        <TextBox
                            type="text"
                            value={number}
                            onChange={handlePhoneInput}
                        />
                        <Submit className={styles.btn} label="Cadastrar" onClick={signUp} />
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default SignUpTeacher;