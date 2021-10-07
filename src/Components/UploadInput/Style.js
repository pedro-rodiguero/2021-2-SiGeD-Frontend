import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;


  strong {
    font-size: 1rem;
    color: black;
    margin-bottom: 0.7rem;
    font-weight: 400;
  }

  input {
    display: none;
  }

  & + div {
    margin-top: 0.5rem;
  }
`;

export const Message = styled.p`
  height: 100%;
  display: flex;
  margin-left: 15px;
  color: gray;
  align-items: center;
  justify-content: center;
`;

export const LabelContainer = styled.div`
  flex: 1;
  border-radius: 8px;
  border: 2px solid gray;

  ${(props) => !props.disabled
    && css`
      &:hover {
        border-color: black;
      }
    `}
`;

export const Label = styled.label`
  height: 53px;
  display: flex;
  flex: 1;
  position: relative;
  cursor: pointer;
  align-items: center;

  ${(props) => props.disabled
    && css`
      cursor: unset;
    `}
`;
