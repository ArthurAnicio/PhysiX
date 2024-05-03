import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Button from '../../components/button';

function SignUpTeacher(){
    return(
        <div>
            <h1>Sign Up Teacher</h1>
            <Button label='Sou estudante' path="/sign_up_student"/>
            <Button label="Sou professor" path="/sign_up_teacher"/>
            <Button label="Estude" path="/teacher_list"/>
            <Button label="Início" path="/"/>
        </div>
    )
};
export default SignUpTeacher;