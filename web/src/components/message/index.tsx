import styles from './Message.module.css'
import React,{ useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import api from '../../services/api';

interface MessageItem{
    id: number;
    teacher_id: number;
    user_id: number;
    message: string;
    type: string;
    price: string;
}

interface MessageProps{
    message: MessageItem;
    sync: ()=>void;
}

const Message: React.FC<MessageProps> = ({message, sync}) => {
    
    const [avatar, setAvatar] = useState("");
    const [teacher, setTeacher] = useState({
        name: "",
        email: "",
        id: 0,
        avatar: "",
        number: "",
        password: "",
        schedule: null,
    });
    async function getTeacher() {
        try {
          const response = await api.get("/getTeacher", {
            params: { id: message.teacher_id },
          });
          if (response.status === 200) {
            setTeacher(response.data);
          } else {
            alert("Falha.");
          }
        } catch (error) {
          console.log(error);
        }
    }
    async function getAvatar(avatarPath: string) {
        try {
          const response = await api.get("/avatar", {
            params: { route: avatarPath },
          });
          if (response.status === 200) {
            setAvatar(response.request.responseURL);
          } else {
            alert("Falha no avatar!");
            console.log(response);
          }
        } catch (err) {
          alert("Falha no avatar!");
          console.log(err);
        }
      }
    
    return(
        <div className={styles.message}>
            <p>{message.message}</p>
            <p>Teacher ID: {message.teacher_id}</p>
            <p>User ID: {message.user_id}</p>
            <p>Type: {message.type}</p>
            <p>Price: {message.price}</p>
            <button onClick={()=>sync()}>Sync</button>
        </div>
    )
}

export default Message;