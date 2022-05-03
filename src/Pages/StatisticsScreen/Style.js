import styled from 'styled-components';
import colors from '../../Constants/colors';

export const Main = styled.div`
  display: flex;
  background-color: ${colors.background};
  width: 100vw;
  height: 100vh;
  overflow: auto;
  @media(max-width: 750px){
    height: max-content;
  }
`;

export const Container = styled.div`
  margin-top: 18vh;
  height: 82vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media(max-width: 750px){
    height: max-content;
    margin-top: 120px;
  }
`;

export const Title = styled.h2`
  font-family: 'Montserrat';
  font-weight: 400;
  font-size: 4vh;

  @media(max-width: 750px){
  }
`;

export const Search = styled.div`
  float: left;
  height: 50px;

  @media(max-width: 750px){
    width: 50%;
  }
`;

export const Card = styled.div`
  padding: 2rem 0 1rem 0;
  width: 100%;
  border-radius:15px;
  border: 2px solid black;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
  overflow: scroll;
  
  
  .legenda{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-height: 700px;
    width: 80%;
    justify-content: space-evenly;
  }

`;

export const CardTitle = styled.h2`
  font-family: 'Montserrat';
  font-weight: 400;
  font-size: 3vh;
  margin: 20px;

  @media(max-width: 750px){
    width: 100%;
    height:10%;
    margin: 10px;
    font-size: 3vh;

  }
`;

export const TopDiv = styled.div`
  min-height: 30%;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media(max-width: 750px){
    height: min-content;
  }
`;

export const MiddleDiv = styled.div`
  height: max-content;
  width: 90%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  @media(max-width: 750px){
    justify-content: center;
  }
`;

export const BottomDiv = styled.div`
  height: 10%;
  width: 90%;
  padding: 10px;
  display: flex;
  align-items: center;

  @media(max-width: 750px){

  }
`;

export const FiltersDiv = styled.div`
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  
  @media(max-width: 750px){
    height: 100%;
    flex-direction: column;
  }
`;

export const SearchDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media(max-width: 750px){
    height: min-content;
    width: 100%;
    justify-content: flex-start;
  }
`;

export const DropdownDiv = styled.div`
  height: max-content;
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  margin: 10px;
  
  @media(max-width: 750px){
  }
`;

export const BoldText = styled.h2`
  font-weight: bold;
  font-size: large;
  margin-bottom: 0;
  
  @media(max-width: 750px){

  }
`;

export const TextLabel = styled.p`
  width: 100%;
  height: 25%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  
  @media(max-width: 750px){

  }
`;

export const DateInput = styled.input`
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid #000000;
  box-shadow: none !important;
  display: flex;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: white;
  outline: none;
  
  @media(max-width: 750px){

  }
`;

export const styles = {
  dropdownComponentStyle: {
    display: 'flex',
    color: `${colors.text}`,
    width: '100%',
    height: '40px',
    alignItems: 'center',
    boxSizing: 'border-box',
    borderRadius: '8px',
    border: '1px solid black',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
};

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background-color: #1F3541;
  color: white;
  font-size: 1.125rem;
  padding: 5px;
  transition: filter 0.2s;
  height: 50px;

  &:hover {
    filter: brightness(80%);
    cursor: pointer;
  }
  svg {
    margin-left: 10px;
  }

  @media(max-width: 750px){
    font-size: 1.3vh;
  }
`;

export const customStyles = {
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
    color: 'black',
    padding: '5%',
  }),
  control: () => ({
    color: 'black',
    display: 'flex',
    borderRadius: '10px',
    border: '1px solid #000',
    width: '15vw',
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    const color = 'black';
    return {
      ...provided, opacity, transition, color,
    };
  },
  input: () => ({
    color: 'black',
    background: 'white',
  }),
};
