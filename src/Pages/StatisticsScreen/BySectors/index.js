import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
} from 'recharts';
import moment from 'moment';
import { getDemandsStatistics, getCategories } from '../../../Services/Axios/demandsServices';
import {
  Main, Title, Container, Card, CardTitle, TopDiv, MiddleDiv, FiltersDiv, DropdownDiv,
  SearchDiv, TextLabel, DateInput, styles,
} from './Style';
import DropdownComponent from '../../../Components/DropdownComponent';
import colors from '../../../Constants/colors';
import { getSectors } from '../../../Services/Axios/sectorServices';
import { useProfileUser } from '../../../Context';

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

  const getCategoriesFromApi = async () => {
    await getCategories('category', startModal)
      .then((response) => {
        setCategories([...categories, ...response.data]);
      })
      .catch((error) => {
        console.error(`An unexpected error ocourred while getting categories.${error}`);
      });
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
            <Title>Estatísticas</Title>
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
                <DropdownDiv
                  style={{ width: '40%' }}
                >
                  <TextLabel>
                    Data de Inicio:
                  </TextLabel>
                  <DateInput
                    type="date"
                    value={initialDate}
                    onChange={(e) => setInitialDate(e.target.value)}
                  />
                </DropdownDiv>
                <DropdownDiv
                  style={{ width: '40' }}
                >
                  <TextLabel>
                    Data final:
                  </TextLabel>
                  <DateInput
                    type="date"
                    value={finalDate}
                    onChange={(e) => setFinalDate(e.target.value)}
                  />
                </DropdownDiv>
              </SearchDiv>
            </FiltersDiv>
          </TopDiv>
          <MiddleDiv>
            <Card>
              <CardTitle>Demandas por setor</CardTitle>
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
