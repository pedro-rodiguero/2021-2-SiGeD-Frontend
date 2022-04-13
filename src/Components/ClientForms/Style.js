import styled from 'styled-components';

export const ClientFormsColumnText = styled.div`
    font-family: 'Montserrat';
    width: 90%;
    height: 70%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-top: 2%;
    flex-wrap: wrap;
    justify-content: space-between;
    overflow: auto;
    @media(max-width: 750px){
        align-items: center;
        width: 90%;
        height: max-content;
        justify-content: space-between;
        align-content: center;
    }
`;

export const Container = styled.div`

    width: ${(props) => (props.long ? '100%' : '45%')};
    height: 20%;

    @media(max-width: 750px){
      height: max-content;
  }
`;

export const Label = styled.div`

    font-family: Montserrat;
    font-size: 100%;
    height: min-content;
    align-items: center;
    align-content:center;
    justify-content: center;

    @media(max-width: 750px){
      font-size: 80%;
      height: min-content;
    
  }
`;

export const styles = {
  roleDiv: {
    boxSizing: 'border-box',
    borderRadius: '9px',
    border: '2px solid #000000',
    justifyContent: 'flex-start',
    display: 'flex',
  },
  formGroup: {
    width: '45%',
  },
  formLabel: {
    margin: '0',
  },
  borderStyle: {
    border: '0',
  },
};

export const DateView = styled.div`
  /* margin-top: 5px; */
`;

export const DateInput = styled.input`
  box-sizing: border-box;
  border-radius: 10px;
  border: 2px solid #000000;
  box-shadow: none !important;
  display: flex;
  width: 50%;
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
