import styles from './Message.module.css'
import React,{ useState, useEffect } from 'react'

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
    return(
        <></>
    )
}

export default Message;