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
}

const ClassScheduleItem: React.FC<ClassScheduleItemProps> = ({classSchedule}) => {
    const [isEditable, setIsEditable] = useState(false);
    const location = useLocation()
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
            const weekDayElement = document.getElementById("week_day") as HTMLInputElement | null;
            const fromElement = document.getElementById("from") as HTMLInputElement | null;
            const toElement = document.getElementById("to") as HTMLInputElement | null;

            if (weekDayElement) {
                weekDayElement.value = setWeekDay();
            }
            if (fromElement) {
                fromElement.value = convertMinutesToHour(classSchedule.from);
            }
            if (toElement) {
                toElement.value = convertMinutesToHour(classSchedule.to);
            }
        }

        setParams();
    }, [classSchedule]);

    function updateSchedule()
    {
        const teacherId = location.state|| 0;

    }
    function handleEditClick() {
        setIsEditable(!isEditable);
    }

    return (
        <div id="class-schedule-item">
            <div id="week-day-item">
                <p>Dia da semana:</p>
                <input id="week_day" type="text" disabled={!isEditable} />
            </div>
            <div id="from-item">
                <p>De:</p>
                <input id="from" type="time" disabled={!isEditable} />
            </div>
            <div id="to-item">
                <p>Até:</p>
                <input id="to" type="time" disabled={!isEditable} />
            </div>
            <button id="edit" onClick={handleEditClick}>
                <Edit />
            </button>
            {isEditable && <Submit label="Atualizar" onClick={updateSchedule}/>}
        </div>
    );

}

export default ClassScheduleItem;
