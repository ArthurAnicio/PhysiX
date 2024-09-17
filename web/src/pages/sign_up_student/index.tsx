import React, { useState, useEffect, MouseEventHandler, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUpStu.module.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import TextBox from "../../components/textbox";
import Submit from "../../components/submit";
import api from "../../services/api";
import PassCheck from "../../components/passcheck";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")


function SignUpStudent() {

const generatedPasswordElement = useRef<HTMLDivElement>(null)
const generatePasswordContainer = useRef<HTMLDivElement>(null)
const lengthInput = useRef<HTMLInputElement>(null)
const lettersInput = useRef<HTMLInputElement>(null)
const numbersInput = useRef<HTMLInputElement>(null)
const symbolsInput = useRef<HTMLInputElement>(null)
const copyPasswordButton = useRef<HTMLButtonElement>(null)
const generatedPasswordH4 = useRef<HTMLHeadingElement>(null)
const [stateId, setStateId] = useState(0)






const generatePassword = function () {
  
  

  let password = "";

  const getLetterLowerCase = function () {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  };
  
  const getLetterUpperCase = function () {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  };
  
  const getNumber = function () {
    return Math.floor(Math.random() * 10).toString();
  };
  
  const getSymbol = function () {
    const symbols = "!@#$%^&*()_+=-[]{}|;:,.<>/?";
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  let passwordLength = 0

  if (lengthInput.current != undefined) {
    passwordLength = parseInt(lengthInput.current.value);
  }
  
  

  const generators: any[] = [];

  if (lettersInput.current != undefined) {
    if (lettersInput.current.checked) {
      generators.push(getLetterLowerCase, getLetterUpperCase);
    }
  }

  if (numbersInput.current!= undefined) {
    if (numbersInput.current.checked) {
      generators.push(getNumber);
    }
  }

  if (symbolsInput.current!= undefined) {
    if (symbolsInput.current.checked) {
      generators.push(getSymbol);
    }
  }

  if (generators.length == 0) {
    return;
  }

  for (let i = 0; i < passwordLength; i = i + generators.length) {
    
    console.log(i)
    
    generators.forEach(() => {
      const randomValue =
        generators[Math.floor(Math.random() * generators.length)]();

      password += randomValue;
    });
  }

  password = password.slice(0, passwordLength);

  if (generatedPasswordElement.current != undefined) {
  generatedPasswordElement.current.classList.remove("hide");
  }

  if (generatedPasswordH4.current != undefined) {
  generatedPasswordH4.current.innerText = password;
  }

  
};

function openCloseGenerator() {

  if (generatedPasswordElement.current != undefined) {
    generatedPasswordElement.current.classList.toggle(styles.hide)

    console.log(generatedPasswordElement)
  }

  if (generatePasswordContainer.current != undefined) {
    generatePasswordContainer.current.classList.toggle(styles.hide)

    console.log(generatePasswordContainer)
  }

}

  const history = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [email, setEmail] = useState('')
  
  function signUp() {
    if(passwordCorrect === false){
      alert('Por favor complete todos os requisitos!');
      return;
    }
    api.post('/user',{
      name,
      email,
      password,
    }).then(() => {
      alert('Cadastro realizado com sucesso!');
      history('/log_in_student')
    }).catch((err) => {
      alert('Erro no cadastro!');
      console.log(err);
    })
  } 
  
  return ( 
    <div className={styles.signUpBody}>
      <Header state={stateId} title="Cadastro Estudante"/>
      <div id={styles.signUpContainer}>
        <div id={styles.signUpWindow}>
          <header><img src={smlIcon} width="70px"/></header>
          <section id={styles.inputsMain}>
          <h1>Usuário</h1>
          <TextBox type="text" value={name} onChange={(e) => {setName(e.target.value)}}/>
          <h1>Email</h1>
          <TextBox type="text" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
          <h1>Senha</h1>
          <TextBox type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
          <PassCheck password={password} setCorrect={setPasswordCorrect}/>
          <p id={styles.createPassTxt} >Quer ajuda para criar uma senha segura?<br />
          <span id={styles.purpleLink} onClick={openCloseGenerator}>Clique aqui</span></p>
          
          <div id={styles.generateOptions} ref={generatePasswordContainer} className={styles.hide}>
          <p>Selecione as opções que você deseja:</p>
          <div className="form-control">
            <label >Quantidade de caracteres:</label>
            <input type="text" id={styles.length} ref={lengthInput} name="length" placeholder="10" />
          </div>
          <div className="form-control">
            <label >Letras:</label>
            <input type="checkbox" id={styles.letters} ref={lettersInput} name="letters" />
          </div>
          <div className="form-control">
            <label >Números:</label>
            <input type="checkbox" id={styles.numbers} ref={numbersInput} name="numbers" />
          </div>
          <div className="form-control">
            <label >Símbolos:</label>
            <input type="checkbox" id={styles.symbols} ref={symbolsInput} name="symbols" />
          </div>
          <button id={styles.generatePassword} onClick={generatePassword}>Criar senha</button>
        </div>
        <div id={styles.generatedPassword} ref={generatedPasswordElement} className={styles.hide}>
          <p>Aqui está a sua senha:</p>
          <h4 ref={generatedPasswordH4}></h4>
          <button id={styles.copyPassword}>Copiar</button>
        </div>

          <Submit className={styles.btn} label="Cadastrar" onClick={signUp}/>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default SignUpStudent;
