import React, { useState, useEffect } from "react";
import styles from './Comment.module.css';
import api from "../../services/api";

interface CommentProps {
    comment: {
        id: number;
        text: string;
        likes: number;
        teacherId?: number;
    };
    id: {
        teacher_id?: number;
        user_id?: number;
    };
}

interface LikeData {
    teacherId?: number;
    userId?: number;
    replyId: number;
}

const Comment: React.FC<CommentProps> = ({ comment, id }) => {
    const [likes, setLikes] = useState<LikeData[]>([]);

    // pega o número de likes imediatamente
    useEffect(() => {
        getLikes();
    }, []); 

    const getLikes = async () => {
        try {
            const response = await api.get(`/likeReply?id=${comment.id}`);
            if (response.status === 200) {
                setLikes(JSON.parse(response.data)); 
            }
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    };

    const like = async () => {
        let updatedLikes;
        // se já tiver dado like, remove o like, senão adiciona o like
        if (likes.filter(like => 
            like.replyId == comment.id && 
            like.userId == id.user_id && 
            like.teacherId == id.teacher_id
        ).length > 0) {
            updatedLikes = likes.filter(like => 
                like.replyId != comment.id && 
                like.userId != id.user_id &&
                like.teacherId != id.teacher_id
            );
        } else {
            const newLike: LikeData = {
                userId: id.user_id,
                teacherId: id.teacher_id,
                replyId: comment.id
            };
            updatedLikes = [...likes, newLike];
        }

        setLikes(updatedLikes); 

        try {
            await api.put(`/likeReply?id=${comment.id}`, { likes: JSON.stringify(updatedLikes) });
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

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
                    <p>{likes.length}</p>
                </div>
            </section>
        </div>
    );
};

export default Comment;
