import  { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import api from "../../services/api";
import Avatar from "../../components/avatar";

function StudentArea() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({ user: '', email: '', id: 0, avatar: '' });
    const [imgsrc, setImgsrc] = useState('');
    const { userId } = location.state || { userId: 0 };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (user.avatar) {
            getAvatar(user.avatar);
        }
    }, [user.avatar]);

    async function getUser() {
        try {
            const response = await api.get('/getuser', { params: { id: userId } });
            if (response.status === 200) {
                setUser(response.data);
            } else {
                alert('Falha no login! Por favor tente novamente.');
                navigate('/log_in_student');
            }
        } catch (error) {
            alert('Falha no login!');
            navigate('/log_in_student');
            console.log(error);
        }
    }

    async function getAvatar(avatarPath: string) {
        try {
            const response = await api.get('/avatar', { params: { route: avatarPath } });
            if (response.status === 200) {
                setImgsrc(response.request.responseURL);
            } else {
                alert('Falha no avatar!');
                console.log(response);
            }
        } catch (err) {
            alert('Falha no avatar!');
            console.log(err);
        }
    }

    

    return (
        <div>
            <Header title="Área do Aluno" path="/" />
            <div id="area-container">
                
                <h1>Bem vindo, {user.user}!  </h1>
                <button className="send-to-profile" onClick={() => navigate("/profile_student", {state: { userId }})}>
                    <Avatar size="5vh" src={imgsrc} /> <span>Seu perfil</span>
                </button>
                <button id="teacher-list" onClick={() => navigate("/teacher_list", { state: { userId } })}>
                    Busque por professores
                </button>
            </div>
            <Footer />
        </div>
    );
}

export default StudentArea;
