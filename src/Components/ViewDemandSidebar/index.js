import React, { useState, useEffect } from 'react';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { BiStopwatch } from 'react-icons/bi';
import moment from 'moment-timezone';
import {
  RightBox, ContentBox, NameDiv, Line,
  CreatedBy, ImgClient, ImgUser, P,
  UserName, UserP, SelectionBox,
  CategoryField, MobileHeader,
  PlusButton, LessButton, ButtonsDiv,
  AlertContainer, AlertTitle, CreateAlertDiv,
  CreateAlertTitle, CreateAlertIcon, ListAlert,
  TextButton, styles,
} from './Style';
import SendDemandModal from '../SendDemandModal';
import DropdownComponent from '../DropdownComponent';
import SelectedCategories from '../SelectedCategories';
import AlertByDemandData from '../AlertByDemandData';
import colors from '../../Constants/colors';
import CreateAlertModal from '../CreateAlertModal';
import { useProfileUser } from '../../Context';
import { getAlertsByDemand } from '../../Services/Axios/demandsServices';
import UserDropdown from '../UserDropdown';

const ViewDemandSidebar = ({
  clientImage, clientName, userName, selectedCategories, demand,
  getDemandApi, showUpdates, sectorsResponse,
  changeState, setChangeState, alerts, setAlerts, handleShowHistory,
}) => {
  const [sidebarState, setSidebarState] = useState(true);
  const [flag, setFlag] = useState(false);
  const [show, setShow] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [responsibleUserName, setResponsibleUserName] = useState('');
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const { user, startModal } = useProfileUser();

  const currentSector = sectorsResponse?.find(
    (sectorByID) => sectorByID._id === demand.sectorHistory.at(-1).sectorID,
  );

  const currentResponsibleName = demand?.sectorHistory.at(-1).responsibleUserName;

  const [sectorOption, setSectorOption] = useState(currentSector?.name);
  const [selectedSectorObj, setSelectedSectorObj] = useState(currentSector);

  const alertMessage = () => {
    startModal('Você deve editar a demanda para retirar a categoria!');
  };

  useEffect(() => {
    if (currentSector && !flag) {
      setSectorOption(currentSector?.name);
      setResponsibleUserName(demand.sectorHistory.at(-1).responsibleUserName);
      setFlag(true);
    }
  }, [currentSector]);

  useEffect(() => {
  }, [currentResponsibleName]);

  useEffect(() => {
    setSelectedSectorObj(sectorsResponse.find((s) => s.name === sectorOption));
  }, [sectorOption]);

  const sortList = () => {
    const sortedAlerts = alerts.sort((a, b) => moment(a.date).format('YYYYMMDD') - moment(b.date).format('YYYYMMDD'));
    setAlerts(sortedAlerts);
    setSorted(true);
  };

  const getAlertsApi = async () => {
    await getAlertsByDemand(demand?._id, startModal)
      .then((response) => {
        setAlerts(response.sort((a, b) => moment(a.date).format('YYYYMMDD') - moment(b.date).format('YYYYMMDD')));
      })
      .catch((err) => {
        console.error(`An unexpected error ocourred while getting alerts. ${err}`);
      });
  };

  useEffect(() => {
    if (!sorted) {
      getAlertsApi().then(() => {});
      sortList();
    }
  }, [sorted, alerts]);

  const renderImageClient = () => {
    if (!clientImage) {
      return (
        <IoPersonCircleOutline size="100px" />
      );
    }
    return (
      <ImgClient
        src={clientImage}
        alt="Foto"
      />
    );
  };

  const renderImageUser = () => {
    if (!user.image) {
      return (
        <IoPersonCircleOutline size="20%" />
      );
    }
    return (
      <ImgUser
        src={user.image}
        alt="Foto"
      />
    );
  };

  return (
    <RightBox>
      <ContentBox>
        <ButtonsDiv>
          {sidebarState && <LessButton onClick={() => setSidebarState(false)} />}
          {!sidebarState && <PlusButton onClick={() => setSidebarState(true)} />}
        </ButtonsDiv>
        <MobileHeader>
          Cliente:
        </MobileHeader>
        <NameDiv>
          {renderImageClient()}
          <P>
            {clientName}
          </P>
        </NameDiv>
        <Line />
        {sidebarState
          && (
            <CreatedBy>
              <p style={{ marginBottom: '0px' }}>Criado por:</p>
              <UserName>
                {renderImageUser()}
                <UserP>
                  {userName}
                </UserP>
              </UserName>
            </CreatedBy>
          )}
        <p style={styles.textStyle}>
          Setor:
        </p>
        <DropdownComponent
          OnChangeFunction={(Option) => {
            setSectorOption(Option.target.value);
            setSelectedSectorObj(sectorsResponse.find((s) => s.name === Option.target.value));
          }}
          style={styles.dropdownComponentStyle}
          optionStyle={{
            backgroundColor: `${colors.navHeaders}`,
          }}
          optionList={sectorsResponse.map((sector) => sector.name)}
          value={sectorOption}
        />
        <UserDropdown
          placeholder="Responsável setor (opcional)"
          label="Responsável"
          externalFilters={{ sector: selectedSectorObj?._id, open: 'any' }}
          externalStyles={{ marginTop: '10px' }}
          labelStyles={{
            marginLeft: 'unset', fontSize: '1em', marginBottom: '10px',
          }}
          dropdownStyles={{ width: '28vw', borderRadius: '8px' }}
          setInitialValue={() => {}}
          initialValue={currentResponsibleName}
          setUsername={setResponsibleUserName}
          waitForFilter />
        {sidebarState
          && (
            <div style={styles.sidebarStateDiv}>
              <SendDemandModal
                sectorOption={sectorOption}
                responsibleUserName={responsibleUserName}
                getDemandApi={getDemandApi}
                showUpdates={showUpdates}
                demand={demand}
                sectorsResponse={sectorsResponse}
                setChangeState={setChangeState}
                changeState={changeState}
              />
            </div>
          )}
        {sidebarState && (
          <SelectionBox>
            <CategoryField>
              <p>
                Categorias:
              </p>
              <SelectedCategories
                selectedCategories={selectedCategories}
                removeCategory={alertMessage}
              />
            </CategoryField>
            <AlertContainer>
              <AlertTitle>
                Alertas:
              </AlertTitle>
              <ListAlert>
                { alerts && alerts?.map((alert) => (
                  <AlertByDemandData
                    alert={alert}
                    demand={demand}
                    changeState={changeState}
                    setChangeState={setChangeState}
                    setSorted={setSorted}
                  />
                )) }
              </ListAlert>
              <CreateAlertDiv onClick={() => handleShow()}>
                <CreateAlertIcon>
                  <BiStopwatch />
                </CreateAlertIcon>
                <CreateAlertTitle>
                  Adicionar Alerta
                </CreateAlertTitle>
              </CreateAlertDiv>
              <CreateAlertModal
                demand={demand}
                show={show}
                handleClose={handleClose}
                startModal={startModal}
                changeState={changeState}
                setChangeState={setChangeState}
                setSorted={setSorted}
                user={user}
                title="Cadastrar"
              />
              { user.role === 'admin' && (
              <TextButton onClick={() => handleShowHistory()} style={{ marginTop: '15px' }}>
                Histórico de alterações
              </TextButton>
              )}
            </AlertContainer>
          </SelectionBox>
        )}
      </ContentBox>
    </RightBox>
  );
};

export default ViewDemandSidebar;
