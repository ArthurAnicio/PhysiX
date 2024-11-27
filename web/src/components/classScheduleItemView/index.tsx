import React, { useState, useEffect } from "react";
import { ClassSchedule } from "../classScheduleItem";
import styles from "./CSIV.module.css";
import api from "../../services/api";

interface CSIVProps {
  userId: number;
  teacherId: number;
  classSchedule: ClassSchedule;
}

const ClassScheduleItemView: React.FC<CSIVProps> = ({
  userId,
  teacherId,
  classSchedule,
}) => {
  const [from, setFrom] = useState(classSchedule.from);
  const [to, setTo] = useState(classSchedule.to);
  const [week_day, setWeek_Day] = useState("" + classSchedule.week_day);
  const [id, setId] = useState(classSchedule.id);
  const [schedule, setSchedule] = useState({ week_day, from, to, id });

  useEffect(() => {
    formatWeekDay();
    console.log(schedule);
  }, [week_day]);

  function formatWeekDay() {
    switch (week_day) {
      case "0":
        return setWeek_Day("Domingo");
      case "1":
        return setWeek_Day("Segunda");
      case "2":
        return setWeek_Day("Terça");
      case "3":
        return setWeek_Day("Quarta");
      case "4":
        return setWeek_Day("Quinta");
      case "5":
        return setWeek_Day("Sexta");
      case "6":
        return setWeek_Day("Sábado");
      default:
        return "Dia da semana desconhecido";
    }
  }

  function createSchedule() {
    setSchedule({ week_day, from, to, id });
  }

  async function createInvite() {
    try {
      const response = await api.post("/invite", {
        user_id: userId,
        teacher_id: teacherId,
        accepted: false,
        schedule,
      });
    } catch (err) {
      alert("Falha ao solicitar convite");
      console.error(err);
    }
  }

  return (
    <div id={styles.classScheduleItem}>
      <div id={styles.weekDayItem}>
        <p>Dia da semana:</p>
        <span>{week_day}</span>
      </div>
      <div id={styles.time}>
        <div id={styles.fromItem}>
          <p>De:</p>
          <label id={styles.label}>{classSchedule.from}</label>
        </div>
        <div id={styles.toItem}>
          <p>Até:</p>
          <label id={styles.label}>{classSchedule.to}</label>
        </div>
      </div>
      <button className={styles.solicitar} onClick={createInvite}>
        Solicitar
      </button>
    </div>
  );
};

export default ClassScheduleItemView;
