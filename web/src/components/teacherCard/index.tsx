import React, { useEffect, useState } from "react";
import styles from "./TeacherCard.module.css";
import api from "../../services/api";

interface Class {
  teacher_id: number;
  week_day: number;
  from: string;
  to: string;
}

interface Teacher {
  name: string;
  number: number;
}

const TeacherCard: React.FC<Class> = ({ teacher_id, week_day, from, to }) => {
  const [teacher, setTeacher] = useState<Teacher>();
  const [weekDay, setWeekDay] = useState("Domingo");

  function formatWeekDay() {
    switch (week_day) {
      case 0:
        return setWeekDay("Domingo");
      case 1:
        return setWeekDay("Segunda");
      case 2:
        return setWeekDay("Terça");
      case 3:
        return setWeekDay("Quarta");
      case 4:
        return setWeekDay("Quinta");
      case 5:
        return setWeekDay("Sexta");
      case 6:
        return setWeekDay("Sábado");
      default:
        return "Dia da semana desconhecido";
    }
  }

  useEffect(() => {
    api.get(`/getTeacher?id=${teacher_id}`).then((response) => {
      setTeacher(response.data);
    });
    formatWeekDay();
  }, []);

  return (
    <div id={styles.teacherCard}>
      <h1 id={styles.h1}>{teacher?.name}</h1>
      <h2 className={styles.h2}>{weekDay}</h2>
      <div id={styles.time}>
        <h2 className={styles.h2}>
          {from} - {to}
        </h2>
      </div>
      <a href={`https://wa.me/${teacher?.number}`} id={styles.wppBtn}>
        Enviar WhatsApp
      </a>
    </div>
  );
};

export default TeacherCard;
