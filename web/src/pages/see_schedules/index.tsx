import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Teacher } from "../../components/teacherItem";
import ClassScheduleItem, {
  ClassSchedule,
} from "../../components/classScheduleItem";

import Header from "../../components/header";
import Footer from "../../components/footer";

const SeeSchedules = () => {
  const location = useLocation();
  const { userId, teacherId } = location.state || 0;
  const [teacher, setTeacher] = useState<Teacher>();
  const [classSchedule, setClassSchedule] = useState<ClassSchedule[]>([]);
  console.log(userId, teacherId);

  useEffect(() => {
    api
      .get(`/getTeacher/?id=${teacherId}`)
      .then((response) => {
        setTeacher(response.data);
        setClassSchedule(JSON.parse(response.data.schedule));
      })
      .catch((error) => console.error(error));
  }, []);

  function handleDelete() {}

  return (
    <div>
      <Header state={userId} title="Horários do Professor" />
      <main className=''>
        {classSchedule.map((schedule, index) => (
          <ClassScheduleItem
            key={schedule.id}
            classSchedule={schedule}
            onDelete={handleDelete}
            teacherId={teacherId}
          />
        ))}
      </main>
      <Footer/>
    </div>
  );
};

export default SeeSchedules;
