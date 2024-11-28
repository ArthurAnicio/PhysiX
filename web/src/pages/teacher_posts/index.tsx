import styles from './TeacherPosts.module.css'
import Header from '../../components/header'
import Footer from '../../components/footer'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Post from '../../components/post'

interface PostData {
    id: number;
    teacher_id: number;
    text: string;
    created_at: string;
    uploadPath?: string;
  }

function TeacherPosts() {

    const location = useLocation();
    const navigate = useNavigate();
    const { teacherId = 0, id = { teacher_id: undefined, user_id: undefined } } = location.state || {};
    const [isMe,setIsMe] = useState(false);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [techerPosts, setTeacherPosts] = useState<PostData[]>([]);
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
        getTeacher();
        getPosts();
        if (teacherId === id.teacher_id){
          setIsMe(true);
        }
      }, []);

    async function getTeacher() {
        try {
          const response = await api.get("/getTeacher", {
            params: { id: teacherId },
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

    async function getPosts() {
        try {
          const response = await api.get(`/post`);
          if (response.status === 200) {
            setPosts(response.data.filter((post: PostData) => post.id === teacherId));
          } else {
            alert("Falha ao buscar os posts!");
          }
        } catch (error) {
          console.error("Erro ao obter posts:", error);
        }
    }

    return (
        <div>
            <Header state={teacherId} title={'Posts de '+teacher.name} />
            <main className={styles.areaContainer}>
                {posts.map((post: PostData) =>
                    <Post post={post} id={id} isMine={isMe} sync={getPosts}/>    
                )}
            </main>
            <Footer />
        </div>
    )
}

export default TeacherPosts