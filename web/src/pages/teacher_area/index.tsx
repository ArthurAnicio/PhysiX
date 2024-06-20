import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import api from "../../services/api";

function TeacherArea() {
    const location = useLocation();
    const history = useNavigate();
    const [teacher, setTeacher] = useState({ teacher: '', email: '' });
    const [teacherName, setTeacherName] = useState('');

    useEffect(() => {
        getTeacher();
    }, []);

    async function getTeacher() {
        const { id } = location.state || {};
        
        try {
            const response = await api.get('/getTeacher', { params: { id } });
            if (response.status === 200) {
                setTeacher(response.data);
                setTeacherName(response.data.teacher);
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

    return (
        <div>
            <Header title="Área do Professor" path="/"/>
            <div id="area-container">
                <h1>Bem vindo, {teacherName}!</h1>
                <button onClick={sendToClassArea}>Ver Aulas</button>
            </div>
            <Footer />
        </div>
    );
}

export default TeacherArea;
