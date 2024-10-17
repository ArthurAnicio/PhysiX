import React, { useState, useEffect } from "react";
import styles from './Post.module.css';
import Comment from "../comment";
import api from "../../services/api"; 

interface Post {
    id: number;
    teacher_id: number;
    text: string;
    created_at: string; 
    upload?: string;
    likes?: number;
    replies?: number;
}

interface CommentData {
    id: number;
    postId: number;
    text: string;
    likes: number;
    teacherId?: number;
    userId?: number;
}

interface PostProps {
    post: Post;
}

const Post: React.FC<PostProps> = ({ post }) => {
    console.log(post);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<CommentData[]>([]);
    const [newComment, setNewComment] = useState("");
    const [likes, setLikes] = useState(post.likes || 0); 
    const hasUpload = !!post.upload;
    const [avatar, setAvatar] = useState('');
    const [teacher, setTeacher] = useState({name: '', email: '', id: 0, avatar:'', number:'', password: '', schedule: null})

    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments]);

    useEffect(() => {
        getTeacher()
    }, [])

    useEffect(() => {
        getAvatar(teacher.avatar);
    }, [teacher.avatar])

    async function getTeacher() {
        try{    
            const response = await api.get('/getTeacher', { params: { id: post.teacher_id} });
            if (response.status === 200) {
                console.log(response.data)
                setTeacher(response.data)
            } else {
                alert('Falha.');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getAvatar(avatarPath: string) {
        try {
            const response = await api.get('/avatar', { params: { route: avatarPath } });
            if (response.status === 200) {
                setAvatar(response.request.responseURL);
            } else {
                alert('Falha no avatar!');
                console.log(response);
            }
        } catch (err) {
            alert('Falha no avatar!');
            console.log(err);
        }
    }

    const fetchComments = async () => {
        try {
            const response = await api.get(`/replies?post_id=${post.id}`);
            setComments(response.data);
        } catch (error) {
            console.error("Erro ao buscar comentários:", error);
        }
    };

    const handleCreateComment = async () => {
        if (!newComment) return;

        try {
            const response = await api.post("/reply", {
                post_id: post.id,
                text: newComment,
                teacher_id: post.teacher_id,
            });
            await api.put(`/replyPost?post_id=${post.id}`);
            setComments([response.data, ...comments]);
            setNewComment("");
        } catch (error) {
            console.error("Erro ao criar comentário:", error);
        }
    };

    const like = async () => {
        try {
            await api.put(`/likePost?post_id=${post.id}`);
            setLikes((prevLikes) => prevLikes + 1);
        } catch (error) {
            console.error("Erro ao curtir post:", error);
        }
    };

    function handleShowComments() {
        setShowComments(!showComments);
    }

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return ""; 
        const isoDateString = dateString.replace(' ', 'T');
        const date = new Date(isoDateString);
        return date.toLocaleDateString();
    };

    return (
        <div className={styles.post}>
            <section className={styles.postInfo}>
                <div className={styles.teachersInfo}>
                    <img src={avatar} className={styles.postInfoIMG}/>
                    <div className={styles.postInfoPerfil}>{teacher.name}</div>
                </div>
                <div className={styles.date}>
                    Postado em {formatDate(post.created_at.toString())}
                </div>
            </section>
            <section className={styles.postText}>
                <p>{post.text}</p>
            </section>
            {hasUpload && (
                <section className={styles.upload}>
                    <img src={post.upload} alt="Post upload" />
                </section>
            )}
            <section className={styles.reactions}>
                <nav className={styles.reaction}>
                    <i className="fa-solid fa-thumbs-up" onClick={like}></i>
                    <p>{likes}</p>
                </nav>
                <div className={styles.reaction} onClick={handleShowComments}>
                    <i className="fa-solid fa-comment"></i>
                    <p>{post.replies}</p>
                </div>
            </section>

            {showComments && (
                <div className={styles.commentsSection}>
                    <div className={styles.commenting}>
                        <input
                            type="text"
                            placeholder="Escreva um comentário..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button onClick={handleCreateComment}>
                            <i className="fa-solid fa-share"></i>
                        </button>
                    </div>

                    <div className={styles.comments}>
                        {comments.map((comment) => (
                            <Comment key={comment.id} comment={comment} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
