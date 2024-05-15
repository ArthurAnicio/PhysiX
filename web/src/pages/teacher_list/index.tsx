import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Footer from '../../components/footer';
import Header from '../../components/header';
import TeacherItem, {Teacher} from '../../components/teacherItem';
import api from '../../services/api';

function TeacherList(){
    const [week_day, setWeekDay] = useState(0)
    const [time, setTime] = useState('');
    const [teachers, setTeachers] = useState([]);

    async function searchTeachers(e: FormEvent) { 
        e.preventDefault();

        if (time != '' && week_day != undefined) {
            try {const response = await api.get('/teacher', {
                params: {
                week_day,
                time
                }
            });
        setTeachers(response.data)
        
        }
        catch(err) {
            alert('Falha na busca!')
            console.log(err)
        }
       
        }
        
    }

    return(
        <div>
            <Header path="/" title="Lista de Professores"/>
             <form id="teacherList-filters" onSubmit={searchTeachers}>
                 <p>Dia</p>
                 <p>Horário</p>
                 <select value={week_day} onChange={(e) => {setWeekDay(parseInt(e.target.value))}}>
                    <option value="0">Domingo</option>
                    <option value="1">Segunda</option>
                    <option value="2">Terça</option>
                    <option value="3">Quarta</option>
                    <option value="4">Quinta</option>
                    <option value="5">Sexta</option>
                    <option value="6">Sábado</option>
                 </select>
                <input type="time" value={time} onChange={e => {setTime(e.target.value)}}/>
                <input type="submit" placeholder='Pesquisar'></input>
             </form>
             <div id='teacherList-container'>
                {teachers.map((teacher: Teacher) =>
                {
                    return(
                        <TeacherItem key={teacher.id} teacher={teacher}/>
                    )
                })}
                
             </div>
            <Footer />
        </div>
    )
};
export default TeacherList;