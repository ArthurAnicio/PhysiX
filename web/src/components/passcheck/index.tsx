import React, { InputHTMLAttributes, SetStateAction, Dispatch } from 'react'
import styles from "./passcheck.module.css";

interface PassCheckProps  {
    setCorrect: Dispatch<SetStateAction<boolean>>;
    password: string;
}


const PassCheck: React.FC<PassCheckProps> = ({ setCorrect,password }) => {
    let passArr = Array.from(password)


    let upperC: boolean = false;
    let specialC: boolean = false;
    let sizeC: boolean = false;
    
    if (passArr.find(p=>p.toUpperCase() == p) != undefined && passArr.find(p=>p.toLowerCase() == p) != undefined) {
        upperC = true;
    } else {
        upperC = false;
    }

    if (passArr.length >= 8) {
        sizeC = true;
    } else {
        sizeC = false;
    }

    if (passArr.find(p=>/[^a-zA-Z0-9]/.test(p)) != undefined){
        specialC = true;
    } else {
        specialC = false;
    }

    if(specialC && sizeC && upperC){
        setCorrect(true)
    } else {
        setCorrect(false)
    }

    return (
        <div id={styles.boxdiv}>
           <div> 
            {sizeC ? `✔️` : `❌`}
            <p id={styles.checks}>Possui 8 ou mais caracteres</p>
           </div>
           <div> 
           {specialC ? `✔️` : `❌`}
            <p id={styles.checks}>Possui pelo menos 1 caractere especial (!,+,$)</p>
           </div> 
           <div> 
           {upperC ? `✔️` : `❌`}
            <p id={styles.checks}>Possui minúsculas e maiúsculas</p>
           </div>  
        </div>
      );
  }
  
  export default PassCheck;