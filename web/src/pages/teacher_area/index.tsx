import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./TeacherArea.module.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import api from "../../services/api";
import Avatar from "../../components/avatar";
import Submit from "../../components/submit";
import Button from "../../components/button";

function TeacherArea() {
    const navigate = useNavigate();
    const location = useLocation();
    const { teacherId } = location.state || { teacherId: 0 };
    const history = useNavigate();
    const [teacher, setTeacher] = useState({ teacher: '', email: '', number: '',id: 0, avatar: '' });
    const [teacherName, setTeacherName] = useState('');
    const [imgsrc, setImgsrc] = useState('');

    useEffect(() => {
        console.log(teacherId)
        getTeacher();
    }, []);

    async function getTeacher() {
        
        try {
            const response = await api.get('/getTeacher', { params: { id: teacherId } });
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

    return (
        <div>
            <Header title="Área do Professor" path="/" />
            <main id={styles.areaContainer}>
                <aside id={styles.areaAside}>
                <i className='fa-solid fa-user' onClick={() => navigate("/profile_teacher", {state: { teacherId }})}></i>
                <i className="fa-solid fa-chalkboard-user" onClick={() => navigate("/student_list", { state: { teacherId } })}></i>
                <i className="fa-solid fa-chalkboard-user" onClick={() => navigate("/classes_area", { state: { teacherId } })}></i>
                </aside>
            </main>
            <Footer />
        </div>
    );
}

export default TeacherArea;