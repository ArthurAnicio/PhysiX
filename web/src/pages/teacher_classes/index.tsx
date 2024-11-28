import api from "../../services/api";
import Header from "../../components/header";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentCard from "../../components/studentCard";
import styles from "./StudentList.module.css";

interface Class {
  id: number;
  user_id: number;
  week_day: number;
  from: string;
  to: string;
}

interface Student {
  id: number;
  name: string;
  avatar: string;
  number: string;
}

function TeacherClasses() {
  const location = useLocation();
  const { teacherId } = location.state || { teacherId: 0 };
  const [stateId, setStateId] = useState(teacherId);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    getClasses();
  }, [teacherId]);

  useEffect(() => {
    fetchStudents();
  }, [classes]);

  async function getClasses() {
    try {
      await api
        .get("/classesTeacher", { params: { teacher_id: teacherId } })
        .then((response) => {
          console.log(response.data);
          setClasses(response.data);
        });
    } catch (err) {
      console.error(err);
    }
  }
  async function fetchStudents() {
    const newStudents = await Promise.all(
      classes.map(async (newClass: Class) => {
        console.log(newClass);
        const student = await getStudent(newClass.user_id);
        return student;
      })
    );
    setStudents(newStudents);
  }

  async function getStudent(id: Number): Promise<Student> {
    try {
      const response = await api.get(`/getuser?id=${id}`);
      return response.data as Student;
    } catch (err) {
      console.error(err);
      return { id: 0, name: "a", avatar: "", number: "" };
    }
  }

  return (
    <div id={styles.container}>
      <Header title="Minhas Aulas" state={stateId} />
      <div id={styles.content}>
        {classes.map((c) => (
          <StudentCard
            student_id={c.user_id}
            week_day={c.week_day}
            from={c.from}
            to={c.to}
          />
        ))}
      </div>
    </div>
  );
}

export default TeacherClasses;
