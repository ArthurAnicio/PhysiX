import styles from './Messages.module.css'
import Header from '../../components/header';
import Footer from '../../components/footer';
import Message from '../../components/message';
import { useState, useEffect } from 'react';
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

function Messages(){
    const location = useLocation();
    const { userId } = location.state || { userId: 0 };
    const [messages, setMessages] = useState<MessageItem[]>([]);
    useEffect(() =>{
        fetchMessages();
    })

    function fetchMessages(){
        api.get(`/messages?user_id=${userId}`)
       .then((response) => {setMessages(response.data);console.log(messages)})
       .catch(error => {console.error(error)});
    }

    return(
        <div className={styles.container}>
            <Header state={userId} title={'Suas mensagens'}/>
            <div className={styles.content}>
                {messages.map((message:MessageItem) => <Message key={message.id} message={message} sync={fetchMessages}/>)}
            </div>
            <Footer />
        </div>
    )
}

export default Messages;