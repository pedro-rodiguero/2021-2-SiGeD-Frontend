import React, { useEffect, useState } from 'react';
import { BsDownload } from 'react-icons/bs';
import {
  Cell, ResponsiveContainer, Tooltip,
  BarChart, CartesianGrid, XAxis, Bar, YAxis,
} from 'recharts';
import moment from 'moment';
import { getDemandsStatistics } from '../../../Services/Axios/demandsServices';
import {
  Main, Title, Container, Card, TopDiv, MiddleDiv, FiltersDiv, DropdownDiv,
  SearchDiv, TextLabel, styles, Button,
} from '../Style';
import DropdownComponent from '../../../Components/DropdownComponent';
import colors from '../../../Constants/colors';
import { getSectors } from '../../../Services/Axios/sectorServices';
import { useProfileUser } from '../../../Context';
import getCategoriesFromApiService from '../utils/services';
import Dropdown from '../utils/Dropdown';
import { getClients } from '../../../Services/Axios/clientServices';
import activeClient from '../utils/alternateClient';
import { DemandStatistics } from '../../../Utils/reports/printDemandReport';

const StatisticScreen = () => {
  const { token, user, startModal } = useProfileUser();
  const [sectors, setSectors] = useState(['Todos']);
  const [sectorActive, setSectorActive] = useState('Todos');
  const [sectorID, setSectorID] = useState('');
  const [categoryStatistics, setCategoryStatistics] = useState([]);
  const [categories, setCategories] = useState(['Todas']);
  const [initialDate, setInitialDate] = useState(moment('2021-01-01').format('YYYY-MM-DD'));
  const [finalDate, setFinalDate] = useState(moment().format('YYYY-MM-DD'));
  const [clientID, setClientID] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [active, setActive] = useState('Todas');
  const [query, setQuery] = useState('all');
  const getSectorsFromApi = async () => {
    await getSectors(startModal)
      .then((response) => {
        setSectors([...sectors, ...response.data]);
      });
  };

  const getCategoriesFromApi = async () => {
    try {
      const res = await getCategoriesFromApiService(startModal);
      setCategories([...categories, ...res]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (active === 'Inativas') {
      setQuery(false);
    } else if (active === 'Ativas') {
      setQuery(true);
    } else {
      setQuery(null);
    }
    console.log(query);
  }, [active]);

  useEffect(() => {
    if (sectorActive !== 'Todos') {
      const results = sectors.find((element) => element.name === sectorActive);
      setSectorID(results._id);
    } else {
      setSectorID(null);
    }
  }, [sectorActive]);

  const getCategoriesStatistics = async (idSector) => {
    await getDemandsStatistics(
      `statistic/category?isDemandActive=${query}&idSector=${idSector}&initialDate=${initialDate}&finalDate=${finalDate}&idClients=${clientID}`,
      startModal,
    )
      .then((response) => {
        setCategoryStatistics(response?.data);
      });
  };

  useEffect(() => {
    if (user && token) {
      getSectorsFromApi();
      getCategoriesFromApi();
      getCategoriesStatistics(null);
    }
  }, [token, user]);

  useEffect(() => {
    getCategoriesStatistics(sectorID);
  }, [query, sectorID, finalDate, initialDate, clientID]);

  useEffect(() => {
    getCategoriesStatistics(sectorID);
  }, [query, finalDate, initialDate]);

  const getClientsFromApi = async () => {
    await getClients(`clients?active=${null}`, startModal)
      .then((response) => {
        const clientSelectArray = activeClient(response.data).map((client) => (
          {
            label: client.name,
            value: client._id,
          }));
        setClientList(clientSelectArray);
      });
  };

  useEffect(() => {
    console.log(categoryStatistics);
  }, [categoryStatistics]);

  useEffect(() => getClientsFromApi(), []);

  return (
    <Main>
      { user ? (
        <Container>
          <TopDiv>
            <Title>Estatísticas - Demandas por Categoria</Title>
            <FiltersDiv>
              <SearchDiv>
                <DropdownDiv>
                  <TextLabel>
                    Demandas:
                  </TextLabel>
                  <DropdownComponent
                    OnChangeFunction={(Option) => setActive(Option.target.value)}
                    style={styles.dropdownComponentStyle}
                    optionStyle={{
                      backgroundColor: `${colors.secondary}`,
                    }}
                    optionList={['Todas', 'Ativas', 'Inativas']}
                  />
                </DropdownDiv>
                <DropdownDiv>
                  <TextLabel>
                    Clientes:
                  </TextLabel>
                  <select
                    onChange={(e) => setClientID(e.target.value)}
                    value={clientID}
                    style={styles.dropdownComponentStyle}
                  >
                    <option selected value="null">Todos</option>
                    {
                      clientList?.map((el) => (
                        <option key={el.value} value={el.value}>{el.label}</option>
                      ))
                    }
                  </select>
                </DropdownDiv>
                <DropdownDiv>
                  <TextLabel>
                    Setor:
                  </TextLabel>
                  <DropdownComponent
                    OnChangeFunction={(Option) => setSectorActive(Option.target.value)}
                    style={styles.dropdownComponentStyle}
                    optionStyle={{
                      backgroundColor: `${colors.secondary}`,
                    }}
                    optionList={sectors?.map(
                      (sectorx) => (sectorx.name ? sectorx.name : sectorx),
                    )}
                  />
                </DropdownDiv>
                <Dropdown
                  initialDate={initialDate}
                  setInitialDate={setInitialDate}
                  finalDate={finalDate}
                  setFinalDate={setFinalDate}
                />
              </SearchDiv>
            </FiltersDiv>
            {
              categoryStatistics.length > 0
              && (
                <div style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-end',
                  margin: '10px 0',
                }}>
                  <Button onClick={() => DemandStatistics({
                    statisticsData: categoryStatistics.map((category) => ({
                      name: category.categories[0].name,
                      total: category.demandas,
                    })),
                    active,
                    initialDate,
                    clientID,
                    finalDate,
                    startModal,
                    reportType: 'CATEGORY',
                  })}>
                    Baixar relatório
                    <BsDownload />
                  </Button>
                </div>
              )
            }
          </TopDiv>
          <MiddleDiv>
            <Card>
              <ResponsiveContainer height="80%" width="100%">
                <BarChart
                  data={categoryStatistics}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 2,
                    bottom: 40,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categories[0].name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="demandas">
                    {categoryStatistics?.map((entry, index) => (
                      <Cell key={index} fill={entry?.categories[0]?.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="legenda">
                {categoryStatistics.map((entry, index) => (
                  <div
                    key={`cell-${index}`}
                    style={{
                      display: 'flex', alignItems: 'center', margin: '0px 4px', fontSize: '1.5rem',
                    }}>
                    <div style={{ width: '20px', height: '10px', backgroundColor: entry.categories[0].color }} />
                    <span style={{ margin: '0px 5px' }}>{entry.categories[0].name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </MiddleDiv>
        </Container>
      ) : <h1>Carregando...</h1> }
    </Main>
  );
};

export default StatisticScreen;
