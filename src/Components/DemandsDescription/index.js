import React from 'react';
import { FaTrash } from 'react-icons/fa';
import TinyButton from '../TinyButton';
import {
  InputField, DescriptionField, FieldsDiv, P, Footer, Title, InputDiv,
  InputsDiv, DescriptionDiv, CenterDiv, DateInput, DateView, ProcessesDiv, ProcessDiv, Button, Icon,
} from './Style';

const DemandsDescription = ({
  name,
  setName,
  process,
  setProcess,
  description,
  setDescription,
  submit,
  cancel,
  buttomName,
  demandDate,
  setDemandDate,
}) => {
  const onProcessChange = (value, index) => {
    const processes = [...process];
    console.log(processes);
    let element = processes[index];
    element = value;

    processes[index] = element;

    setProcess(processes);
  };

  const onDeleteValue = (index) => {
    const processes = [...process];
    let element = processes[index];
    element = '';
    processes[index] = element;

    setProcess(processes);
  };
  return (
    <FieldsDiv>
      <CenterDiv>
        <Title>
          Nova Demanda
        </Title>
        <InputsDiv height="25%">
          <InputDiv width="60%">
            <P>
              Nome:
            </P>
            <InputField placeholder="nome" value={name} onChange={(e) => setName(e.target.value)} />
          </InputDiv>
          <ProcessesDiv>
            <P>
              Processo:
            </P>
            <ProcessDiv>
              <InputField placeholder="Nº do processo" value={process[0]} onChange={(e) => onProcessChange(e.target.value, 0)} />
              <Button onClick={() => onDeleteValue(0)}>
                <Icon color="#FF0000">
                  <FaTrash />
                </Icon>
              </Button>
            </ProcessDiv>
            <ProcessDiv>
              <InputField placeholder="Nº do processo" value={process[1]} onChange={(e) => onProcessChange(e.target.value, 1)} />
              <Button onClick={() => onDeleteValue(1)}>
                <Icon color="#FF0000">
                  <FaTrash />
                </Icon>
              </Button>
            </ProcessDiv>
            <ProcessDiv>
              <InputField placeholder="Nº do processo" value={process[2]} onChange={(e) => onProcessChange(e.target.value, 2)} />
              <Button onClick={() => onDeleteValue(2)}>
                <Icon color="#FF0000">
                  <FaTrash />
                </Icon>
              </Button>
            </ProcessDiv>
            <ProcessDiv>
              <InputField placeholder="Nº do processo" value={process[3]} onChange={(e) => onProcessChange(e.target.value, 3)} />
              <Button onClick={() => onDeleteValue(3)}>
                <Icon color="#FF0000">
                  <FaTrash />
                </Icon>
              </Button>
            </ProcessDiv>
            <ProcessDiv>
              <InputField placeholder="Nº do processo" value={process[4]} onChange={(e) => onProcessChange(e.target.value, 4)} />
              <Button onClick={() => onDeleteValue(4)}>
                <Icon color="#FF0000">
                  <FaTrash />
                </Icon>
              </Button>
            </ProcessDiv>
          </ProcessesDiv>
        </InputsDiv>
        <DescriptionDiv>
          <P>
            Descrição:
          </P>
          <DescriptionField rows="5" cols="30" name="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
        </DescriptionDiv>
        {buttomName === 'Cadastrar'
          && (
            <DateView>
              <P>Data:</P>
              <DateInput
                type="date"
                value={demandDate}
                onChange={(e) => setDemandDate(e.target.value)}
              />
            </DateView>
          )}
        <Footer>
          <TinyButton type="secondary" title="Cancelar" click={cancel} />
          <TinyButton type="primary" title={buttomName} click={submit} />
        </Footer>
      </CenterDiv>
    </FieldsDiv>
  );
};

export default DemandsDescription;
