import React, { InputHTMLAttributes } from "react";
import "./styles.css";

interface TeacherItemProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    description: string;
    cost: number;
    number: string;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ name, description, cost, number, ...rest}) => {
    return (
        <div id="teacherCard">
            
        </div>
    );
}

export default TeacherItem;