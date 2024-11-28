import React, { useEffect, useState } from 'react'
import styles from './TeacherCard.module.css'
import api from '../../services/api'

interface Teacher {
    id: number,
    avatar: string,
    name:string,
    number:string,
}

const TeacherCard :React.FC<Teacher> = ({id,avatar,name,number}) => {

    const [avatarSrc, setAvatarSrc] = useState('');

    useEffect(() => {
        getAvatar(avatar);
    }, [])

    async function getAvatar(avatarPath: string) {
        try {
            const response = await api.get('/avatar', { params: { route: avatarPath } });
            if (response.status === 200) {
                setAvatarSrc(response.request.responseURL);
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
        <div id={styles.teacherCard}>
            <img src={avatarSrc} />
            <h1>{name}</h1>
            <a href={`https://wa.me/${number}`}>{number}</a>
        </div>
    )
}

export default TeacherCard