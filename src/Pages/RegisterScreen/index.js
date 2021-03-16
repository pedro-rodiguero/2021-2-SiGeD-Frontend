import React, { useEffect, useState } from 'react';
import { IoPersonCircleOutline } from 'react-icons/io5';
import axios from 'axios';
import TinyButton from '../../Components/TinyButton';
import styles from './style';
import RegisterInput from '../../Components/RegisterInput';
import { validateSignUp } from '../../Utils/validations';
import { PassMatches } from '../../Components/ErrorMessage';

const RegisterScreen = () => {
  const [cardName, setCardName] = useState('');
  const [cardEmail, setCardEmail] = useState('');
  const [cardRegister, setCardRegister] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputRegister, setInputRegister] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputConfirmPassword, setInputConfirmPassword] = useState('');
  const [valid, setValid] = useState('');

  async function postUser() {
    try {
      await axios.post('http://localhost:3001/signUp', {
        name: inputName,
        email: inputEmail,
        enroll: inputRegister,
        pass: inputPassword,
      })
        .then((response) => {
          setValid(response);
          console.log(response, valid);
        });
    } catch (error) {
      console.error(error);
    }
  }

  const submit = () => {
    if (validateSignUp(inputEmail, inputName, inputPassword, inputConfirmPassword)) {
      postUser();
    } else {
      alert("Nome deve ser completo, sem números\nEmail deve conter o formato 'nome@email.com'\nSenha deve conter no minimo 6 caracteres\nAs senhas devem ser iguais!");
    }
  };

  const cancel = () => {
    setInputEmail('');
    setInputRegister('');
    setInputName('');
    setInputPassword('');
    setInputConfirmPassword('');
  };

  useEffect(() => {
    if (!inputName) setCardName('Nome');
    else setCardName(inputName);

    if (!inputEmail) setCardEmail('Email');
    else setCardEmail(inputEmail);

    if (!inputRegister) setCardRegister('Registro');
    else setCardRegister(inputRegister);
  }, [inputName, inputEmail, inputRegister]);

  return (
    <div style={styles.main}>

      <div style={styles.container}>

        <div style={styles.sidebar}>
          <IoPersonCircleOutline style={styles.peopleIcon} />

          <div style={styles.sidebarDiv}>
            <p style={styles.sidebarText}>{cardRegister}</p>
            <p style={styles.sidebarText}>{cardName}</p>
            <p style={styles.sidebarText}>{cardEmail}</p>
          </div>

        </div>

        <div style={styles.row}>

          <RegisterInput type="text" title="Nome" setText={setInputName} value={inputName} />

          <RegisterInput type="text" title="Email" setText={setInputEmail} value={inputEmail} />

          <RegisterInput type="text" title="Registro" setText={setInputRegister} value={inputRegister} />

          <RegisterInput type="password" title="Senha" setText={setInputPassword} value={inputPassword} />

          <RegisterInput
            type="password"
            title="Confirmar senha"
            setText={setInputConfirmPassword}
            value={inputConfirmPassword}
          />
          <PassMatches pass={inputPassword} confPass={inputConfirmPassword} />

          <div style={styles.divButtom}>

            <TinyButton type="secondary" title="Cancelar" click={cancel} />

            <TinyButton type="primary" title="Cadastrar" click={submit} />

          </div>

        </div>

      </div>

    </div>
  );
};

export default RegisterScreen;