import React, { useState, useEffect } from "react";
import styles from "./Post.module.css";
import Comment from "../comment";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

interface Post {
  id: number;
  teacher_id: number;
  text: string;
  created_at: string;
  upload?: string;
  likes?: number;
}

interface Id {
  teacher_id?: number | 0;
  user_id?: number | 0;
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
  id: Id;
  isMine: boolean;
  sync: () => void;
}

interface LikeData {
  post_id: number;
  user_id?: number | 0;
  teacher_id?: number | 0;
}

const Post: React.FC<PostProps> = ({ post, id, isMine, sync }) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState<LikeData[]>([]);
  const hasUpload = !!post.upload;
  const [avatar, setAvatar] = useState("");
  const [postUpload, setUpload] = useState("");
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    id: 0,
    avatar: "",
    number: "",
    password: "",
    schedule: null,
  });

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  // pega os comentários e o os likes assim que o componente terminar de montar pra já aparecer o número
  useEffect(() => {
    fetchComments();
    fetchLikes();
  }, []);

  useEffect(() => {
    getTeacher();
  }, []);

  useEffect(() => {
    if (teacher.avatar) {
      getAvatar(teacher.avatar);
    }
  }, [teacher.avatar]);

  useEffect(() => {
    getUpload(post.upload);
  }, [post.upload]);

  async function getTeacher() {
    try {
      const response = await api.get("/getTeacher", {
        params: { id: post.teacher_id },
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

  async function getUpload(uploadPath: string | undefined) {
    if (uploadPath) {
      try {
        const response = await api.get("/getUploads", {
          params: { route: uploadPath },
        });
        if (response.status === 200) {
          setUpload(response.request.responseURL);
        } else {
          alert("Falha no upload do post!");
          console.log(response);
        }
      } catch (err) {
        alert("Falha no upload do post!");
        console.log(err);
      }
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
      console.log('o id aqui em baixo')
      console.log(id)
      const response = await api.post("/reply", {
        post_id: post.id,
        text: newComment,
        teacher_id: id.teacher_id,
        user_id: id.user_id,
      });
      await api.put(`/replyPost?post_id=${post.id}`);
      console.log('novo comentario aqui em baixo')
      console.log(response.data);
      fetchComments();
      setNewComment("");
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await api.get("/likePost", {
        params: { post_id: post.id },
      });
      if (response.status === 200) {
        const like = JSON.parse(response.data);
        setLikes(like);
      } else {
        alert("Falha ao buscar likes!");
        console.log(response);
      }
    } catch (error) {
      console.error("Not server error fetching likes:", error);
    }
  };

  const handleLike = async () => {
    let updatedLikes;

    // se o usuário já tiver dado like, ele simplesmente remove o like, caso o contrário, adiciona o like
    if (
      likes.filter(
        (like) => (
          like.post_id == post.id,
          like.user_id == id.user_id,
          like.teacher_id == id.teacher_id
        )
      ).length > 0
    ) {
      updatedLikes = likes.filter(
        (like) => (
          like.post_id != post.id,
          like.user_id != id.user_id,
          like.teacher_id != id.teacher_id
        )
      );
      setLikes(updatedLikes);
    } else {
      const newLike: LikeData = {
        post_id: post.id,
        user_id: id.user_id,
        teacher_id: id.teacher_id,
      };
      updatedLikes = [...likes, newLike];
      setLikes(updatedLikes);
    }
    try {
      await api.put(`/likePost?post_id=${post.id}`, {
        likes: JSON.stringify(updatedLikes),
      });
    } catch (e) {
      console.error("Error handling like:", e);
    }
  };

  function handleShowComments() {
    setShowComments(!showComments);
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const isoDateString = dateString.replace(" ", "T");
    const date = new Date(isoDateString);
    return date.toLocaleDateString();
  };

  function deletePost() {
    api.delete(`/post?id=${post.id}`).then(() => {
      sync();
    });
  }

  return (
    <div className={styles.post}>
      <section className={styles.postInfo}>
        <div
          className={styles.teachersInfo}
          onClick={() =>
            navigate("/teacher_posts", {
              state: { teacherId: post.teacher_id, id },
            })
          }
        >
          <img src={avatar} className={styles.postInfoIMG} />
          <div className={styles.postInfoPerfil}>
            {teacher.name.split(" ")[0]}
          </div>
        </div>
        <div className={styles.date}>
          Postado em {formatDate(post.created_at.toString())}
        </div>
        {isMine && (
          <div className={styles.postDelete}>
            <nav className={styles.reaction} onClick={deletePost}>
              <i className="fa-solid fa-trash"></i>
            </nav>
          </div>
        )}
      </section>
      <section className={styles.postText}>
        <p>{post.text}</p>
      </section>
      {hasUpload && (
        <section className={styles.upload}>
          <img src={postUpload} alt="Post upload" />
        </section>
      )}
      <section className={styles.reactions}>
        <nav className={styles.reaction}>
          <i className="fa-solid fa-thumbs-up" onClick={handleLike}></i>
          <p>{likes.length}</p>
        </nav>
        <div className={styles.reaction} onClick={handleShowComments}>
          <i className="fa-solid fa-comment"></i>
          <p>{comments.length}</p>
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
              <Comment key={comment.id} comment={comment}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
