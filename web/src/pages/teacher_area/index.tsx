import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./TeacherArea.module.css";
import AreaHeader from "../../components/areaHeader";
import Footer from "../../components/footer";
import api from "../../services/api";

function TeacherArea() {
    const navigate = useNavigate();
    const location = useLocation();
    const { teacherId } = location.state || { teacherId: 0 };
    const history = useNavigate();
    const [teacherName, setTeacherName] = useState('');
    const [imgsrc, setImgsrc] = useState('');
    const asideRef = useRef<HTMLDivElement>(null)
    const [newPostFormVisible, setNewPostFormVisible] = useState(false);
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        setNewPostFormVisible(false);
        getTeacher();
    }, []);

    function asideOpen() {
        if (asideRef.current != undefined) {
            asideRef.current.classList.toggle(styles.asideClosed);
        }
    }

    async function getTeacher() {
        try {
            const response = await api.get('/getTeacher', { params: { id: teacherId } });
            if (response.status === 200) {
                const { teacher, avatar } = response.data;
                setTeacherName(teacher);
                setImgsrc(await getAvatar(avatar));
            } else {
                alert('Falha no login! Por favor tente novamente.');
                history('/log_in_teacher');
            }
        } catch (error) {
            alert('Falha no login!');
            history('/log_in_teacher');
            console.error('Erro ao obter dados do professor:', error);
        }
    }

    function handleNewPostFormVisibility() {
        setNewPostFormVisible(!newPostFormVisible);
    }

    async function newPost() {
        if (text === '') {
            alert('Por favor, escreva algo para o post!');
            return;
        }

        
        const formData = new FormData();
        formData.append("teacher_id", String(teacherId));
        formData.append("text", text);
        if (file) {
            formData.append("upload", file); 
        }

        try {
            await api.post('/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setText('');
            setFile(null); // Limpa o estado do arquivo
            alert('Post criado com sucesso!');
        } catch (error) {
            console.error('Erro ao postar:', error);
            alert('Falha ao postar!');
        }
    }

    async function getAvatar(avatarPath: string) {
        try {
            const response = await api.get('/avatar', { params: { route: avatarPath } });
            if (response.status === 200) {
                return response.request.responseURL;
            } else {
                alert('Falha no avatar!');
                console.log(response);
                return '';
            }
        } catch (err) {
            alert('Falha no avatar!');
            console.log(err);
            return '';
        }
    }

    return (
        <div>
            <AreaHeader title="Área do Professor" state={teacherId} asideOpen={asideOpen}/>
            <main id={styles.areaContainer}>
                <aside id={styles.areaAside} ref={asideRef} className={styles.asideClosed}>
                    <i className='fa-solid fa-user' id={styles.iconAside} onClick={() => navigate("/profile_teacher", {state: { teacherId }})}></i>
                    <i className="fa-solid fa-chalkboard-user" id={styles.iconAside} onClick={() => navigate("/student_list", { state: { teacherId } })}></i>
                    <i className="fa-solid fa-chalkboard-user" id={styles.iconAside} onClick={() => navigate("/classes_area", { state: { teacherId } })}></i>
                    <i className="fa-solid fa-right-from-bracket" id={styles.iconAside} onClick={() => navigate("/")}></i>
                </aside>
                <nav className={styles.content}>
                    {!newPostFormVisible && (
                        <div className={styles.newPost} hidden={!newPostFormVisible} onClick={handleNewPostFormVisibility}>
                            Nova publicação
                            <i className="fa-solid fa-plus"></i>
                        </div>
                    )}
                    {newPostFormVisible && (
                        <div className={styles.newPostForm}>
                            <div className={styles.cancel}>
                                <i className="fa-solid fa-xmark" onClick={handleNewPostFormVisibility}></i>
                            </div>
                            <div className={styles.textPost}>
                                <label> O texto da sua publicação: </label>
                                <textarea placeholder="Escreva algo..." value={text} onChange={(e) => { setText(e.target.value)}}/>
                            </div>
                            <div className={styles.imagePost}>
                                <label> O arquivo da sua publicação (opcional) : </label>
                                <div className={styles.uploadContainer}>
                                    <div className={styles.sendContainer}>
                                        <div className={styles.upload}>ESCOLHER ARQUIVO</div>
                                        <input
                                            type="file"
                                            className={styles.uploadInput}
                                            id="uploadInput"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setFile(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button onClick={newPost}>
                                PUBLICAR
                            </button>
                        </div>
                    )}
                </nav>
            </main>
            <Footer />
        </div>
    );
}

export default TeacherArea;
