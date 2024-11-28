import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./TeacherList.module.css";
import Footer from "../../components/footer";
import Header from "../../components/header";
import Select from "../../components/select";
import Input from "../../components/input";
import TeacherItem, {
  Teacher,
  unmappedTeacher,
} from "../../components/teacherItem";
import api from "../../services/api";
import Submit from "../../components/submit";

function TeacherList() {
  const location = useLocation();
  const [week_day, setWeekDay] = useState(0);
  const [time, setTime] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [favorites, setFavorites] = useState([0]);
  const user_id = location.state || 0;
  const [stateId, setStateId] = useState(user_id.userId);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    listTeachers();
  }, []);

  useEffect(() => {
    setFilter();
  }, [week_day, time]);

  useEffect(() => {
    setFilteredTeachers(teachers);
  }, [teachers]);

  function setFilter() {
    if (teachers) {
      const filtered: Teacher[] = teachers.filter((teacher) =>
        teacher.schedule.some((schedule) => {
          const isSameDay =
            week_day == -1 ? true : parseInt(schedule.week_day) == week_day;

          const timeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(":");
            return parseInt(hours) * 60 + parseInt(minutes);
          };

          const timeFrom = timeToMinutes(schedule.from);
          const timeTo = timeToMinutes(schedule.to);
          const selectedtime = timeToMinutes(time);

          return (
            isSameDay && timeFrom <= selectedtime && timeTo >= selectedtime
          );
        })
      );
      setFilteredTeachers(filtered);
    }
  }

  async function listTeachers() {
    try {
      const response = await api.get("/teacher");
      const teachersData = response.data;
      const updatedTeachers: unmappedTeacher[] = await Promise.all(
        teachersData.map(async (teacher: unmappedTeacher) => {
          teacher.avatar = await getAvatar(teacher.avatar);
          return teacher;
        })
      );
      console.log(updatedTeachers);
      const unfilteredTeachers = updatedTeachers.map((teacher) => {
        return {
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          avatar: teacher.avatar,
          schedule: teacher.schedule ? JSON.parse(teacher.schedule) : [],
          number: teacher.number,
          favorite: teacher.favorite,
        };
      });
      setTeachers(
        unfilteredTeachers.filter((teacher) => teacher.schedule.length > 0)
      );
    } catch (err) {
      alert("Falha na busca!");
      console.log(err);
    }
  }

  async function getAvatar(avatarPath: string) {
    try {
      const response = await api.get("/avatar", {
        params: { route: avatarPath },
      });
      if (response.status === 200) {
        return response.request.responseURL;
      } else {
        alert("Falha no avatar!");
        console.log(response);
        return "";
      }
    } catch (err) {
      alert("Falha no avatar!");
      console.log(err);
      return "";
    }
  }

  return (
    <div>
      <Header state={stateId} title="Lista de Professores" />
      <form id={styles.teacherListFilters}>
        <div id={styles.separator}>
          <Select
            value={week_day}
            label="Dia"
            onChange={(e) => {
              setWeekDay(parseInt(e.target.value));
            }}
            opitions={[
              { value: "-1", label: "Sem filtro" },
              { value: "0", label: "Domingo" },
              { value: "1", label: "Segunda-Feira" },
              { value: "2", label: "Terça-Feira" },
              { value: "3", label: "Quarta-Feira" },
              { value: "4", label: "Quinta-Feira" },
              { value: "5", label: "Sexta-Feira" },
              { value: "6", label: "Sábado" },
            ]}
          />
          <Input
            id="from"
            label="Horário"
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
            }}
          />
        </div>

        {(time != "" || week_day >= 0) && (
          <Submit
            label="Limpar Seleção"
            onClick={() => {
              setTime("");
              setWeekDay(-1);
              listTeachers();
            }}
          />
        )}
      </form>
      <div id={styles.teacherListContainer}>
        {filteredTeachers.map((teacher: Teacher) => (
          <TeacherItem
            key={teacher.id}
            teacher={teacher}
            reload={listTeachers}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default TeacherList;
