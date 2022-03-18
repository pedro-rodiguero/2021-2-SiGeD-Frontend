import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
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
      `statistic/sector?isDemandActive=${query}&idCategory=${idCategory}&initialDate=${initialDate}&finalDate=${finalDate}`,
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
  }, [query, categoryID, finalDate, initialDate]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
              <ResponsiveContainer width="100%" height="90%">
                <PieChart width={400} height={300}>
                  <Pie
                    data={sectorGraphData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="total"
                    label
                  >
                    {sectorGraphData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </MiddleDiv>
        </Container>
      ) : <h1>Carregando...</h1> }
    </Main>
  );
};

export default StatisticBySectors;
