import React, { useEffect, useState } from 'react';
import { BsDownload } from 'react-icons/bs';
import {
  Cell, ResponsiveContainer, Tooltip,
  BarChart, CartesianGrid, XAxis, Bar, YAxis,
} from 'recharts';
import moment from 'moment';
import { getDemandsStatistics } from '../../../Services/Axios/demandsServices';
import {
  Main, Title, Container, Card, TopDiv, MiddleDiv,
  FiltersDiv, SearchDiv, Button,
} from '../Style';
import { getSectors } from '../../../Services/Axios/sectorServices';
import { useProfileUser } from '../../../Context';
import getCategoriesFromApiService from '../utils/services';
import { getClients } from '../../../Services/Axios/clientServices';
import activeClient from '../utils/alternateClient';
import { DemandStatistics } from '../../../Utils/reports/printDemandReport';
import StatisctsFilters from '../Filters';

const StatisticScreen = () => {
  const { token, user, startModal } = useProfileUser();
  const [sectors, setSectors] = useState(['Todos']);
  const [sectorActive, setSectorActive] = useState('Todos');
  const [sectorID, setSectorID] = useState('');
  const [categoryStatistics, setCategoryStatistics] = useState([]);
  const [categories, setCategories] = useState(['Todas']);
  const [categoryID, setCategoryID] = useState('');
  const [categoryActive, setCategoryActive] = useState('Todas');
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

  useEffect(() => {
    if (categoryActive !== 'Todas') {
      const results = categories.find((element) => element.name === categoryActive);
      setCategoryID(results._id);
    } else {
      setCategoryID(null);
    }
  }, [categoryActive]);

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
      `statistic/category?isDemandActive=${query}&idSector=${idSector}&idCategory=${categoryID}&initialDate=${initialDate}&finalDate=${finalDate}&idClients=${clientID}`,
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
  }, [query, sectorID, categoryID, finalDate, initialDate, clientID]);

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
        clientSelectArray.unshift({ label: 'Todos', value: null });
        setClientList(clientSelectArray);
      });
  };

  useEffect(() => getClientsFromApi(), []);

  return (
    <Main>
      {user ? (
        <Container>
          <TopDiv>
            <Title>Estatísticas - Demandas por Categoria</Title>
            <FiltersDiv>
              <SearchDiv>
                <StatisctsFilters
                  setActive={setActive}
                  setClientID={setClientID}
                  setCategoryActive={setCategoryActive}
                  setSectorActive={setSectorActive}
                  categories={categories}
                  sectors={sectors}
                  clientList={clientList}
                  initialDate={initialDate}
                  setInitialDate={setInitialDate}
                  setFinalDate={setFinalDate}
                  finalDate={finalDate}
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
                    sectorActive,
                    categoryActive,
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
      ) : <h1>Carregando...</h1>}
    </Main>
  );
};

export default StatisticScreen;
