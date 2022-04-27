import React, { useEffect, useState } from 'react';
import {
  Cell, ResponsiveContainer, Tooltip,
  BarChart, CartesianGrid, XAxis, Bar, YAxis,
} from 'recharts';
import { BsDownload } from 'react-icons/bs';
import moment from 'moment';
import { getClientByDemands } from '../../../Services/Axios/demandsServices';
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

const StatisticClientScreen = () => {
  const { token, user, startModal } = useProfileUser();
  const [sectors, setSectors] = useState(['Todos']);
  const [sectorActive, setSectorActive] = useState('Todos');
  const [sectorID, setSectorID] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [categories, setCategories] = useState(['Todas']);
  const [categoryActive, setCategoryActive] = useState('Todas');
  const [initialDate, setInitialDate] = useState(moment('2021-01-01').format('YYYY-MM-DD'));
  const [finalDate, setFinalDate] = useState(moment().format('YYYY-MM-DD'));
  const [clientID, setClientID] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [active, setActive] = useState('Todas');
  const [query, setQuery] = useState('all');
  const [clientGraphData, setClientGraphData] = useState([]);

  const getSectorsFromApi = async () => {
    await getSectors(startModal)
      .then((response) => {
        setSectors([...sectors, ...response.data]);
      });
  };

  const getClientsFromApi = async () => {
    await getClients(`clients?active=${null}`, startModal)
      .then((response) => {
        const clientSelectArray = activeClient(response.data).map((client) => (
          {
            name: client.name,
            _id: client._id,
          }));
        setClientList(clientSelectArray);
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
    if (categoryActive !== 'Todas') {
      const results = categories.find((element) => element.name === categoryActive);
      setCategoryID(results._id);
    } else {
      setCategoryID(null);
    }
  }, [categoryActive]);

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

  const getClientsStatistics = async (idCategory) => {
    await getClientByDemands(
      `statistic/client?isDemandActive=${query}&idSector=${sectorID}&idCategory=${idCategory}&initialDate=${initialDate}&finalDate=${finalDate}&idClients=${clientID}`,
      startModal,
    )
      .then((response) => {
        const clientsGraph = [];
        response.data?.map((item) => {
          clientList.map((client) => {
            if (item._id === client?._id) {
              const data = {
                _id: client._id,
                name: client.name,
                total: item.demandas,
              };
              clientsGraph.push(data);
            }
            return true;
          });
          return true;
        });
        setClientGraphData(clientsGraph);
      });
  };

  useEffect(() => {
    if (user && token) {
      getClientsFromApi();
      getSectorsFromApi();
      getCategoriesFromApi();
    }
  }, [token, user]);

  useEffect(() => {
    getClientsStatistics(categoryID);
  }, [query, sectorID, clientID, finalDate, initialDate, categoryID]);

  useEffect(() => {
    if (clientList.length > 0) {
      getClientsStatistics(null);
    }
  }, [clientList]);

  useEffect(() => {
    console.log(clientGraphData);
  }, [clientGraphData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D088FE', '#D0C49F', '#3FBB28', '#3F8042',
    '#EE88FE', '#EEC49F', '#11BB28', '#118042', '#D0FFFE', '#E08F9F', '#FF2928', '#6FED42'];

  return (
    <Main>
      { user ? (
        <Container>
          <TopDiv>
            <Title>Estatísticas - Demanda por Cliente</Title>
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
                        <option key={el._id} value={el._id}>{el.name}</option>
                      ))
                    }
                  </select>
                </DropdownDiv>
                <DropdownDiv>
                  <TextLabel>
                    Categoria:
                  </TextLabel>
                  <DropdownComponent
                    OnChangeFunction={(Option) => setCategoryActive(Option.target.value)}
                    style={styles.dropdownComponentStyle}
                    optionStyle={{
                      backgroundColor: `${colors.secondary}`,
                    }}
                    optionList={categories?.map(
                      (categoryx) => (categoryx.name ? categoryx.name : categoryx),
                    )}
                  />
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
              clientGraphData.length > 0
              && (
                <div style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-end',
                  margin: '10px 0',
                }}>
                  <Button onClick={() => DemandStatistics({
                    statisticsData: clientGraphData,
                    active,
                    categoryActive,
                    initialDate,
                    sectorActive,
                    clientID,
                    finalDate,
                    startModal,
                    reportType: 'CLIENTES',
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
                  data={clientGraphData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 2,
                    bottom: 40,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total">
                    {clientGraphData?.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="legenda">
                {clientGraphData.map((entry, index) => (
                  <div
                    key={`cell-${index}`}
                    style={{
                      display: 'flex', alignItems: 'center', margin: '0px 4px', fontSize: '1.5rem',
                    }}>
                    <div style={{ width: '20px', height: '10px', backgroundColor: COLORS[index] }} />
                    <span style={{ margin: '0px 5px' }}>{entry.name}</span>
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

export default StatisticClientScreen;
