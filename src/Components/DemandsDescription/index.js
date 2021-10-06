/* eslint-disable */ 
import React, {useState, useEffect} from 'react';
import TinyButton from '../TinyButton';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import {
  InputField, DescriptionField, FieldsDiv, P, Footer, Title, InputDiv,
  InputsDiv, DescriptionDiv, CenterDiv, DateInput, DateView, ProcessesDiv, ProcessDiv, Button, Icon,
} from './Style';

const DemandsDescription = ({
  name,
  setName,
  processOne,
  setProcessOne,
  processTwo,
  setProcessTwo,
  processThree,
  setProcessThree,
  processFour,
  setProcessFour,
  processFive,
  setProcessFive,
  description,
  setDescription,
  submit,
  cancel,
  buttomName,
  demandDate,
  setDemandDate,
}) => {
  const [processTwoShow, setProcessTwoShow] = useState(false);
  const [processThreeShow, setProcessThreeShow] = useState(false);
  const [processFourShow, setProcessFourShow] = useState(false);
  const [processFiveShow, setProcessFiveShow] = useState(false);

  const handleDelProcess = (field, show) => {
    field('');
    show(false);
  };

  useEffect(() => {
    

  }, [processOne, processTwo, processThree, processFour, processFive]);


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
              1.
              <InputField placeholder="Nº do processo" value={processOne} onChange={(e) => setProcessOne(e.target.value)} />
              {processTwoShow ? (null) : (
                <Button onClick={() => setProcessTwoShow(true)}>
                  <Icon color="#00FF00">
                    <FaPlus />
                  </Icon>
                </Button>
              )}
            </ProcessDiv>
            {processTwoShow ? (
              <ProcessDiv>
                2.
                <InputField placeholder="Nº do processo" value={processTwo} onChange={(e) => setProcessTwo(e.target.value)} />
                {processThreeShow ? (null) : (
                  <Button onClick={() => setProcessThreeShow(true)}>
                    <Icon color="#00FF00">
                      <FaPlus />
                    </Icon>
                  </Button>
                )}
                <Button onClick={() => handleDelProcess(setProcessTwo, setProcessTwoShow)}>
                  <Icon color="#FF0000">
                    <FaMinus />
                  </Icon>
                </Button>
              </ProcessDiv>
            ) : (null)}
            {processThreeShow ? (
              <ProcessDiv>
                3.
                <InputField placeholder="Nº do processo" value={processThree} onChange={(e) => setProcessThree(e.target.value)} />
                {processFourShow ? (null) : (
                  <Button onClick={() => setProcessFourShow(true)}>
                    <Icon color="#00FF00">
                      <FaPlus />
                    </Icon>
                  </Button>
                )}
                <Button onClick={() => handleDelProcess(setProcessThree, setProcessThreeShow)}>
                  <Icon color="#FF0000">
                    <FaMinus />
                  </Icon>
                </Button>
              </ProcessDiv>
            ) : (null)}
            {processFourShow ? (
              <ProcessDiv>
                4.
                <InputField placeholder="Nº do processo" value={processFour} onChange={(e) => setProcessFour(e.target.value)} />
                {processFiveShow ? (null) : (
                  <Button onClick={() => setProcessFiveShow(true)}>
                    <Icon color="#00FF00">
                      <FaPlus />
                    </Icon>
                  </Button>
                )}
                <Button onClick={() => handleDelProcess(setProcessFour, setProcessFourShow)}>
                  <Icon color="#FF0000">
                    <FaMinus />
                  </Icon>
                </Button>
              </ProcessDiv>
            ) : (null)}
            {processFiveShow ? (
              <ProcessDiv>
                5.
                <InputField placeholder="Nº do processo" value={processFive} onChange={(e) => setProcessFive(e.target.value)} />
                <Button onClick={() => handleDelProcess(setProcessFive, setProcessFiveShow)}>
                  <Icon color="#FF0000">
                    <FaMinus />
                  </Icon>
                </Button>
              </ProcessDiv>
            ) : (null)}
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
}

export default DemandsDescription;
