import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Footer from '../../components/footer';
import Header from '../../components/header';
import Select from '../../components/select';
import Input from '../../components/input';
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
                 <Select 
                    value={week_day}
                    label='Dia' 
                    onChange={(e) => { setWeekDay(parseInt(e.target.value)); } }
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
                    onChange={e => {setTime(e.target.value)}}
                />
                
                <input id='pesquisar' type="submit" placeholder='Pesquisar'></input>
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