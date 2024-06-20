import './index.css'
import React, { ImgHTMLAttributes } from 'react'
interface AvatarAttributes extends ImgHTMLAttributes<HTMLImageElement>{
    size:string
}
const Avatar:React.FC<AvatarAttributes> = ({size, ...rest}) =>{
    const img = document.getElementsByClassName('avatar')[0] as HTMLImageElement;
    if(img){
        img.style.width = size
        img.style.height = size
    }
    return(
        <img className='avatar' {...rest}/>
    )
}
export default Avatar