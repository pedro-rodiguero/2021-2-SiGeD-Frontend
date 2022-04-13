import React, { useEffect, useState } from 'react';
import {
  Cell, ResponsiveContainer, Tooltip,
  BarChart, CartesianGrid, XAxis, Bar, YAxis,
} from 'recharts';
import moment from 'moment';
import { getDemandsStatistics } from '../../../Services/Axios/demandsServices';
import {
  Main, Title, Container, Card, TopDiv, MiddleDiv, FiltersDiv, DropdownDiv,
  SearchDiv, TextLabel, styles,
} from '../Style';
import colors from '../../../Constants/colors';
import DropdownComponent from '../../../Components/DropdownComponent';
import { getSectors } from '../../../Services/Axios/sectorServices';
import { useProfileUser } from '../../../Context';
import getCategoriesFromApiService from '../utils/services';
import Dropdown from '../utils/Dropdown';
import { getClients } from '../../../Services/Axios/clientServices';
import activeClient from '../utils/alternateClient';

const StatisticBySectors = () => {
  const { token, user, startModal } = useProfileUser();
  const [sectors, setSectors] = useState(['Todos']);
  const [loading, setLoading] = useState(true);
  const [sectorGraphData, setSectorGraphData] = useState([]);
  const [categories, setCategories] = useState(['Todas']);
  const [categoryActive, setCategoryActive] = useState('Todas');
  const [categoryID, setCategoryID] = useState('');
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
        setLoading(false);
      });
  };

  useEffect(() => {
    if (categoryActive !== 'Todas') {
      const results = categories.find((element) => element.name === categoryActive);
      setCategoryID(results._id);
    } else {
      setCategoryID(null);
    }
  }, [categoryActive]);

  const getSectorStatistics = async (idCategory) => {
    await getDemandsStatistics(
      `statistic/sector?isDemandActive=${query}&idCategory=${idCategory}&initialDate=${initialDate}&finalDate=${finalDate}&idClients=${clientID}`,
      startModal,
    )
      .then((response) => {
        const sectorGraph = [];
        response.data?.map((item) => {
          sectors.map((sector) => {
            if (item._id === sector?._id) {
              const data = {
                _id: sector._id,
                name: sector.name,
                total: item.total,
              };
              sectorGraph.push(data);
            }
            return true;
          });
          return true;
        });
        setSectorGraphData(sectorGraph);
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
    if (user && token) {
      getSectorsFromApi();
      getCategoriesFromApi();
      getSectorStatistics(null);
    }
  }, [token, user]);

  useEffect(() => {
    getSectorStatistics(null);
  }, [loading]);

  useEffect(() => {
    getSectorStatistics(categoryID);
  }, [query, categoryID, finalDate, initialDate, clientID]);

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

  useEffect(() => getClientsFromApi(), []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D088FE', '#D0C49F', '#3FBB28', '#3F8042',
    '#EE88FE', '#EEC49F', '#11BB28', '#118042', '#D0FFFE', '#E08F9F', '#FF2928', '#6FED42'];

  return (
    <Main>
      { user ? (
        <Container>
          <TopDiv>
            <Title>Estatísticas - Demandas por Setor</Title>
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
                <Dropdown
                  initialDate={initialDate}
                  setInitialDate={setInitialDate}
                  finalDate={finalDate}
                  setFinalDate={setFinalDate}
                />
              </SearchDiv>
            </FiltersDiv>
          </TopDiv>
          <MiddleDiv>
            <Card>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart
                  data={sectorGraphData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 2,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total">
                    {sectorGraphData?.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="legenda">
                {sectorGraphData.map((entry, index) => (
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

export default StatisticBySectors;
