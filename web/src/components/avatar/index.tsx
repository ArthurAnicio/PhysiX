import './index.css'
import React, { ImgHTMLAttributes, useEffect } from 'react'
interface AvatarAttributes extends ImgHTMLAttributes<HTMLImageElement>{
    size:string
}
const Avatar:React.FC<AvatarAttributes> = ({size, ...rest}) =>{
    const imgs = document.getElementsByClassName('avatar') as HTMLCollectionOf<HTMLImageElement>;
    useEffect(() => {
        if(imgs){
            Array.from(imgs).forEach(img => {
            img.style.width = size
            img.style.height = size})
        }
    },[imgs]);
    
    return(
        <img className='avatar' {...rest}/>
    )
}
export default Avatar