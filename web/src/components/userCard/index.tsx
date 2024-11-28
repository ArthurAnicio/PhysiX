import React from "react";
import Avatar from "../avatar";
import './styles.css'

interface userProps {
    avatarUrl:string,
    userName:string,
    email:string,
}
const UserCard: React.FC<userProps> = ({avatarUrl, userName, email}) =>{
    return(
        <div className="userCard">
            <div>
                <h1>{userName}</h1>
                <p>{email}</p>
            </div>
            <Avatar size="150px" src={avatarUrl} alt={userName}/>
        </div>
    )
}
export default UserCard