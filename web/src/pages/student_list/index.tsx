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
  inviteId: number;
  accepted: boolean;
}
function StudentList() {
  const location = useLocation();
  const { teacherId } = location.state || { teacherId: 0 };
  const [users, setUsers] = useState<User[]>([]);
  const [stateId, setStateId] = useState(teacherId);
  useEffect(() => {
    searchUsers();
  }, [teacherId, users]);
  async function searchUsers() {
    const response = await api.get("/invite", {
      params: { teacher_id: teacherId },
    });
    const invitesData = response.data;
    const updatedUsers = await Promise.all(
      invitesData.map(async (inviteData: any) => {
        const newUser: User = (
          await api.get("/getuser", { params: { id: inviteData.user_id } })
        ).data;
        const avatarUrl = await getAvatar(newUser.avatar);
        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: avatarUrl,
          inviteId: inviteData.id,
          accepted: inviteData.accepted,
        };
      })
    );
    setUsers(updatedUsers);
  }
  async function getAvatar(avatarPath: string) {
    try {
      const response = await api.get("/avatar", {
        params: { route: avatarPath },
      });
      if (response.status === 200) {
        return response.request.responseURL;
      } else {
        alert("Falha no avatar!");
        console.log(response);
        return "";
      }
    } catch (err) {
      alert("Falha no avatar!");
      console.log(err);
      return "";
    }
  }
  async function acceptInvite(inviteId: number) {
    try {
      await api
        .put("/invite", { invite_id: inviteId })
        .then(() => alert("Aceito com sucesso!"));
    } catch (err) {
      alert("Erro em aceitar o solicitação!");
      console.log(err);
    }
  }
  async function declineInvite(inviteId: number) {
    try {
      await api
        .delete("/invite", { params: { id: inviteId } })
        .then(() => alert("Deletado com sucesso!"));
    } catch (err) {
      alert("Erro em rejeitar o solicitação!");
      console.log(err);
    }
  }
  return (
    <>
      <Header title="Lista de Estudantes" state={stateId} />

      <div id="studentList">
        {users.map((user: User) => (
          <UserCard
            userName={user.name}
            avatarUrl={user.avatar}
            email={user.email}
            accepted={user.accepted}
            acceptFunction={acceptInvite}
            rejectFunction={declineInvite}
            invite_id={user.inviteId}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}
export default StudentList;
