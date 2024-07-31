import React, {useEffect, useState} from "react";
import Star from "../../assets/images/icons/star";
import "./styles.css";

interface FavoriteProps {
    teacherid: number;
    classname: string;
  }
const FavoriteButton: React.FC<FavoriteProps> = ({teacherid, classname}) => {
    return(
        <button id={`favoriteButton${teacherid}`} className={`favoriteButton ${classname}`} onClick={()=>{}}>
            <Star/>
        </button>
    )
}
export default FavoriteButton