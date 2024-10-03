import React from "react";
import Avatar from "../avatar";
import './styles.css'

interface userProps {
    avatarUrl:string,
    userName:string,
    email:string,
    accepted:boolean,
    acceptFunction:(inviteId:number) => Promise<void>,
    rejectFunction:(inviteId:number) => Promise<void>,
    invite_id:number
}
const UserCard: React.FC<userProps> = ({avatarUrl, userName, email, accepted,acceptFunction,rejectFunction,invite_id}) =>{
    return(
        <div className="userCard">
            <div>
                <h1>{userName}</h1>
                <p>{email}</p>
                <p>Status: {accepted? 'Aceito':'Não Aceito'}</p>
                <button onClick={()=>acceptFunction(invite_id)}>Aceitar</button>
                <button onClick={()=>rejectFunction(invite_id)}>Rejeitar</button>
            </div>
            <Avatar size="150px" src={avatarUrl} alt={userName}/>
        </div>
    )
}
export default UserCard