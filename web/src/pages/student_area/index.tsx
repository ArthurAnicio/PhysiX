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
import Avatar from "../../components/avatar";


const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")

function StudentArea() {
    const location = useLocation();
    const history = useNavigate();
    const [user,setUser] = useState({user: '',email: '', id: 0, avatar:''})
    const [username, setUsername] = useState('')
    const [imgsrc, setImgsrc] = useState('')

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
                getAvatar(user.avatar)
                
                
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
    async function getAvatar(avatarPath: string){
        try{
            const response = await api.get('/avatar',{params:{route:avatarPath}})
            if(response.status === 200) {
                setImgsrc(response.request.responseURL);
                
            } else {
                alert('Falha no avatar!')
                console.log(response)
            }
        } catch(err){
            alert('Falha no avatar!')
            console.log(err)
        }
    }
    async function sendAvatar(){
        const formData = new FormData();
        const fileInput = document.getElementById('avatarSend') as HTMLInputElement | null
            if(fileInput){
            try {
            const file = fileInput.files?.[0]
            formData.append('id',user.id.toString())
            formData.append('avatar',file||'');
            const response = await api.post('/avatar', formData)
            
            if(response.status === 200){
                alert('Avatar enviado com sucesso!')
                getUser()
            }
            else{
                alert('Falha no envio do avatar!')
                console.log(response)
            }
            }catch(err){
                alert('big erro')
                console.log(err)
            }
         
        }
    }
    
    return (
        <div>
            <Header title="Área do Aluno" path="/"/>
            <div id="area-container">
                <Link id="teacher-list" to="/teacher_list"> <Search/> Busque por professores</Link>
                <h1>Bem vindo, {username}!</h1>
                <input type="file" id='avatarSend'/>
                <Submit label="Enviar" onClick={sendAvatar} />
                <Avatar size="600px" src={imgsrc}/>
            </div>
            <Footer/>
        </div>
    )
}

export default StudentArea;