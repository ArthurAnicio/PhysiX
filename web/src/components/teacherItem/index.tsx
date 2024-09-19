import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./styles.css";
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
        <div id="teacherCard">
            <div id="teacherCardName">
                <h1>{teacher.name}</h1>
                <img id="teacherListAvatar" src={teacher.avatar}></img>
            </div>
            <div id="extraData">
                <p>{teacher.email}</p>
                <p>R${teacher.cost.toString().replace('.',',')}</p>
                <p>{teacher.number}</p>
                <button className="sendInvite" onClick={sendInvite}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                </button>
                <button id={`favoriteButton${teacher.id}`} className={`favoriteButton ${teacher.favorite ? "favoriteEnable":"favoriteDisable"}`} onClick={handleFavorite}>
                    <Star/>
                </button>
            </div>
            <div id="desc">
                {teacher.description}
            </div>
            
        </div>
    );
}

export default TeacherItem;