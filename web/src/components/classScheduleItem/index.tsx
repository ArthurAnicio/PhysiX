import React, { useEffect, useState } from "react";
import './styles.css'
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
}

const ClassScheduleItem: React.FC<ClassScheduleItemProps> = ({ classSchedule,onDelete  }) => {
    const [isEditable, setIsEditable] = useState(false);
    const [from, setFrom] = useState(classSchedule.from);
    const [to, setTo] = useState(classSchedule.to);
    const [week_day, setWeek_Day] = useState(classSchedule.week_day);
    const location = useLocation();

    function setWeekDay() {
        const week_day_number = classSchedule.week_day;
        switch (week_day_number) {
            case 0:
                return 'Domingo';
            case 1:
                return 'Segunda';
            case 2:
                return 'Terça';
            case 3:
                return 'Quarta';
            case 4:
                return 'Quinta';
            case 5:
                return 'Sexta';
            case 6:
                return 'Sábado';
            default:
                return 'Domingo';
        }
    }

    function convertMinutesToHour(minutes: string): string {
        const convertedMinutes = parseInt(minutes);
        const hours = Math.floor(convertedMinutes / 60);
        const mins = convertedMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    useEffect(() => {
        function setParams() {
            const weekDayElement = document.getElementById(`week_day_${classSchedule.id}`) as HTMLSelectElement | null;
            const fromElement = document.getElementById(`from_${classSchedule.id}`) as HTMLInputElement | null;
            const toElement = document.getElementById(`to_${classSchedule.id}`) as HTMLInputElement | null;

            if (weekDayElement) {
                weekDayElement.value = classSchedule.week_day.toString();
            }
            if (fromElement) {
                fromElement.value = convertMinutesToHour(classSchedule.from);
            }
            if (toElement) {
                toElement.value = convertMinutesToHour(classSchedule.to);
            }
        }

        console.log('Setting params for class schedule:', classSchedule);
        setParams();
    }, [classSchedule]);

    function handleEditClick() {
        setIsEditable(!isEditable);
    }

    function updateSchedule(){
        const id = classSchedule.id;
        const week_day_value = week_day;
        const from_value = from;
        const to_value = to;

        const data = {
            week_day: week_day_value,
            from: from_value,
            to: to_value
        };

        api.put(`/class?id=${id}`, data)
           .then(res => {
                console.log(res);
            })
           .catch(err => {
                console.log(err);
            })

            setIsEditable(!isEditable);
            {}
        }
        function deleteSchedule() {
            onDelete(classSchedule.id);
        }
    

    return (
        <div id="class-schedule-item">
            <div id="week-day-item">
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
            <div id="from-item">
                <p>De:</p>
                <input id={`from_${classSchedule.id}`} type="time" onChange={(e) => setFrom(e.target.value)} disabled={!isEditable} />
            </div>
            <div id="to-item">
                <p>Até:</p>
                <input id={`to_${classSchedule.id}`} type="time" onChange={(e) => setTo(e.target.value)} disabled={!isEditable} />
            </div>
            <button id="edit" onClick={handleEditClick}>
                Editar
            </button>
            {isEditable && <Submit onClick={updateSchedule} label="Atualizar" />}
            <button id="delete" onClick={deleteSchedule}>
                Excluir
            </button>
        </div>
    );
}

export default ClassScheduleItem;
