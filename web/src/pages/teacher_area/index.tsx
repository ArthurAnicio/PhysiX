import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./TeacherArea.module.css";
import AreaHeader from "../../components/areaHeader";
import Footer from "../../components/footer";
import api from "../../services/api";
import Post from "../../components/post";

// Definição da interface para os posts
interface PostData {
    id: number;
    teacher_id: number;
    text: string;
    created_at: string;
    uploadPath?: string;
}

function TeacherArea() {
    const navigate = useNavigate();
    const location = useLocation();
    const { teacherId } = location.state || { teacherId: 0 };
    const asideRef = useRef<HTMLDivElement>(null);

    const [teacherName, setTeacherName] = useState('');
    const [imgsrc, setImgsrc] = useState('');
    const [posts, setPosts] = useState<PostData[]>([]); // Tipagem para o estado de posts
    const [newPostFormVisible, setNewPostFormVisible] = useState(false);
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const id = {teacher_id: teacherId, user_id: undefined}

    useEffect(() => {
        setNewPostFormVisible(false);
        getTeacher();
        getPosts();
    }, []);

    // Função para abrir/fechar o menu lateral
    function asideOpen() {
        if (asideRef.current) {
            asideRef.current.classList.toggle(styles.asideClosed);
        }
    }

    // Função para buscar informações do professor
    async function getTeacher() {
        try {
            const response = await api.get('/getTeacher', { params: { id: teacherId } });
            if (response.status === 200) {
                const { teacher, avatar } = response.data;
                setTeacherName(teacher);
                setImgsrc(await getAvatar(avatar));
            } else {
                alert('Falha no login! Por favor tente novamente.');
                navigate('/log_in_teacher');
            }
        } catch (error) {
            alert('Falha no login!');
            navigate('/log_in_teacher');
            console.error('Erro ao obter dados do professor:', error);
        }
    }

    // Função para criar uma nova postagem
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
            setNewPostFormVisible(false);
            setText('');
            setFile(null);
            getPosts(); // Atualiza os posts após a criação
        } catch (error) {
            console.error('Erro ao postar:', error);
            alert('Falha ao postar!');
        }
    }

    // Função para obter a lista de posts
    async function getPosts() {
        try {
            const response = await api.get(`/post`);
            if (response.status === 200) {
                setPosts(response.data);
            } else {
                alert('Falha ao buscar os posts!');
            }
        } catch (error) {
            console.error('Erro ao obter posts:', error);
        }
    }

    // Função para buscar o avatar do professor
    async function getAvatar(avatarPath: string) {
        try {
            const response = await api.get('/avatar', { params: { route: avatarPath } });
            if (response.status === 200) {
                return response.request.responseURL;
            } else {
                alert('Falha ao buscar avatar!');
                console.log(response);
                return '';
            }
        } catch (error) {
            alert('Falha ao buscar avatar!');
            console.error('Erro ao obter avatar:', error);
            return '';
        }
    }

    return (
        <div>
            <AreaHeader title="Área do Professor" state={teacherId} asideOpen={asideOpen} />
            <main id={styles.areaContainer}>
                <aside 
                    id={styles.areaAside} 
                    ref={asideRef} 
                    className={styles.asideClosed}
                >
                    <div 
                        className={styles.asideCampo}
                        onClick={() => navigate("/profile_teacher", { state: { teacherId } })}
                    >
                        <i
                            className="fa-solid fa-user"
                        ></i>
                        <label>Perfil</label>
                    </div>
                    <div 
                        className={styles.asideCampo}
                        onClick={() => navigate("/student_list", { state: { teacherId } })}
                    >   
                        <i 
                            className="fa-solid fa-book-open"
                        ></i>
                        <label>Aulas</label>
                    </div>
                    <div 
                        className={styles.asideCampo}
                        onClick={() => navigate("/classes_area", { state: { teacherId } })}
                    >   
                        <i 
                            className="fa-solid fa-chalkboard-user"
                        ></i>
                        <label>Agenda</label>
                    </div>
                    <div 
                        className={styles.asideCampo}
                        onClick={() => navigate("/")}
                    >   
                        <i 
                            className="fa-solid fa-right-from-bracket"
                        ></i>
                        <label>Sair</label>
                    </div>
                </aside>

                <nav className={styles.content}>
                    {!newPostFormVisible && (
                        <div className={styles.newPost} onClick={() => setNewPostFormVisible(true)}>
                            Nova publicação
                            <i className="fa-solid fa-plus"></i>
                        </div>
                    )}

                    {newPostFormVisible && (
                        <div className={styles.newPostForm}>
                            <div className={styles.cancel}>
                                <i className="fa-solid fa-xmark" onClick={() => setNewPostFormVisible(false)}></i>
                            </div>
                            <div className={styles.textPost}>
                                <label> O texto da sua publicação: </label>
                                <textarea
                                    placeholder="Escreva algo..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                            </div>
                            <div className={styles.imagePost}>
                                <label> O arquivo da sua publicação (opcional): </label>
                                <div className={styles.uploadContainer}>
                                    <div className={styles.sendContainer}>
                                        <div className={styles.upload}>ESCOLHER ARQUIVO</div>
                                        <input
                                            type="file"
                                            className={styles.uploadInput}
                                            id="uploadInput"
                                            onChange={(e) => e.target.files && setFile(e.target.files[0])}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button onClick={newPost}>PUBLICAR</button>
                        </div>
                    )}

                    {posts.map((post) => (
                        <Post key={post.id} post={post} id={id}/>
                    ))}
                </nav>
            </main>
            <Footer />
        </div>
    );
}

export default TeacherArea;
