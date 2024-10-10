import React, { useState } from "react";
import styles from './Post.module.css';
import Comment from "../comment";

interface Post {
    id: number;
    teacherId: number;
    text: string;
    createdAt: string;
    uploadPath?: string;
}

interface PostProps {
    post: Post;
}

const Post: React.FC<PostProps> = ({ post }) => {
    const [showComents, setShowComents] = useState(false);
    const hasUpload = !!post.uploadPath;

    function handleShowComents() {
        setShowComents(prevShowComents => !prevShowComents);
    }

    return (
        <div className={styles.post}>
            <section className={styles.postInfo}>
                <div className={styles.teachersInfo}>
                    <div className={styles.postInfoIMG}></div>
                    <div className={styles.postInfoPerfil}> {post.teacherId} </div>
                </div>
                <div className={styles.date}>
                    Postado em {new Date(post.createdAt).toLocaleDateString()}
                </div>
            </section>
            <section className={styles.postText}>
                <p>{post.text}</p>
            </section>
            {hasUpload && (
                <section className={styles.upload}>
                    <img src={post.uploadPath} alt="Post upload" />
                </section>
            )}
            <section className={styles.reactions}>
                <nav className={styles.reaction}>
                    <p>0</p>
                    <i className="fa-solid fa-thumbs-up"></i>
                </nav>
                <nav className={styles.reaction}>
                    <p>0</p>
                    <i onClick={handleShowComents} className="fa-solid fa-comment-dots"></i>
                </nav>
            </section>
            {showComents && (
                <section className={styles.comments}>
                    <div className={styles.commenting}>
                        <input type="text" placeholder="Deixe um comentário..." />
                        <button>
                            <i className="fa-solid fa-share"></i>
                        </button>
                    </div>
                    <Comment />
                    <Comment />
                    <Comment />
                </section>
            )}
        </div>
    );
};

export default Post;
