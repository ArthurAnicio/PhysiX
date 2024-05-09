import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import api from '../../services/api';
import Button from '../../components/button';
import Header from '../../components/header';
import TextBox from '../../components/textbox';
import Submit from '../../components/submit';
import Select from '../../components/select';
import Input from '../../components/input';
import Footer from '../../components/footer';

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")
function LogInTeacher(){
    const history = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');
    const [scheduleItems, setScheduleItems] = useState([
        { week_day: 0, from: '', to: '' }
    ]);

    function addNewScheduleItem() {
        setScheduleItems([
            ...scheduleItems,
            {
                week_day: 0,
                from: '',
                to: ''
            }
        ]);
    };

    function setScheduleItemValue(position: number, field: string, value: string) {
        const updatedScheduleItems = scheduleItems.map((scheduleItem, index) => {
            if(index === position){
                return {
                    ...scheduleItem, [field]: value
                }
            }

            return scheduleItem;
        });

        setScheduleItems(updatedScheduleItems);
    }

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
                scheduleItems: scheduleItems
            }).then(() => {
                alert('Cadastro realizado com sucesso!')
            }).catch((err) => {
                alert('Erro no cadastro!');
                console.log(err);
            })
        }

        
    }

    
    return(
        <div>
            <Header path={'/'} title='Bem vindo Professor' />
            <div id="teacher-container">    
                <div id="login-window">
                <header><img src={smlIcon} width="70px"/></header>
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
                <h1>Horário</h1>
                <legend>
                    Horários disponíveis
                    <button type="button" onClick={addNewScheduleItem}>
                         + Novo horário
                    </button>
                </legend>

                    {
                        scheduleItems.map((scheduleItem, index) => {
                            return (
                                <div key={index} className="schedule-item">
                                    <Select
                                        id="week_day"
                                        label="Dia da semana"
                                        value={scheduleItem.week_day}
                                        onChange={(e) => setScheduleItemValue(index, 'week_day', e.target.value)}
                                        opitions={[
                                            { value: '0', label: 'Domingo' },
                                            { value: '1', label: 'Segunda-Feira' },
                                            { value: '2', label: 'Terça-Feira' },
                                            { value: '3', label: 'Quarta-Feira' },
                                            { value: '4', label: 'Quinta-Feira' },
                                            { value: '5', label: 'Sexta-Feira' },
                                            { value: '6', label: 'Sábado' },
                                        ]}
                                    />
                                    <Input 
                                        id="from" 
                                        label="Das" 
                                        type="time" 
                                        value={scheduleItem.from}
                                        onChange={(e) => setScheduleItemValue(index, 'from', e.target.value)}
                                    />
                                    <Input 
                                        id="to" 
                                        label="Até" 
                                        type="time" 
                                        value={scheduleItem.to}
                                        onChange={(e) => setScheduleItemValue(index, 'to', e.target.value)}
                                    />
                                </div>
                            )
                        })
                    }
                    <Submit label="Cadastrar" onClick={signUp}/>
                
                </div>
        
            </div>
            <Footer />
        </div>
        
    )
};
export default LogInTeacher;