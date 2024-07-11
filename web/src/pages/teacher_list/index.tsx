import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Footer from '../../components/footer';
import Header from '../../components/header';
import Select from '../../components/select';
import Input from '../../components/input';
import TeacherItem, { Teacher } from '../../components/teacherItem';
import api from '../../services/api';

function TeacherList() {
    const [week_day, setWeekDay] = useState(0);
    const [time, setTime] = useState('');
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    async function searchTeachers(e: FormEvent) {
        e.preventDefault();

        if (time !== '' && week_day !== undefined) {
            try {
                const response = await api.get('/teacher', {
                    params: {
                        week_day,
                        time
                    }
                });
                const teachersData = response.data;

                const updatedTeachers = await Promise.all(
                    teachersData.map(async (teacher: Teacher) => {
                        teacher.avatar = await getAvatar(teacher.avatar);
                        return teacher;
                    })
                );

                setTeachers(updatedTeachers);
            } catch (err) {
                alert('Falha na busca!');
                console.log(err);
            }
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
            <Header path="/" title="Lista de Professores" />
            <form id="teacherList-filters" onSubmit={searchTeachers}>
                <Select
                    value={week_day}
                    label='Dia'
                    onChange={(e) => { setWeekDay(parseInt(e.target.value)); }}
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
                    label="Horário"
                    type="time"
                    value={time}
                    onChange={e => { setTime(e.target.value) }}
                />
                <input id='pesquisar' type="submit" placeholder='Pesquisar'></input>
            </form>
            <div id='teacherList-container'>
                {teachers.map((teacher: Teacher) => (
                    <TeacherItem key={teacher.id} teacher={teacher} />
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default TeacherList;
