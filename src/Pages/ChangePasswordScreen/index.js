import { React, useState } from 'react';
import { FaLock } from 'react-icons/fa';
import BigButton from '../../Components/BigButton';
import { useProfileUser } from '../../Context';
import {
  Title, BackgroundContainer, CenterContainer, InputDiv, InputIcon, Input,
} from './Style';

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const { handleChangePassword } = useProfileUser();

  const isPassLengthValid = () => password?.length >= 6;
  const isPassValid = () => !!password && (password === confirmPassword && isPassLengthValid());

  return (
    <BackgroundContainer>
      <CenterContainer>
        <Title>Altere sua senha</Title>
        <p style={{ color: 'red', padding: 0, visibility: password === confirmPassword && 'hidden' }}>As senhas são diferentes</p>
        <p style={{ color: 'red', padding: 0, visibility: (isPassLengthValid() || !password) && 'hidden' }}>A senha deve ter ao menos 6 caracteres</p>
        <InputDiv>
          <InputIcon>
            <FaLock />
          </InputIcon>
          <Input
            placeholder="Senha"
            type="password"
            onChange={(text) => setPassword(text.target.value)}
            value={password || ''}
          />
        </InputDiv>

        <InputDiv>
          <InputIcon>
            <FaLock />
          </InputIcon>
          <Input
            placeholder="Confirmar Senha"
            type="password"
            onChange={(text) => setConfirmPassword(text.target.value)}
            value={confirmPassword || ''}
          />
        </InputDiv>

        <BigButton title="Salvar" type="primary" changeButton={() => isPassValid() && handleChangePassword(password, confirmPassword)} />
      </CenterContainer>
    </BackgroundContainer>
  );
};

export default ChangePasswordScreen;
