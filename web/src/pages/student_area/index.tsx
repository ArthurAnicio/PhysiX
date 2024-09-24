import  { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./StudentArea.module.css";
import AreaHeader from "../../components/areaHeader";
import Footer from "../../components/footer";
import api from "../../services/api";
import Avatar from "../../components/avatar";

function StudentArea() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({ user: '', email: '', id: 0, avatar: '' });
    const [imgsrc, setImgsrc] = useState('');
    const { userId } = location.state || { userId: 0 };
    const [stateId, setStateId] = useState(userId)
    const asideRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        getUser();
    }, []);
 
    useEffect(() => {
        if (user.avatar) {
            getAvatar(user.avatar);
        }
    }, [user.avatar]);

    function asideOpen() {
        if(asideRef.current!= undefined) {
            asideRef.current.classList.toggle("StudentArea_asideClosed__HDMo7");
        }
        console.log(asideRef.current)
    }

    async function getUser() {
        try {
            const response = await api.get('/getuser', { params: { id: userId } });
            if (response.status === 200) {
                setStateId(response.data.id)
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
            <AreaHeader title="Área do Aluno" state={ stateId } asideOpen={asideOpen}  />
            <main id={styles.areaContainer}>
                <aside id={styles.areaAside} ref={asideRef} className={styles.asideClosed}>
                <i className='fa-solid fa-user' onClick={() => navigate("/profile_student", {state: { userId }})}></i>
                <i className="fa-solid fa-chalkboard-user" onClick={() => navigate("/teacher_list", { state: { userId } })}></i>
                <i className="fa-solid fa-right-from-bracket" onClick={() => navigate("/")}></i>
                </aside>
            </main>
            <Footer />
        </div>
    );
}

export default StudentArea;