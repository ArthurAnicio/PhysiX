import React, { useEffect, useState } from "react";
import styles from './CSItem.module.css'
import Submit from "../submit";
import api from "../../services/api";

import Edit from '../../assets/images/icons/edit';
import { useLocation } from "react-router-dom";

export interface ClassSchedule {
    week_day: number;
    from: string;
    to: string;
    id: number;
    
}

interface ClassScheduleItemProps {
    
    classSchedule: ClassSchedule;
    onDelete: (id: number) => void;
    teacherId: number
}

const ClassScheduleItem: React.FC<ClassScheduleItemProps> = ({ classSchedule,onDelete,teacherId }) => {
    const [isEditable, setIsEditable] = useState(false);
    const [from, setFrom] = useState(classSchedule.from);
    const [to, setTo] = useState(classSchedule.to);
    const [week_day, setWeek_Day] = useState(classSchedule.week_day);
    const location = useLocation();
    const [fullSchedule, setFullSchedule] = useState<ClassSchedule[]>([]);

    useEffect(()=>{
        
    loadClassSchedules()
    },[])

    useEffect(() => {
        function setParams() {
            const weekDayElement = document.getElementById(`week_day_${classSchedule.id}`) as HTMLSelectElement | null;
            const fromElement = document.getElementById(`from_${classSchedule.id}`) as HTMLInputElement | null;
            const toElement = document.getElementById(`to_${classSchedule.id}`) as HTMLInputElement | null;

            if (weekDayElement) {
                weekDayElement.value = classSchedule.week_day.toString();
            }
            if (fromElement) {
                fromElement.value = classSchedule.from;
            }
            if (toElement) {
                toElement.value = classSchedule.to;
            }
        }

        console.log('Setting params for class schedule:', classSchedule);
        setParams();
    }, [classSchedule]);


    async function loadClassSchedules() {
        try {
            const response= await api.get('/getTeacher', { params: { id: teacherId } })
            const currentTeacher = response.data;
            setFullSchedule(JSON.parse(currentTeacher.schedule) || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
        
    }

    function handleEditClick() {
        setIsEditable(!isEditable);
    }

    function updateSchedule(){
        
        const workingSchedule = fullSchedule.filter((schedule)=> schedule.id != classSchedule.id);

        console.log(workingSchedule)

        const id = classSchedule.id;
        const week_day_value = week_day;
        const from_value = from;
        const to_value = to;

        const editedSchedule = {
            id: id,
            week_day: week_day_value,
            from: from_value,
            to: to_value,
        };
        
        workingSchedule.push(editedSchedule);
        
        api.put(`/updateScheduleItem?id=${teacherId}`, {
                schedule: JSON.stringify(workingSchedule)   
            })

            setIsEditable(!isEditable);
            {}
        }


        function deleteSchedule() {
            onDelete(classSchedule.id);
        }
    

    return (
        <div id={styles.classScheduleItem}>
            <div id={styles.weekDayItem}>
                <p>Dia da semana:</p>
                <select id={`week_day_${classSchedule.id}`} onChange={(e) => setWeek_Day(parseInt(e.target.value))} disabled={!isEditable}>
                    <option value="0">Domingo</option>
                    <option value="1">Segunda</option>
                    <option value="2">Terça</option>
                    <option value="3">Quarta</option>
                    <option value="4">Quinta</option>
                    <option value="5">Sexta</option>
                    <option value="6">Sábado</option>
                </select>
            </div>
            <div id={styles.timeContainer}>
            <div id={styles.fromItem}>
                <p>De:</p>
                <input id={`from_${classSchedule.id}`} type="time" onChange={(e) => setFrom(e.target.value)} disabled={!isEditable} />
            </div>
            <div id={styles.toItem}>
                <p>Até:</p>
                <input id={`to_${classSchedule.id}`} type="time" onChange={(e) => setTo(e.target.value)} disabled={!isEditable} />
            </div>
            </div>

            <div id={styles.btnContainer}>
            <button id={styles.edit} onClick={isEditable ? updateSchedule : handleEditClick}>
                {isEditable ? 'Concluir' : 'Editar'}
            </button>
            <button id={styles.delete} onClick={isEditable ? handleEditClick : deleteSchedule}>
                {isEditable ? 'Cancelar' : 'Excluir'}
            </button>
            </div>
            
        </div>
    );
}

export default ClassScheduleItem;
