import { IoPersonCircleOutline } from 'react-icons/io5';
import styled from 'styled-components';

export const DescriptionField = styled.textarea`
  font-family: Montserrat;
  border: 2px solid black;
  border-radius: 12px;
  text-indent: 3px;
  font-size: 120%;
  width: 100%;
  outline: none;
  @media(max-width: 750px) {
    width: 100%;
    font-size: 100%;
  }
`;

export const InputField = styled.input`
  border: 2px solid black;
  border-radius: 8px;
  text-indent: 3px;
  font-size: 120%;
  outline: none;
  margin-bottom: 10px;
  width: 75%;
  margin-left: 10px;
  @media(max-width: 750px) {
    width: 50%;
    font-size: 100%;
  }
`;

export const FieldsDiv = styled.div`
  height: 100%;
  overflow: scroll;
  display: flex;
  justify-content: center;
  width: 65%;
  @media(max-width: 750px){
    width: 100%;
    overflow: visible;
  }
`;

export const Title = styled.h1`
  font-size: 200%;
  margin-top: 15%;
  
  @media(max-width: 750px) {
    font-size: 200%;
    align-self: flex-start;
    margin-left: 5%;
    margin-top: 25%;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 10%;
  margin-bottom: 30%;
  @media(max-width: 750px) {
    display: none;
    flex-direction: column-reverse;
    align-items: center;
  }
`;

export const P = styled.h1`
  display: inline-block;
  font-size: 120%;
  @media(max-width: 750px) {
    margin-top: 10px;
  }
`;

export const InputsDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3%;
  height: ${(props) => props.height};
  @media(max-width: 750px) {
    flex-direction: column;
    width: 90%;
    height: 40%;
    margin-bottom: 10%;
  }
`;

export const InputDiv = styled.div`
  width: ${(props) => props.width};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  outline: none;
  @media(max-width: 750px){
    width: 100%;
    height: 40%;
    
  }
`;

export const ProcessesDiv = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  @media(max-width: 750px){
    width: 100%;
    height: 100%;
  }
`;

export const ProcessDiv = styled.div`
  width: 100%;
  /* height: 45%; */
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  /* outline: none; */
  @media(max-width: 750px){
    width: 100%;
    height: 40%;
  }
`;

export const DescriptionDiv = styled.div`
  display: flex;
  height: 20%;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;
  @media(max-width: 750px){
    align-items: flex-start;
    width: 90%;
    height: 40%;
  }
`;

export const PersonIcon = styled(IoPersonCircleOutline)`
    width: 30%;
    height: 60%;
    color: white;
    @media(max-width: 750px){
        
    }
`;

export const CenterDiv = styled.div`
  display: flex;
  height: 100%;
  width: 90%;
  flex-direction: column;
  @media(max-width: 750px){
    align-items: center;
  }
`;

export const DateInput = styled.input`
  box-sizing: border-box;
  border-radius: 10px;
  border: 2px solid #000000;
  box-shadow: none !important;
  display: flex;
  width: 30%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: white;
  outline: none;
  
  @media(max-width: 750px){
    width: 90%;
  }
`;

export const DateView = styled.div`
  /* margin-top: 5px; */
`;

export const Button = styled.button`
  border: none;
  background-color: #FFF;
  color: ${(props) => `${props.color}`};
  border-radius: 15px;
  @media(max-width: 750px){
    font-size: 1.3vh;
  }
`;

export const Icon = styled.div`
  font-size: 18px;
  color: ${(props) => `${props.color}`};
  /* border-width: 1; */
  border-color: #000;
  /* width: 20%; */
`;
