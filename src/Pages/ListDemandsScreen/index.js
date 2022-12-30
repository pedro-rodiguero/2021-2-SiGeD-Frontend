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
  const [word, setWord] = useState();
  const [filterDemands, setFilterDemands] = useState([]);
  const [filterSector, setFilterSector] = useState(['Todos']);
  const [filterCategory, setFilterCategory] = useState(['Todas']);
  const [demands, setDemands] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [dropdownYears, setDropdownYears] = useState([]);
  const [filterYear, setFilterYear] = useState('2022');
  const [categories, setCategories] = useState([]);
  const [sectorActive, setSectorActive] = useState('Todos');
  const [categoryActive, setCategoryActive] = useState('Todas');
  const [active, setActive] = useState('Ativos');
  const [query, setQuery] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const getDemandsFromApi = async () => {
    // Por default, traz como resultado somente as demandas ativas,
    // de todos os setores, de todas as categorias
    await getDemandsWithClientsNames(`clientsNames?open=${query}`, startModal)
      .then((response) => {
        setDemands(response.data);
      });
  };

  const getSectorsFromApi = async () => {
    await getSectors(startModal)
      .then((response) => {
        setSectors(response?.data);
        setSectorActive(response?.data[0]?.name);
      });
  };
  const getCategoriesFromApi = async () => {
    await getCategories('category', startModal)
      .then((response) => {
        setCategories(response.data);
      });
    setSectorActive('Todos');
  };

  const filterDemandByYear = () => {
    const filteredDemands = [];
    demands.filter((demand) => {
      const year = new Date(demand.createdAt).getFullYear().toString();
      if (year === filterYear) {
        filteredDemands.push(demand);
      }
      return undefined;
    });
    setFilterDemands(filteredDemands);
  };

  const listYears = () => {
    const years = [];
    demands?.map((demand) => {
      const year = new Date(demand.createdAt).getFullYear();
      if (!years.find((y) => y === year)) {
        years.push(year);
      }
      return undefined;
    });
    years.push('Sem filtro');
    setDropdownYears(years);
  };

  useEffect(() => {
    if (token && user) {
      getDemandsFromApi();
      getSectorsFromApi();
      getCategoriesFromApi();
    }
  }, [token, user]);

  useEffect(() => {
    setFilterDemands(
      demands.filter((demand) => demand.name.toLowerCase().includes(word?.toLowerCase())
        || demand.clientName.toLowerCase().includes(word?.toLowerCase())
        || demand.process.toLowerCase().includes(word?.toLowerCase())),
    );
  }, [word]);

  useEffect(() => {
    if (active === 'Inativas') {
      setQuery(false);
    } else if (active === 'Todas') {
      setQuery(null);
    } else {
      setQuery(true);
    }
  }, [active]);

  useEffect(() => {
    if (!dropdownYears.find((ano) => (ano === filterYear))) {
      setFilterYear('Sem filtro');
    }
    getDemandsFromApi();
    if (filterYear !== 'Sem filtro') {
      filterDemandByYear();
    } else {
      setFilterDemands(demands);
    }
  }, [query]);

  useEffect(() => {
    setFilterDemands(demands);
    listYears();
  }, [demands]);

  useEffect(() => {
    setFilterSector([{ name: 'Todos' }, ...sectors]);
  }, [sectors]);

  useEffect(() => {
    if (filterYear !== 'Sem filtro') {
      filterDemandByYear();
    } else {
      setFilterDemands(demands);
    }
  }, [filterYear]);

  useEffect(() => {
    setFilterCategory([...filterCategory, ...categories]);
  }, [categories]);

  const listDemands = () => {
    if (demands?.length === 0 || filterDemands?.length === 0) {
      return <h1>Sem resultados para esses filtros</h1>;
    }
    return filterDemands?.map((demand) => {
      const sector = filterSector?.filter(
        (listSector) => (listSector.name === sectorActive ? listSector : false),
      );

      if (sectorActive !== 'Todos') {
        if (demand.sectorHistory[demand.sectorHistory.length - 1].sectorID !== sector[0]?._id) {
          return false;
        }
      }

      if (categoryActive !== 'Todas') {
        const results = demand.categoryID.filter(
          (demandCategory) => (demandCategory.name === categoryActive ? demandCategory : false),
        );
        if (results.length === 0) {
          return false;
        }
      }
      return (
        <DemandData
          sector={sector}
          demand={demand}
          key={demand._id}
          sectors={sectors}
        />
      );
    });
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
                icon={<FaSistrix />}
                value={word}
                setWord={(value) => setWord(value)}
                style={{ width: '50%' }}
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
            <Dropdown>
              <DropdownField>
                <p style={{ marginBottom: '0' }}>Status: </p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setActive(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
                  optionList={['Todas', 'Ativas', 'Inativas']}
                />
              </DropdownField>
              <DropdownField width="25%">
                <p style={{ marginBottom: '0' }}>Setores:</p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setSectorActive(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
                  optionList={filterSector?.map((sector) => sector.name)}
                />
              </DropdownField>
              <DropdownField width="25%">
                <p style={{ marginBottom: '0' }}>Categoria: </p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setCategoryActive(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
                  optionList={filterCategory?.map(
                    (category) => (category.name ? category.name : category),
                  )}
                />
              </DropdownField>
              <DropdownField>
                <p style={{ marginBottom: '0' }}>Anos: </p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setFilterYear(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
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
              style={customStyles}
            >
              <ReportModal
                allDemands={demands}
                filterSector={filterSector.slice(1)}
                filterCategory={filterCategory}
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
