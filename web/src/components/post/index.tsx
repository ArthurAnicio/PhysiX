import React, { useState } from "react";
import styles from './Post.module.css';
import Comment from "../comment";

interface Post {}

function Post() {
    const [showComents, setShowComents] = useState(false);
    const hasUpload = true;

    function handleShowComents() {
        setShowComents(prevShowComents => !prevShowComents);
    }

    return (
        <div className={styles.post}>
            <section className={styles.postInfo}>
                <div className={styles.teachersInfo}>
                    <div className={styles.postInfoIMG}></div>
                    <div className={styles.postInfoPerfil}> Teste </div>
                </div>
                <div className={styles.date}>
                    Postado em 01/01/2015
                </div>
            </section>
            <section className={styles.postText}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consectetur, metus vel pellentesque fermentum, velit justo sollicitudin nunc, id viverra neque nunc vel est. Nulla facilisi. Sed viverra, velit id viverra bibendum, justo arcu consectetur quam, vel pharetra felis tellus ac velit. Sed vel metus id neque sagittis fringilla. Donec at enim vel eros fermentum </p>
            </section>  
            {hasUpload && <section className={styles.upload}></section>}      
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
            {showComents && 
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
            }
        </div>
    );
}

export default Post;
