import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./TeacherItem.module.css";
import api from "../../services/api";
import Submit from "../submit";
import FavoriteButton from "../favoriteButton";
import Star from "../../assets/images/icons/star";

type ReloadFunction = ()=>void;

export interface Teacher {
   
    name: string;
    email:string;
    description: string;
    id: number;
    cost: number;
    number: string;
    avatar:string;
    favorite:boolean;
}
interface TeacherItemProps {
    teacher: Teacher;
    reload: ReloadFunction; 
}
const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, reload}) => {
    const location = useLocation();
    
    async function handleFavorite() {
        if(!teacher.favorite) {
            const {userId} = location.state || 0;
        api.post('/favorite-teacher',{
            user_id:userId,
            teacher_id:teacher.id
        }).then(()=>{
            
        }).catch((err)=>{
            console.log("Falha no favorito!")
            console.log(err)
        })
        }
        else {
            const {userId} = location.state || 0;
            api.delete('/favorite-teacher',{params: {
                user_id: userId,
                teacher_id: teacher.id}}
            ).then(()=>{
               
            }).catch((err)=>{
                console.log("Falha na deleção!")
                console.log(err)
            })
        }
        teacher.favorite =!teacher.favorite;
        reload();
    }

    async function sendInvite() {
        const { userId } = location.state || 0;
        if (!userId) {
            alert('Erro: usuário não encontrado.');
            return;
        }
    
        try {
            console.log(`ids: ${userId}, ${teacher.id}`);
            await api.post('/invite', {
                user_id: userId,
                teacher_id: teacher.id
            });
            alert('Convite enviado!');
        } catch (err) {
            alert(`Erro ao mandar o convite: ${err}`);
        }
    }

    return (
        <div id={styles.teacherCard}>
            <div id={styles.avatarSection}>
            <img id={styles.teacherListAvatar} src={teacher.avatar}></img>
            </div>
            <h1>
            {teacher.name.split(" ")[0]} <br/> {teacher.name.split(" ")[1] || ""}
            </h1>
            <div id={styles.extraData}>
                <button className={styles.sendInvite} onClick={sendInvite}>
                    Solicitar   
                </button>
            </div>
            <div id={styles.desc}>
                {teacher.description || "Este professor não tem uma descrição"}
            </div>
        </div>
    );
}

export default TeacherItem;