import { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import UserCard from "../../components/userCard";
import api from "../../services/api";
import './styles.css';

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
}
function StudentList() {
    const location = useLocation();
    const teacherId = location.state.id || 0
    const [users, setUsers] = useState<User[]>([])
    useEffect(() => {
        searchUsers()
    }, [teacherId, users])
    async function searchUsers(){
        const response = await api.get('/favorite-user', {params:{teacher_id:teacherId}})
        const usersData = response.data
        const updatedUsers = await Promise.all(
            usersData.map(async (userData: any) => {
                const avatarUrl = await getAvatar(userData.avatar);
                return {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    avatar: avatarUrl
                }
            })
        )
        setUsers(updatedUsers)
        console.log(users)
    }
    async function getAvatar(avatarPath: string) {
        try {
            const response = await api.get('/avatar', { params: { route: avatarPath } });
            if (response.status === 200) {
                return response.request.responseURL;
            } else {
                alert('Falha no avatar!');
                console.log(response);
                return '';
            }
        } catch (err) {
            alert('Falha no avatar!');
            console.log(err);
            return '';
        }
    }
    return(
        <>
        <Header title="Lista de Estudantes" path="/"/>
            
            <div id="studentList">
                {users.map((user:User) => (
                    <UserCard userName={user.name} avatarUrl={user.avatar} email={user.email}/>
                ))}
            </div>
           
        <Footer/>
        </>
    )
}
export default StudentList;