import React, { useEffect, useState } from 'react';
import {
  Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, CartesianGrid, XAxis, Bar, YAxis,
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

const StatisticScreen = () => {
  const { token, user, startModal } = useProfileUser();
  const [sectors, setSectors] = useState(['Todos']);
  const [sectorActive, setSectorActive] = useState('Todos');
  const [sectorID, setSectorID] = useState('');
  const [categoryStatistics, setCategoryStatistics] = useState([]);
  const [categories, setCategories] = useState(['Todas']);
  const [initialDate, setInitialDate] = useState(moment('2021-01-01').format('YYYY-MM-DD'));
  const [finalDate, setFinalDate] = useState(moment().format('YYYY-MM-DD'));
  const [active, setActive] = useState('Todas');
  const [query, setQuery] = useState('all');
  const getSectorsFromApi = async () => {
    await getSectors(startModal)
      .then((response) => {
        setSectors([...sectors, ...response.data]);
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
    if (sectorActive !== 'Todos') {
      const results = sectors.find((element) => element.name === sectorActive);
      setSectorID(results._id);
    } else {
      setSectorID(null);
    }
  }, [sectorActive]);

  const getCategoriesStatistics = async (idSector) => {
    await getDemandsStatistics(
      `statistic/category?isDemandActive=${query}&idSector=${idSector}&initialDate=${initialDate}&finalDate=${finalDate}`,
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
      getCategoriesStatistics(null, null);
    }
  }, [token, user]);

  useEffect(() => {
    getCategoriesStatistics(sectorID);
  }, [query, sectorID, finalDate, initialDate]);

  useEffect(() => {
    getCategoriesStatistics(sectorID);
  }, [query, finalDate, initialDate]);

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
              <CardTitle>Demandas por categoria</CardTitle>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={categoryStatistics}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 2,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categories[0].name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="demandas">
                    {categoryStatistics?.map((entry, index) => (
                      <Cell key={index} fill={entry?.categories[0]?.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </MiddleDiv>
        </Container>
      ) : <h1>Carregando...</h1> }
    </Main>
  );
};

export default StatisticScreen;
