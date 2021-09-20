import styled from 'styled-components';
import colors from '../../Constants/colors';

export const Main = styled.div`
  display: flex;
  background-color: ${colors.background};
  color: ${colors.text};
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  @media(max-width: 750px){
    height: max-content;
  }
`;

export const H1 = styled.h1`
    font-size: '1.5rem';
    font: 'Montserrat';
`;
