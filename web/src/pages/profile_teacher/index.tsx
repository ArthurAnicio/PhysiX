import styles from  './ProfileTeacher.module.css';
import Header from "../../components/header";
import Footer from "../../components/footer";
import TextBox from "../../components/textbox";
import api from "../../services/api";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AvatarCropper from '../../components/cropper';

function ProfileTeacher() {
    const location = useLocation();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState({ name: '', email: '', id: 0, avatar: '',number:'', password: '', schedule: null });

    const [isEditable, setIsEditable] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false); 
    const [showNewPassword, setShowNewPassword] = useState(false); 
    const { teacherId } = location.state || { teacherId: 0 };
    const [stateId, setStateId] = useState(teacherId)

    const [isCropping, setIsCropping] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<File | null>(null);
    const [imgsrc, setImgsrc] = useState('');

    useEffect(() => {
        getTeacher();
    }, [teacherId]);

    useEffect(() => {
        if (teacher.avatar) {
            getAvatar(teacher.avatar);
        }
    }, [teacher.avatar]);  

    async function getTeacher() {
        //console.log(teacherId);
        try {
            
            const response = await api.get('/getTeacher', { params: { id: teacherId } });
            if (response.status === 200) {
                console.log(response.data)
                setTeacher(response.data);
                setNewUsername(response.data.name);
                setNewEmail(response.data.email);
                setNewNumber(formatPhoneNumber(response.data.number));
                setStateId(response.data.id)
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

    const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageToCrop(file);
            setIsCropping(true); 
        } else {
            alert('Por favor, escolha somente imagens!');
        }
    };

    const handleCroppedImage = (croppedImage: Blob) => {
        setIsCropping(false);
        sendAvatar(croppedImage); 
    };

    

    const sendAvatar = async (blob: Blob) => {
        const formData = new FormData();
        formData.append("id", teacher.id.toString());
        formData.append("avatar", blob, 'avatar.png');
        try {
            const response = await api.post("/teacher-avatar", formData);
            if (response.status === 200) {
                alert("Avatar atualizado com sucesso!");
                getTeacher(); 
            } else {
                alert("Falha no envio do avatar!");
            }
        } catch (err) {
            alert("Erro ao enviar avatar!");
            console.log(err);
        }
    };

    function handleEditClick() {
        setIsEditable(!isEditable);
        setNewUsername(teacher.name);
        setNewEmail(teacher.email);
        setNewNumber(formatPhoneNumber(teacher.number));   
        setOldPassword('');
        setNewPassword('');
    }

    function toggleOldPasswordVisibility() {
        setShowOldPassword(!showOldPassword);
    }
    function toggleNewPasswordVisibility() {
        setShowNewPassword(!showNewPassword);
    }

    function formatPhoneNumber(number: string): string {
        const cleaned = number.replace(/\D/g, ''); // Remove caracteres não numéricos
        const limited = cleaned.slice(0, 13); // Limita o número de caracteres

        const match = limited.match(/^(\d{2})(\d{2})(\d{5})(\d{0,4})$/);

        if (match) {
            const [, country, area, part1, part2] = match;
            return `+${country} (${area}) ${part1}${part2 ? `-${part2}` : ''}`;
        }

        return limited;
    }

    function removeMask(value: string): string {
        return value.replace(/\D/g, '');
    }

    async function updateProfile() {
        try {
            if (newUsername != teacher.name || newEmail != teacher.email || newNumber != teacher.number){ // usuário não atualiza se email/usuário/número não mudar (e.g. se quiser mudar só a senha)
                const response = await api.put(`/updateteacher?id=${teacher.id}`, {
                    name: newUsername,
                    email: newEmail,
                    number: removeMask(newNumber),
                });

                if (response.status === 200) {
                    alert('Perfil atualizado com sucesso!');
                    setIsEditable(false);
                    getTeacher();
                } else {
                    alert('Falha na atualização do perfil!');
                }
            }
            if (oldPassword && newPassword) {
                const response = await api.put(`/updateTeacherPassword?id=${teacher.id}`, {
                    oldPassword,
                    newPassword
                });

                if (response.status === 200) {
                    alert('Senha atualizada com sucesso!');
                    setIsEditable(false);
                    getTeacher();
                } else {
                    alert('Falha na atualização da senha!');
                }
            }
            setOldPassword('')
            setNewPassword('');
        } catch (err) {
            alert('Erro ao atualizar perfil!');
            console.log(err);
        }
    }

    return (
        <div className={styles.profileBody}>
            <Header title="Perfil do Professor" state={stateId} />
            <div id={styles.areaContainer}>

                <div className={styles.infoArea}>
                    <header id={styles.profileBoxHeader}><h2>Informações pessoais</h2></header>

                    <main id={styles.cardMain}>
                            {isCropping && (
                                <div>
                                    <AvatarCropper image={imageToCrop} setImage={handleCroppedImage} cancelFunction={() => {setIsCropping(false)}}/>
                                </div>
                            )}  
                            <div className={styles.imgContainer}>
                                <div id={styles.imgBox}> 
                                     <img src={imgsrc} alt="Avatar do estudante" />
                                     {isEditable && !isCropping && (
                                        <div className={styles.sendContainer}>
                                        <div className={styles.upload}><i className="fa-solid fa-file-arrow-up"></i></div>
                                        <input
                                        type="file"
                                        className={styles.uploadInput}
                                        id="uploadInput"
                                        onChange={handleAvatar}
                                        />
                                    </div>
                                )}
                                </div>
                                
                            </div> 
                        <section id={styles.inputsContainer}>
                        <div className={styles.campoInfo}>
                                <label>Nome:</label>
                                <TextBox type="text" disabled={!isEditable} value={newUsername} onChange={(e) => setNewUsername(e.target.value)}/>
                            </div>
                            <div className={styles.campoInfo}>
                                <label>Email:</label>
                                <TextBox type="text" disabled={!isEditable} value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
                            </div>
                            <div className={styles.campoInfo}>
                                <label>Número:</label>
                                <TextBox type="text" disabled={!isEditable} value={newNumber} onChange={(e) => setNewNumber(formatPhoneNumber(e.target.value))}/>
                            </div>
                            { isEditable &&
                                <>
                                    <div className={styles.campoInfo}>
                                        <label>Senha Antiga:</label>
                                        <div className={styles.passwordContainer}>
                                            <TextBox type={showOldPassword ? 'text' : 'password'}
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                disabled={!isEditable} />
                                            {isEditable && (
                                                <button type="button" id={styles.showHidden} onClick={toggleOldPasswordVisibility}>
                                                    {showOldPassword ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" id={styles.iconShowHidden}>  <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" id={styles.iconShowHidden} viewBox="0 0 576 512">  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.campoInfo}>
                                        <label>Senha Nova:</label>
                                        <div className={styles.passwordContainer}>
                                            <TextBox type={showNewPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                disabled={!isEditable} />
                                            {isEditable && (
                                                <button type="button" id={styles.showHidden} onClick={toggleNewPasswordVisibility}>
                                                    {showNewPassword ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" id={styles.iconShowHidden}>  <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" id={styles.iconShowHidden} viewBox="0 0 576 512">  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            }
                            </section>
                            <div className={styles.campoEdit}>
                               <button className={styles.profileBtn} onClick={handleEditClick}>
                                    {isEditable ? 'Cancelar' : 'Editar'}
                                </button>
                                {isEditable && <button className={styles.profileBtn} onClick={updateProfile}>Atualizar</button>} 
                            </div>

                            
                    </main>

                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProfileTeacher;
