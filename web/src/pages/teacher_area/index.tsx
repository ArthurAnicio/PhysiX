import React, { useState, useEffect, MouseEventHandler } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import api from "../../services/api";



function TeacherArea() {
    const location = useLocation();
    const history = useNavigate();
    const [teacher,setteacher] = useState({teacher: '',email: ''})
    const [teachername, setteachername] = useState('')

    useEffect(()=>{
        getTeacher()
    })
    async function getTeacher() {
        const {teacherId} = location.state || 0;
        console.log(teacherId)
        try{
            const response = await api.get('/getTeacher', {params:{id: teacherId}})
            if (response.status === 200) {
                setteacher(response.data)
                setteachername(teacher.teacher)
                
            } else{
                alert('Falha no login! Por favor tente novamente.')
                history('/log_in_teacher')
            }
        } catch(error) {
            alert('Falha no login!')
            history('/log_in_teacher')
            console.log(error)
        }
    }

    async function sendToClassArea(){
        const {teacherId} = location.state || 0;
        history('/classes_area', {state:{teacherId: teacherId}})
    }

    return (
        <div>
            <Header title="Área do Professor" path="/"/>
            <div id="area-container">
              <h1>Bem vindo, {teachername}!</h1>
              <button onClick={sendToClassArea}></button>
            </div>
            <Footer/>
        </div>
    )
}

export default TeacherArea;