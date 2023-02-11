import React, { useState } from 'react';
import { IoPersonCircleOutline } from 'react-icons/io5';
import moment from 'moment-timezone';
import { BsPencil } from 'react-icons/bs';
import { AiFillEye } from 'react-icons/ai';
import { BiTrash, BiLockAlt } from 'react-icons/bi';
import { FcHighPriority } from 'react-icons/fc';
import TinyButton from '../TinyButton';
import ModalEditUpdateDemand from '../ModalEditUpdateDemand';
import { deleteDemandUpdate } from '../../Services/Axios/demandsServices';
import { useProfileUser } from '../../Context';
import ConfirmDemandModal from '../ConfirmDemandModal';
import {
  Card, TopSide, DemandName, EditIcon,
  DemandDescription, BottomSide, CreatedAt, Img,
  LockIcon, TrashIcon, IconsContainer, HighPriorityIcon,
  PDFViwerContainer, PDFViwer, PDFViwerCloseButton,
} from './Style';

const UpdateCard = ({
  update, sector, demand, setChangeState, changeState, fileID,
}) => {
  const sectorName = sector?.filter((sectorByID) => sectorByID?._id === update.userSector);
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const handleClose = () => setShow(false);
  const handleConfirm = () => setConfirm(false);
  const { user, token, startModal } = useProfileUser();
  const [fileStatus, setFileStatus] = useState(false);

  const styles = {
    topSideDiv: {
      display: 'flex',
      width: '70%',
    },
    iconStyle: {
      marginRight: '10px',
      color: 'black',
    },
    deleteIconStyle: {
      marginRight: '5px',
      color: 'red',
    },
  };

  const isUpdateFromLoggedUser = () => user._id === update.userID;

  const deleteUpdate = async () => {
    await deleteDemandUpdate(demand._id, update._id, startModal)
      .then(() => setChangeState(!changeState));
  };

  const validateDateOnDelete = () => {
    const dataNow = moment(moment.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss')).toDate();
    const deleteData = moment(update.createdAt, 'YYYY-MM-DDTHH:mm:ss').toDate();
    const timeLimitData = moment(deleteData).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
    const dateFormatTimeLimitData = moment(timeLimitData, 'YYYY-MM-DDTHH:mm:ss').toDate();
    if (moment(dataNow).isAfter(dateFormatTimeLimitData)) {
      startModal('Não é possível apagar essa atualização.');
    } else {
      setConfirm(true);
    }
  };

  const catchUser = () => (isUpdateFromLoggedUser() ? setShow(true) : startModal('Você não pode apagar essa atualização.'));

  const deleteCall = () => (isUpdateFromLoggedUser() ? validateDateOnDelete() : startModal('Você não pode apagar essa atualização.'));

  const pdfViewer = () => (
    <PDFViwerContainer>
      <PDFViwerCloseButton>
        <TinyButton
          type="primary"
          title="Fechar"
          click={() => { setFileStatus(false); }}
          style={{
            backgroundColor: 'red',
            color: 'white',
            border: '1px solid #0000',
            height: 'min-content',
            width: '10%',
            display: 'flex',
            margin: '0 0 0 85%',
          }}
        />
      </PDFViwerCloseButton>
      <PDFViwer
        title="PDF"
        src={`http://localhost:3003/demand/file/${fileID[0]}?token=${token}`}
        scrolling="auto"
      />
    </PDFViwerContainer>

  );

  const renderImageUser = () => {
    if (!user.image) {
      return (
        <IoPersonCircleOutline size="60px" />
      );
    }
    return (
      <Img
        src={user.image}
        alt="Foto"
      />
    );
  };

  return (
    <Card>
      <TopSide>
        <div style={styles.topSideDiv}>
          {renderImageUser()}
          <DemandName>
            {update.userName}
            {' '}
            (
            {sectorName[0]?.name}
            )
          </DemandName>
        </div>
        {fileStatus
          && pdfViewer()}
        <IconsContainer>
          { update.important
            ? (
              <HighPriorityIcon>
                <FcHighPriority style={styles.iconStyle} />
              </HighPriorityIcon>
            )
            : null }
          { update.visibilityRestriction
            ? (
              <LockIcon>
                <BiLockAlt style={styles.iconStyle} />
              </LockIcon>
            )
            : null }
          { fileID.length === 1 ? (
            <EditIcon
              onClick={() => { setFileStatus(true); }}
              style={{ cursor: 'pointer' }}
            >
              <AiFillEye style={{ marginRight: '10px' }} />
            </EditIcon>
          ) : (
            isUpdateFromLoggedUser()
            && (
            <EditIcon
              onClick={() => { catchUser(); }}
              style={{ cursor: 'pointer' }}>
              <BsPencil style={{ marginRight: '10px' }} />
            </EditIcon>
            )
          )}
          { isUpdateFromLoggedUser()
            && (
            <TrashIcon onClick={() => { deleteCall(); }}>
              <BiTrash style={styles.deleteIconStyle} />
            </TrashIcon>
            )}
        </IconsContainer>
      </TopSide>
      <BottomSide>
        <DemandDescription>
          {update.description}
        </DemandDescription>
        <CreatedAt>
          {moment.parseZone(update.createdAt).local(true).format('DD/MM/YYYY HH:mm')}
        </CreatedAt>
      </BottomSide>
      <ModalEditUpdateDemand
        showModal={show}
        handleClose={handleClose}
        name={user.name}
        description={update.description}
        visibilityRestriction={update.visibilityRestriction}
        updateDemandID={update._id}
        demandID={demand._id}
        createdAt={update.createdAt}
        userSector={update.userSector}
        setChangeState={setChangeState}
        changeState={changeState}
        important={update.important}
      />
      <ConfirmDemandModal
        show={confirm}
        handleClose={handleConfirm}
        submit={deleteUpdate}
        actionName="Deseja excluir a atualização?"
      />
    </Card>
  );
};

export default UpdateCard;
