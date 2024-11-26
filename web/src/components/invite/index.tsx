import styles from './invite.module.css';
import api from '../../services/api';
import { InputHTMLAttributes } from 'react';

interface InviteProps extends InputHTMLAttributes<HTMLInputElement>{
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}