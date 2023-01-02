/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { FaSistrix } from 'react-icons/fa';
import Modal from 'react-modal';
import ReportModal from './reportModal';
import {
  Main, ScreenContainer, ScreenTitle, ScreenSearch, ScreenContentBox,
  ScreenHeader, ScreenList, Dropdown, DropdownField, styles, Button,
} from './Style';
import SearchInput from '../../Components/SearchInput';
import DemandData from '../../Components/DemandData';
import { getDemandsWithClientsNames, getCategories } from '../../Services/Axios/demandsServices';
import { getSectors } from '../../Services/Axios/sectorServices';
import DropdownComponent from '../../Components/DropdownComponent';
import colors from '../../Constants/colors';
import { useProfileUser } from '../../Context';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const ListDemandsScreen = () => {
  const { token, user, startModal } = useProfileUser();
  const [modalOpen, setModalOpen] = useState(false);

  // "Stable" values
  const [filteredDemandsFinal, setFilteredDemands] = useState([]);
  const [demands, setDemands] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [dropdownYears, setDropdownYears] = useState([]);
  const [dropdownSector, setDropdownSector] = useState(['Todos']);
  const [dropdownCategory, setDropdownCategory] = useState(['Todas']);

  // Filter fields controllers
  const [word, setWord] = useState('');
  const [open, setOpen] = useState('Ativos');
  const [currentSector, setCurrentSector] = useState('Todos');
  const [category, setCategory] = useState('Todas');
  const [filterYear, setFilterYear] = useState('');
  const [query, setQuery] = useState('');

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const getDemandsFromApi = () => getDemandsWithClientsNames(`clientsNames?open=${query}`, startModal);

  const getSectorsFromApi = () => getSectors(startModal);

  const getCategoriesFromApi = () => getCategories('category', startModal);

  const filterByOpenStatus = () => {
    switch (open) {
      case 'Encerradas':
        setQuery(false);
        break;
      case 'Em andamento':
        setQuery(true);
        break;
      default:
        setQuery(null);
        break;
    }
  };

  const filterByCurrentSector = (demand) => {
    if (!currentSector || currentSector === 'Todos') {
      return true;
    }
    const sectorId = dropdownSector?.find((s) => s.name === currentSector)._id;
    return demand.sectorHistory.at(-1).sectorID === sectorId;
  };

  const filterByCategory = (demand) => {
    if (!category || category === 'Todas') {
      return true;
    }
    return demand.categoryID.some((c) => c.name === category);
  };

  const filterByWord = (demand) => {
    const cleanSearchWord = word?.toLowerCase().trim();
    if (!cleanSearchWord) {
      return true;
    }
    return ['name', 'description'].some((key) => demand[key].toLowerCase().includes(cleanSearchWord)
           || demand.clientName.toLowerCase().includes(cleanSearchWord)
           || demand.process.some((p) => p.toLowerCase().includes(cleanSearchWord)));
  };

  const filterByYear = (demand) => {
    if (!filterYear || filterYear === 'Todos') {
      return true;
    }
    const year = new Date(demand.createdAt).getFullYear().toString();
    return year === filterYear;
  };

  const listYears = () => {
    if (demands) {
      const years = [];
      demands?.forEach((demand) => {
        const year = new Date(demand.createdAt).getFullYear();
        if (!years.some((y) => y === year)) years.push(year);
      });
      years.sort((a, b) => b - a);
      years.map((y) => y.toString());
      years.splice(0, 0, 'Todos');
      setDropdownYears(years);
    }
  };

  const filter = () => {
    if (demands && demands.length) {
      const filteredDemands = demands.filter((demand) => filterByWord(demand)
                                                          && filterByYear(demand)
                                                          && filterByCurrentSector(demand)
                                                          && filterByCategory(demand));
      setFilteredDemands(filteredDemands);
    }
  };

  useEffect(async () => {
    if (token && user) {
      const result = await Promise.all([
        getDemandsFromApi(),
        getSectorsFromApi(),
        getCategoriesFromApi()]);

      setDemands(result[0].data);

      setSectors(result[1].data);
      setDropdownSector([{ name: 'Todos' }, ...result[1].data]);

      setDropdownCategory([{ name: 'Todas' }, ...result[2].data]);
    }
  }, [token, user]);

  useEffect(() => filter(), [word, currentSector, category, filterYear]);

  useEffect(() => filterByOpenStatus(), [open]);

  useEffect(() => { getDemandsFromApi().then((result) => setDemands(result.data)); }, [query]);

  useEffect(() => {
    listYears();
    filter();
  }, [demands]);

  useEffect(() => {
    if (dropdownYears.length && dropdownYears[1]) setFilterYear(dropdownYears[1].toString());
  }, [dropdownYears]);

  const listDemands = () => {
    if (!demands?.length) return <h1>Sem demandas cadastradas</h1>;
    if (!filteredDemandsFinal?.length) return <h1>Sem resultados para esses filtros</h1>;
    return filteredDemandsFinal?.map((demand) => (
      <DemandData
        sector={dropdownSector?.find((s) => (s.name === currentSector))}
        demand={demand}
        key={demand._id}
        sectors={sectors} />
    ));
  };

  if (!localStorage.getItem('@App:token')) {
    return <Redirect to="/login" />;
  }

  return (
    <Main>
      {user && demands ? (
        <ScreenContainer>
          <ScreenTitle>Demandas</ScreenTitle>
          <ScreenHeader>
            <ScreenSearch>
              <SearchInput
                type="text"
                title="Pesquise por nome, descrição, cliente ou processo"
                placeholder="Pesquise por nome, descrição, cliente ou processo"
                icon={<FaSistrix />}
                value={word}
                setWord={(value) => setWord(value)}
                style={{ width: '90%' }}
              />
              {
                demands.length > 0
                && (
                  <Button onClick={openModal}>
                    Gerar relatório
                  </Button>
                )
              }
            </ScreenSearch>
            <Dropdown style={{ width: '800px' }}>
              <DropdownField width="70%">
                <p style={{ marginBottom: '0' }}>Setor:</p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setCurrentSector(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
                  optionList={dropdownSector?.map((sector) => sector.name)}
                />
              </DropdownField>
              <DropdownField width="50%">
                <p style={{ marginBottom: '0' }}>Categoria: </p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setCategory(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
                  optionList={dropdownCategory?.map((c) => c.name)}
                />
              </DropdownField>
              <DropdownField width="50%">
                <p style={{ marginBottom: '0' }}>Situação: </p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setOpen(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
                  optionList={['Todas', 'Em andamento', 'Encerradas']}
                />
              </DropdownField>
              <DropdownField width="40%">
                <p style={{ marginBottom: '0' }}>Anos: </p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setFilterYear(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
                  value={filterYear}
                  optionList={dropdownYears}
                />
              </DropdownField>
            </Dropdown>
          </ScreenHeader>
          <ScreenContentBox>
            <Modal
              isOpen={modalOpen}
              onRequestClose={closeModal}
              contentLabel="Filtro de relatório"
              style={customStyles}>
              <ReportModal
                allDemands={demands}
                filterSector={dropdownSector.slice(1)}
                filterCategory={dropdownCategory}
              />
            </Modal>
            <ScreenList>
              {listDemands()}
            </ScreenList>
          </ScreenContentBox>
        </ScreenContainer>
      ) : <h1>Carregando...</h1>}
    </Main>
  );
};

export default ListDemandsScreen;
