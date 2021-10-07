import styled from 'styled-components';
import colors from '../../Constants/colors';

export const ButtonDiv = styled.div`
  display: flex;
  width: 40%;
  margin: 5%;
  @media (max-width: 750px) {
    width: 90%;
    display: none;
  }
`;
export const styles = {
  modalFooter: {
    display: 'flex',
    justifyContent: 'center',
  },
  tinyButton: {
    backgroundColor: colors.alertMessages,
    borderColor: colors.alertMessages,
  },
  redirectListButton: {
    backgroundColor: colors.primary,
    width: '20%',
  },
};
