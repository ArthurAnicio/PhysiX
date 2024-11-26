import styles from "./Invites.module.css"
import Header from '../../components/header';
import Footer from "../../components/footer";
import Invite from "../../components/invite";
import React, { useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../../services/api";

function Invites() {

    const [teacher, setTeacher] = useState({ name: '', email: '', id: 0, avatar: '',number:'', password: '', schedule: null });
    const location = useLocation();
    const navigate = useNavigate();
    const { teacherId } = location.state || { teacherId: 0 };
    const [stateId, setStateId] = useState(teacherId)


    useEffect(() => {
        getTeacher();
        
    }, []);

    function teste(){}

    async function getTeacher() {
        try {
            
            const response = await api.get('/getTeacher', { params: { id: teacherId } });
            if (response.status === 200) {
                console.log(response.data)
                setTeacher(response.data);
                setStateId(response.data.id)
            } else {
                alert('Falha no login! Por favor tente novamente.');
                navigate('/log_in_teacher');
            }
        } catch (error) {
            alert('Falha no login!');
            navigate('/log_in_teacher');
            console.log(error);
        }
    }

    return (
        <div>
            <Header state={stateId} title='Pedidos de aula'/>
            <main className={styles.content}>
                <Invite invite_id={0} teacher_id={0} user_id={0} sync={teste} />
            </main>
            <Footer/>
        </div>
    )
}

export default Invites