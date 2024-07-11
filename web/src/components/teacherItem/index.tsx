import React from "react";
import { useLocation } from "react-router-dom";
import "./styles.css";
import api from "../../services/api";
import Submit from "../submit";

export interface Teacher {
   
    name: string;
    email:string;
    description: string;
    id: number;
    cost: number;
    number: string;
    avatar:string;
}
interface TeacherItemProps {
    teacher: Teacher;   
}
const TeacherItem: React.FC<TeacherItemProps> = ({ teacher}) => {
    const location = useLocation();
    async function favoriteTeacher(teacherId : number){
        const {userId} = location.state || 0;
        api.post('/favorite-teacher',{
            user_id:userId,
            teacher_id:teacherId
        }).then(()=>{
            alert("Professor favoritado com sucesso!")
        }).catch((err)=>{
            alert("Falha no favorito!")
            console.log(err)
        })
    }
    return (
        <div id="teacherCard">
            <div id="teacherCardName">
                <h1>{teacher.name}</h1>
                <img id="teacherListAvatar" src={teacher.avatar}></img>
            </div>
            <div id="extraData">
                <p>{teacher.email}</p>
                <p>R${teacher.cost.toString().replace('.',',')}</p>
                <p>{teacher.number}</p>
            </div>
            <div id="desc">
                {teacher.description}
            </div>
            <Submit label="Favoritar" onClick={()=>{favoriteTeacher(teacher.id)}} />
        </div>
    );
}

export default TeacherItem;