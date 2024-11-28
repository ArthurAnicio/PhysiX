import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import UserCard from "../../components/userCard";
import api from "../../services/api";
import "./styles.css";

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
}
function StudentList() {
    const location = useLocation();
    const { teacherId } = location.state || { teacherId: 0 };
    const [users, setUsers] = useState<User[]>([])
    const [stateId, setStateId] = useState(teacherId)
    useEffect(() => {
        searchUsers()
    }, [teacherId, users])
    async function searchUsers(){
        const response = await api.get('/classesTeacher', {params:{teacher_id:teacherId}})
        const updatedUsers = await Promise.all(
            response.data.map(async (userData: any) => {
                const newUser: User = await getUser(userData.user_id);
                const avatarUrl = await getAvatar(newUser.avatar);
                return {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    avatar: avatarUrl
                };
            })
        )
        console.log(updatedUsers)
        setUsers(updatedUsers)
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
    async function getUser(id:Number) : Promise<User> {
        try {
            const response = await api.get('/getUser', {params: {id: id}})
            return response.data as User;
        } catch (err) {
            console.error(err);
            return {id: 0, name:'a', avatar: '', email: ''}
        }
    }
    return(
        <>
        <Header title="Lista de Estudantes" state={stateId}/>
            
            <div id="studentList">
                {users.map((user: User) => (
                    <UserCard key={user.id} userName={user.name} email={user.email} avatarUrl={user.avatar}/>
                ))}
            </div>
           
        <Footer/>
        </>
    )
}
export default StudentList;
