import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './TeacherList.module.css';
import Footer from '../../components/footer';
import Header from '../../components/header';
import Select from '../../components/select';
import Input from '../../components/input';
import TeacherItem, { Teacher } from '../../components/teacherItem';
import api from '../../services/api';

function TeacherList() {
    const location = useLocation();
    const [week_day, setWeekDay] = useState(0);
    const [time, setTime] = useState('');
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [favorites, setFavorites] = useState([0]);
    const user_id = location.state || 0;
    const [stateId, setStateId] = useState(user_id.userId)
    const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);

    useEffect(() => {
        getFavorites(); 
        listTeachers()
    }, []);

    async function getFavorites(){
        try {
            
            const response = await api.get('/favorite-teacher',{
                params: {
                    user_id:user_id.userId
                }
            });
            setFavorites(response.data);
            
        } catch (err) {
            console.log(err);
        }
    }
    

    async function listTeachers() {
            getFavorites()
            try {
                const response = await api.get('/teacher')
                const teachersData = response.data; 
                const updatedTeachers = await Promise.all(
                    teachersData.map(async (teacher: Teacher) => {
                        teacher.avatar = await getAvatar(teacher.avatar);
                        return teacher;
                    })
                );
 
                setAllTeachers(updatedTeachers);
                console.log(teachersData)
                setTeachers(updatedTeachers)
            } catch (err) {
                alert('Falha na busca!');
                console.log(err);
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
            <Header state={stateId} title="Lista de Professores" />
            <form id={styles.teacherListFilters}>
                <Select
                    value={week_day}
                    label='Dia'
                    onChange={(e) => { setWeekDay(parseInt(e.target.value)); 
                    }}
                    opitions={[
                        { value: 'none', label: 'Sem filtro'},
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
                    label="Horário"
                    type="time"
                    value={time}
                    onChange={e => { setTime(e.target.value) }}
                />
            </form>
            <div id={styles.teacherListContainer}>
                {teachers.map((teacher: Teacher) => (
                    <TeacherItem key={teacher.id} teacher={teacher} reload={getFavorites}/>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default TeacherList;
