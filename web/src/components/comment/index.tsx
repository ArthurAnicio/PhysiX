import React, { useState } from "react";
import styles from './Comment.module.css';
import api from "../../services/api";

interface CommentProps {
    comment: {
        id: number;
        text: string;
        likes: number;
        teacherId?: number;
        userId?: number;
    };
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
    const [likes, setLikes] = useState(comment.likes);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return ""; 
        const isoDateString = dateString.replace(' ', 'T'); 
        const date = new Date(isoDateString);
        
        if (isNaN(date.getTime())) {
            console.error("Data inválida:", dateString); 
            return "";         
        }
        
        return date.toLocaleDateString(); 
    };

    async function like() {
        try {
            await api.put(`likeReply?id=${comment.id}`);
            setLikes((prevLikes) => prevLikes + 1); 
        } catch (error) {
            console.error(error);
        }
    } 

    return (
        <div className={styles.comment}>
            <section className={styles.commentInfo}>
                <div className={styles.commentInfoIMG}></div>
                <div className={styles.commentInfoPerfil}></div>
            </section>
            <section className={styles.commentText}>
                <p>{comment.text}</p>
            </section>
            <section className={styles.reaction}>
                <div className={styles.like}>
                    <i className="fa-solid fa-thumbs-up" onClick={like}></i>
                    <p>{likes}</p>
                </div>
            </section>
        </div>
    );
};

export default Comment;
