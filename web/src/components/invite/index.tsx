import styles from './invite.module.css';
import api from '../../services/api';
import { InputHTMLAttributes } from 'react';

interface Invite{
    id: number;
    user_id: number;
    teacher_id: number;
    schedule: string;
}

interface User{
    id: number;
    name: string;
    avatar: string;
}

interface InviteProps extends InputHTMLAttributes<HTMLInputElement>{
    invite: Invite;
    sync: () => void;
}

const Invite: React.FC<InviteProps> = ({ invite, onChange }) => {
    
    return (
        <div className={styles.invite}>
            <div className={styles.perfil}>
                <div className={styles.foto}></div>
                <div className={styles.nome}>Nome</div>
            </div>
            <div className={styles.agenda}>
                <label className={styles.diaSemana}>Domingo</label>
                <div className={styles.horario}>
                    <label>De:</label>
                    <label>Até:</label>
                </div>
            </div>
            <div className={styles.botoes}>
                <div className={styles.aceitar}>
                    <i className="fa-solid fa-check"></i>
                </div>
                <div className={styles.recusar}>
                    <i className="fa-solid fa-times"></i>
                </div>
            </div>
        </div>
    );
}

export default Invite;