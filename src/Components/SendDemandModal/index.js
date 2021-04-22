import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import { forwardDemand } from '../../Services/Axios/demandsServices';
import colors from '../../Constants/colors';
import TinyButton from '../TinyButton';
import { ForwardDiv, ForwardIcon } from './Style';
import ModalMessage from '../ModalMessage';

const SendDemandModal = ({
  sectorOption, demand, getDemandApi, sectorsResponse, changeState, setChangeState,
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const handleCloseMessage = () => setShowMessage(false);
  const handleShowMessage = () => setShowMessage(true);

  const sectorOptionByID = sectorsResponse?.filter(
    (sectorByID) => sectorByID.name === sectorOption,
  );

  const forwardDemandFunct = () => {
    if (demand.sectorHistory[demand.sectorHistory.length - 1].sectorID
      === sectorOptionByID[0]?._id) {
      setMessage('A demanda não pode ser encaminhada para o setor atual dela.');
      handleShowMessage();
    } else {
      handleShow();
    }
  };

  const submit = () => {
    forwardDemand(sectorOptionByID[0]?._id, demand._id);
    getDemandApi();
    setChangeState(!changeState);
  };

  return (
    <>
      <ForwardDiv onClick={forwardDemandFunct}>
        <p style={{ marginRight: '5px', marginBottom: '0px' }}>
          Encaminhar
        </p>
        <ForwardIcon
          style={{
            color: `${colors.secondary}`,
            backgroundColor: `${colors.navHeaders}`,
            marginRight: '3%',
          }}
        />
      </ForwardDiv>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Alerta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Você tem certeza que deseja encaminhar essa demanda pra o setor
          {' '}
          {sectorOption}
          ?
        </Modal.Body>
        <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
          <TinyButton
            type="primary"
            title="Cancelar"
            click={handleClose}
            style={{
              backgroundColor: colors.alertMessages,
              borderColor: colors.alertMessages,
            }}
          />
          <TinyButton
            type="primary"
            title="Confirmar"
            click={() => { submit(); handleClose(); }}
            style={{
              backgroundColor: colors.primary,
            }}
          />
        </Modal.Footer>
      </Modal>
      <ModalMessage
        show={showMessage}
        handleClose={handleCloseMessage}
        message={message}
      />
    </>
  );
};

export default SendDemandModal;
