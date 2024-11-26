import styles from './invite.module.css';
import api from '../../services/api';
import { InputHTMLAttributes } from 'react';

interface InviteProps extends InputHTMLAttributes<HTMLInputElement>{
    invite_id: number;
    user_id: number;
    teacher_id: number;
    sync: () => void;
}

const Invite: React.FC<InviteProps> = ({ invite_id, teacher_id, user_id, onChange }) => {
    
    return (
        <div className={styles.invite}>
            
        </div>
    );
}

export default Invite;