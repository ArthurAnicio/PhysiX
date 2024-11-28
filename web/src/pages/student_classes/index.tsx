import api from "../../services/api";
import Header from "../../components/header";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TeacherCard from "../../components/teacherCard";

interface Class {
    id: number;
    teacher_id: number;
    user_id: number;
}

interface Teacher {
    id: number;
    name: string;
    avatar: string;
    number: string;
    
}

function StudentClasses() {
    const location = useLocation();
    const { userId } = location.state || { userId: 0 };
    const [stateId, setStateId] = useState(userId);
    const [classes, setClasses] = useState<Class[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);    

    useEffect(() => {
        getClasses()
    },[userId])
    

    useEffect(() => {
        fetchTeachers()
    }, [classes])

    async function getClasses() {
        try {

            await api.get('/classesUser',{params: {user_id: userId}}).then((response) => {
                console.log(response.data);
                setClasses(response.data);
            })

        } catch (err) {
            console.error(err);
        }
    }
    async function fetchTeachers() {
        const newTeachers = await Promise.all(
            classes.map(async (newClass: Class) => {
                const teacher = await getTeacher(newClass.teacher_id);
                return teacher;
            })
        );
        setTeachers(newTeachers);
    }

    async function getTeacher(id:Number) : Promise<Teacher> {
        try {
            const response = await api.get('/getTeacher', {params: {id: id}})
            return response.data as Teacher;
        } catch (err) {
            console.error(err);
            return {id: 0, name:'a', avatar: '', number: ''}
        }
    }

    return (<>
            <Header title="Minhas Aulas" state={stateId}/>
            <div> 
                {teachers.map((teacher) => (<TeacherCard name={teacher.name} id={teacher.id} avatar={teacher.avatar} number={teacher.number}/>))}
            </div>
        </>
    );
}

export default StudentClasses;