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
        <div>
          <table style={{ visibility: (isPassValid() || !password) && 'hidden' }}>
            <tr>
              <td>
                As senhas devem:
                <div style={{ color: 'red', padding: 0, visibility: (password === confirmPassword || !password) && 'hidden' }}>Ser iguais</div>
                <div style={{ color: 'red', padding: 0, visibility: (isPassLengthValid() || !password) && 'hidden' }}>Conter ao menos 6 caracteres</div>
              </td>
            </tr>
          </table>
        </div>
        <InputDiv>
          <InputIcon>
            <FaLock />
          </InputIcon>
          <Input
            placeholder="Senha"
            type="password"
            onChange={(text) => setPassword(text.target.value)}
            value={password || ''} />
        </InputDiv>
        <InputDiv>
          <InputIcon>
            <FaLock />
          </InputIcon>
          <Input
            placeholder="Confirmar Senha"
            type="password"
            onChange={(text) => setConfirmPassword(text.target.value)}
            value={confirmPassword || ''} />
        </InputDiv>
        <BigButton title="Salvar" type="primary" changeButton={() => isPassValid() && handleChangePassword(password, confirmPassword)} />
      </CenterContainer>
    </BackgroundContainer>
  );
};

export default ChangePasswordScreen;
