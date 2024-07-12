import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import api from "../../services/api";
import Avatar from "../../components/avatar";
import Submit from "../../components/submit";
import Button from "../../components/button";

function TeacherArea() {
    const location = useLocation();
    const history = useNavigate();
    const [teacher, setTeacher] = useState({ teacher: '', email: '', id: 0, avatar: '' });
    const [teacherName, setTeacherName] = useState('');
    const [imgsrc, setImgsrc] = useState('');

    useEffect(() => {
        getTeacher();
    }, []);

    async function getTeacher() {
        const { id } = location.state || 0;
        
        try {
            const response = await api.get('/getTeacher', { params: { id } });
            if (response.status === 200) {
                const { teacher, avatar } = response.data;
                setTeacherName(teacher);
                setImgsrc(await getAvatar(avatar));
            } else {
                alert('Falha no login! Por favor tente novamente.');
                history('/log_in_teacher');
            }
        } catch (error) {
            alert('Falha no login!');
            history('/log_in_teacher');
            console.error('Erro ao obter dados do professor:', error);
        }
    }

    async function sendToClassArea() {
        const { id } = location.state || {};
        history('/classes_area', { state: { id } });
    }

    async function getAvatar(avatarPath: string) {
        try {
            const response = await api.get('/avatar', { params: { route: avatarPath } });
            if (response.status === 200) {
                return response.request.responseURL;
            } else {
                alert('Falha no avatar!');
                console.log(response);
                return '';
            }
        } catch (err) {
            alert('Falha no avatar!');
            console.log(err);
            return '';
        }
    }

    async function sendAvatar() {
        const formData = new FormData();
        const fileInput = document.getElementById('avatarSend') as HTMLInputElement | null;
        
        if (fileInput) {
            try {
                const file = fileInput.files?.[0];
                const {id} = location.state||0;
                formData.append('id',id);
                formData.append('avatar', file || '');
                const response = await api.post('/teacher-avatar', formData);
                
                if (response.status === 200) {
                    alert('Avatar enviado com sucesso!');
                    getTeacher();
                } else {
                    alert('Falha no envio do avatar!');
                    console.log(response);
                }
            } catch (err) {
                alert('Erro ao enviar avatar!');
                console.log(err);
            }
        }
    }

    return (
        <div>
            <Header title="Área do Professor" path="/" />
            <div id="area-container">
                <h1>Bem vindo, {teacherName}!</h1>
                <button id="class" onClick={sendToClassArea}>Ver Aulas</button>
                <input type="file" id='avatarSend'/>
                <Submit label="Enviar" onClick={sendAvatar} />
                <Avatar size="600px" src={imgsrc} />
            </div>
            <Footer />
        </div>
    );
}

export default TeacherArea;
