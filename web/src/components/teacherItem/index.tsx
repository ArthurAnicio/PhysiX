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