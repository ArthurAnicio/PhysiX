import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./TeacherItem.module.css";
import api from "../../services/api";
import Submit from "../submit";
import FavoriteButton from "../favoriteButton";
import Star from "../../assets/images/icons/star";

type ReloadFunction = () => void;

export interface Teacher {
  name: string;
  email: string;
  id: number;
  number: string;
  avatar: string;
  favorite: boolean;
  schedule: Schedule[]
}
export interface unmappedTeacher {
  id: number;
  name: string;
  email: string;
  number: string;
  avatar: string;
  favorite: boolean;
  schedule: string
}

interface Schedule {
  id: number;
  week_day: string;
  from: string;
  to: string;
}
interface TeacherItemProps {
  teacher: Teacher;
  reload: ReloadFunction;
}
const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, reload }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || 0;
  console.log(userId);

  // async function sendInvite() {
  //     const { userId } = location.state || 0;
  //     if (!userId) {
  //         alert('Erro: usuário não encontrado.');
  //         return;
  //     }

  //     try {
  //         console.log(`ids: ${userId}, ${teacher.id}`);
  //         await api.post('/invite', {
  //             user_id: userId,
  //             teacher_id: teacher.id
  //         });
  //         alert('Convite enviado!');
  //     } catch (err) {
  //         alert(`Erro ao mandar o convite: ${err}`);
  //     }
  // }

  return (
    <div id={styles.teacherCard}>
      <div id={styles.avatarSection}>
        <img id={styles.teacherListAvatar} src={teacher.avatar}></img>
      </div>
      <h1>
        {teacher.name.split(" ")[0]} <br /> {teacher.name.split(" ")[1] || ""}
      </h1>
      <div id={styles.extraData}>
        <button
          className={styles.sendInvite}
          onClick={() =>
            navigate("/see_schedules", {
              state: { userId, teacherId: teacher.id },
            })
          }
        >
          Horários
        </button>
      </div>
    </div>
  );
};

export default TeacherItem;
