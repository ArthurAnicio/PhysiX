import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./StudentArea.module.css";
import AreaHeader from "../../components/areaHeader";
import api from "../../services/api";
import Post from "../../components/post";

// Definição da interface para os posts
interface PostData {
  id: number;
  teacher_id: number;
  text: string;
  created_at: string;
  uploadPath?: string;
}

function StudentArea() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({ user: "", email: "", id: 0, avatar: "" });
  const { userId } = location.state || { userId: 0 };
  const [stateId, setStateId] = useState(userId);
  const asideRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const id = { teacher_id: undefined, user_id: userId };

  useEffect(() => {
    getUser();
    getPosts();
  }, []);

  function asideOpen() {
    if (asideRef.current != undefined) {
      asideRef.current.classList.toggle(styles.asideClosed);
    }
  }

  async function getUser() {
    try {
      const response = await api.get("/getuser", { params: { id: userId } });
      if (response.status === 200) {
        setStateId(response.data.id);
        setUser(response.data);
      } else {
        alert("Falha no login! Por favor tente novamente.");
        navigate("/log_in_student");
      }
    } catch (error) {
      alert("Falha no login!");
      navigate("/log_in_student");
      console.log(error);
    }
  }

  async function getPosts() {
    try {
      const response = await api.get(`/post`);
      if (response.status === 200) {
        setPosts(response.data);
      } else {
        alert("Falha ao buscar os posts!");
      }
    } catch (error) {
      console.error("Erro ao obter posts:", error);
    }
  }

  return (
    <div id={styles.allContainer}>
      <AreaHeader title="Área do Aluno" state={stateId} asideOpen={asideOpen} />
      <main id={styles.areaContainer}>
        <aside
          id={styles.areaAside}
          ref={asideRef}
          className={styles.asideClosed}
        >
          <i
            className="fa-solid fa-user"
            id={styles.iconAside}
            onClick={() => navigate("/profile_student", { state: { userId } })}
          ></i>
          <i
            className="fa-solid fa-chalkboard-user"
            id={styles.iconAside}
            onClick={() => navigate("/teacher_list", { state: { userId } })}
          ></i>
          <i
            className="fa-solid fa-bell"
            id={styles.iconAside}
            onClick={() => navigate("/messages", { state: { userId } })}
          ></i>
          <i
            className="fa-solid fa-right-from-bracket"
            id={styles.iconAside}
            onClick={() => navigate("/")}
          ></i>
        </aside>
        <nav className={styles.content}>
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              id={id}
              isMine={false}
              sync={getPosts}
            />
          ))}
        </nav>
      </main>
    </div>
  );
}

export default StudentArea;
