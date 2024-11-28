import React, { useEffect, useState } from "react";
import styles from "./StudentCard.module.css";
import api from "../../services/api";

interface Class {
  student_id: number;
  week_day: number;
  from: string;
  to: string;
}

interface Student {
  name: string;
  number: number;
}

const StudentCard: React.FC<Class> = ({ student_id, week_day, from, to }) => {
  const [student, setStudent] = useState<Student>();
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
    api.get(`/getuser?id=${student_id}`).then((response) => {
      setStudent(response.data);
    });
    formatWeekDay();
  }, []);

  return (
    <div id={styles.studentCard}>
      <h1 id={styles.h1}>{student?.name}</h1>
      <h2 className={styles.h2}>{weekDay}</h2>
      <div id={styles.time}>
        <h2 className={styles.h2}>
          {from} - {to}
        </h2>
      </div>
    </div>
  );
};

export default StudentCard;
