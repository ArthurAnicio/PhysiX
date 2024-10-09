import React, { useState } from "react";
import styles from './Comment.module.css';

function Comment(){

    return(
        <div className={styles.comment}>
            <section className={styles.commentInfo}>
                <div className={styles.commentInfoIMG}></div>
                <div className={styles.commentInfoText}> Teste </div>
            </section>
            <section className={styles.commentText}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consectetur, metus vel pellentesque fermentum, velit justo sollicitudin nunc, id viverra neque nunc vel est. Nulla facilisi. Sed viverra, velit id viverra bibendum, justo arcu consectetur quam, vel pharetra felis tellus ac velit. Sed vel metus id neque sagittis fringilla. Donec at enim vel eros fermentum </p>
            </section>
            <section className={styles.like}>
                <i className="fa-solid fa-thumbs-up"></i>
                <p>0</p>
            </section>
        </div>
    )

}

export default Comment;