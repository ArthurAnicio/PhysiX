import './styles.css';
import Header from "../../components/header";
import Footer from "../../components/footer";
import api from "../../services/api";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProfileTeacher() {
    const location = useLocation();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState({ teacher: '', email: '', id: 0, avatar: '',number:'', password: '' });
    const [imgsrc, setImgsrc] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const { teacherId } = location.state || { teacherId: 0 };

    useEffect(() => {
        getTeacher();
    }, []);

    useEffect(() => {
        if (teacher.avatar) {
            getAvatar(teacher.avatar);
        }
    }, [teacher.avatar]);

    async function getTeacher() {
        try {
            console.log(teacherId);
            const response = await api.get('/getTeacher', { params: { id: teacherId } });
            if (response.status === 200) {
                setTeacher(response.data);
            } else {
                alert('Falha no login! Por favor tente novamente.');
                navigate('/log_in_teacher');
            }
        } catch (error) {
            alert('Falha no login!');
            navigate('/log_in_teacher');
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

    async function sendAvatar() {
        const formData = new FormData();
        const fileInput = document.getElementById('avatarSend') as HTMLInputElement | null;
        if (fileInput) {
            try {
                const file = fileInput.files?.[0];
                formData.append('id', teacher.id.toString());
                formData.append('avatar', file || '');
                const response = await api.post('/avatar', formData);

                if (response.status === 200) {
                    alert('Avatar enviado com sucesso!');
                    getTeacher();
                } else {
                    alert('Falha no envio do avatar!');
                    console.log(response);
                }
            } catch (err) {
                alert('Erro ao enviar avatar!');
                console.log(err);
            }
        }
    }

    function handleEditClick() {
        setIsEditable(!isEditable);
    }

    function togglePasswordVisibility() {
        setShowPassword(!showPassword);
    }

    async function updateProfile() {
        try {
            const response = await api.put(`/updateuser?id=${teacher.id}`, {
                name: teacher.teacher,
                email: teacher.email,
                number: teacher.number,
                password: teacher.password,
            });

            if (response.status === 200) {
                alert('Perfil atualizado com sucesso!');
                setIsEditable(false);
                getTeacher();
            } else {
                alert('Falha na atualização do perfil!');
            }
        } catch (err) {
            alert('Erro ao atualizar perfil!');
            console.log(err);
        }
    }

    return (
        <div>
            <Header title="Perfil do Professor" path="/" />
            <div id="area-container">
                <h1>Bem-vindo, {teacher.teacher}</h1>
                <div className="info-area">
                    <h2>Informações pessoais</h2>

                    <div className="info">
                        <div className="img-container">
                           <img id='img-profile' src={imgsrc} alt="Avatar do professor" /> 
                           {isEditable && (
                                <div className="send-container">
                                    <input type="file" id='avatarSend'/>
                                    <button id='send-avatar-btn' onClick={sendAvatar}>Enviar</button>
                                </div>
                           )} 
                        </div>    
                            
                        <section>
                            <div className="campo-info">
                                <label>Nome:</label>
                                <input
                                    id='nome-professor'
                                    className='input-profile'
                                    value={teacher.teacher}
                                    onChange={(e) => setTeacher({ ...teacher, teacher: e.target.value })}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="campo-info">
                                <label>Email:</label>
                                <input
                                    id='email-professor'
                                    className='input-profile'
                                    value={teacher.email}
                                    onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="campo-info">
                                <label>Número:</label>
                                <input
                                    id='number-professor'
                                    className='input-profile'
                                    value={teacher.number}
                                    onChange={(e) => setTeacher({ ...teacher, number: e.target.value })}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="campo-info">
                                <label>Senha:</label>
                                <div className="password-container">
                                    <input
                                        id="senha-professor"
                                        type={showPassword ? 'text' : 'password'}
                                        className='input-profile'
                                        value={teacher.password}
                                        onChange={(e) => setTeacher({ ...teacher, password: e.target.value })}
                                        disabled={!isEditable}
                                    />
                                    <button onClick={togglePasswordVisibility}>
                                        {showPassword ? "Ocultar" : "Mostrar"}
                                    </button>
                                </div>
                            </div>
                            <div className="campo-edit">
                               <button id="edit-profile" onClick={handleEditClick}>
                                    {isEditable ? 'Cancelar' : 'Editar'}
                                </button>
                                {isEditable && <button id='update-profile' onClick={updateProfile}>Atualizar</button>} 
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProfileTeacher;
