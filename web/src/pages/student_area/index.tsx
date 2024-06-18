import React, { useState, useEffect, MouseEventHandler } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Search from "../../assets/images/icons/search";
import TextBox from "../../components/textbox";
import Submit from "../../components/submit";
import api from "../../services/api";
import Button from "../../components/button";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")

function StudentArea() {
    const location = useLocation();
    const history = useNavigate();
    const [user,setUser] = useState({user: '',email: ''})
    const [username, setUsername] = useState('')

    useEffect(()=>{
        getUser()
    })
    async function getUser() {
        const {userId} = location.state || 0;
        try{
            const response = await api.get('/getuser', {params:{id: userId}})
            if (response.status === 200) {
                setUser(response.data)
                setUsername(user.user)
                
            } else{
                alert('Falha no login! Por favor tente novamente.')
                history('/log_in_student')
            }
        } catch(error) {
            alert('Falha no login!')
            history('/log_in_student')
            console.log(error)
        }
    }
    return (
        <div>
            <Header title="Área do Aluno" path="/"/>
            <div id="area-container">
                <Link id="teacher-list" to="/teacher_list"> <Search/> Busque por professores</Link>
                <h1>Bem vindo, {username}!</h1>
            </div>
            <Footer/>
        </div>
    )
}

export default StudentArea;