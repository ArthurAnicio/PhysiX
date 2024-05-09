import React, { InputHTMLAttributes } from "react";
import "./styles.css";

export interface Teacher {
    name: string;
    email:string;
    description: string;
    cost: number;
    number: string;
}
interface TeacherItemProps {
    teacher: Teacher;
}
const TeacherItem: React.FC<TeacherItemProps> = ({ teacher}) => {
    return (
        <div id="teacherCard">
            <h1>{teacher.name}</h1>
            <div id="extraData">
                <p>{teacher.email}</p>
                <p>R${teacher.cost.toString().replace('.',',')}</p>
                <p>{teacher.number}</p>
            </div>
            <div id="desc">
                {teacher.description}
            </div>
        </div>
    );
}

export default TeacherItem;