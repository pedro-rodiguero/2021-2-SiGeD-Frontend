import React, { useState } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { createDemandUpdate, DemandUploadFile } from '../../Services/Axios/demandsServices';
import TinyButton from '../TinyButton';
import {
  Card, TopSide, BottomSide, TextareaComp,
  CheckboxContainer, CheckboxDiv, ButtomDiv, ModalContainer, Form, ButtonsContainer,
} from './Style';
import {
  Primary as AlternativeButton,
} from '../TinyButton/Style';
import UploadInput from '../UploadInput';
import colors from '../../Constants/colors';
import { useProfileUser } from '../../Context';

const NewUpdateCard = ({
  demand, getDemandApi, changeState, setChangeState,
}) => {
  const [description, setDescription] = useState('');
  const [visibilityRestriction, setVisibilityRestriction] = useState(true);
  const [important, setImportant] = useState(false);
  const [uploadFile, setUploadFile] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const { user, startModal } = useProfileUser();

  const submit = () => {
    createDemandUpdate(user.name, user.sector, user._id, description,
      visibilityRestriction, demand._id, important, startModal);
    getDemandApi();
    setDescription('');
  };

  const submitForm = () => {
    if (uploadFile) {
      const info = {
        userName: user.name,
        userSector: user.sector,
        userID: user._id,
        description: uploadFile.name,
        important,
        visibility: visibilityRestriction,
      };

      DemandUploadFile(demand._id, startModal, uploadFile, info);
      setUploadFile('');
      setOpenModal(false);

      setTimeout(() => {
        getDemandApi();
        setDescription('');
      }, 1500);
    } else {
      setOpenModal(true);
    }
  };

  const cancelSubmitForm = (event) => {
    event.preventDefault();
    setOpenModal(false);
    setUploadFile();
    setDescription('');
  };

  return (
    <Card>
      <TopSide>
        <TextareaComp
          rowsMax={4}
          rowsMin={3}
          aria-label="maximum height"
          placeholder=" Insira uma atualização de demanda."
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </TopSide>
      <BottomSide>
        <CheckboxDiv>
          <CheckboxContainer>
            <FormControlLabel
              control={
                (
                  <Checkbox
                    value={visibilityRestriction}
                    defaultChecked
                    onClick={() => setVisibilityRestriction(!visibilityRestriction)}
                    inputProps={{ 'aria-label': 'Checkbox A' }}
                    style={{ color: `${colors.navHeaders}` }}
                  />
                )
              }
              label="Visível somente para o meu setor"
            />
          </CheckboxContainer>
          <CheckboxContainer>
            <FormControlLabel
              control={
                (
                  <Checkbox
                    value={important}
                    onClick={() => setImportant(!important)}
                    inputProps={{ 'aria-label': 'Checkbox A' }}
                    style={{ color: `${colors.navHeaders}` }}
                  />
                )
              }
              label="Importante"
            />
          </CheckboxContainer>
        </CheckboxDiv>
        {openModal
          && (
          <ModalContainer>
            <Form onSubmit={submitForm}>
              <UploadInput
                accept=".pdf"
                fileName={(uploadFile && uploadFile?.name) || ''}
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])} />
              <ButtonsContainer>
                <AlternativeButton
                  type="button"
                  onClick={cancelSubmitForm}
                  style={{
                    background: `${colors.alertMessages}`,
                    width: '100%',
                    padding: '0% 3% 0% 3%',
                  }}>
                  Cancelar
                </AlternativeButton>

                <AlternativeButton
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0% 3% 0% 3%',
                  }}>
                  Enviar
                </AlternativeButton>

              </ButtonsContainer>

            </Form>
          </ModalContainer>
          )}

        <ButtomDiv>
          <TinyButton
            type="secundary"
            title="Anexar PDF"
            click={() => { setOpenModal(true); }}
            style={{
              width: 'max-content',
              padding: '0% 3% 0% 3%',
            }}
          />
          <TinyButton
            type="primary"
            title="Adicionar Atualização"
            click={() => { submit(); setChangeState(!changeState); }}
            style={{
              width: 'max-content',
              padding: '0% 3% 0 3%',
            }}
          />
        </ButtomDiv>
      </BottomSide>
    </Card>
  );
};

export default NewUpdateCard;
