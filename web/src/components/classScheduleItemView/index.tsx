import React,{useState, useEffect} from 'react'
import { ClassSchedule } from '../classScheduleItem'
import styles from './CSIV.module.css'
import api from '../../services/api'

interface CSIVProps {
    teacherId: number;
    classSchedule: ClassSchedule;
}

const ClassScheduleItemView: React.FC<CSIVProps> = ({ classSchedule }) => {
    
    const [from, setFrom] = useState(classSchedule.from);
    const [to, setTo] = useState(classSchedule.to);
    const [week_day, setWeek_Day] = useState(classSchedule.week_day);
    const [schedule, setSchedule] = useState({week_day, from, to})
    return(
        <></>
    )
}

export default ClassScheduleItemView