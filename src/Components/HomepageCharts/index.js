import React, { useEffect, useState } from 'react';
import {
  Cell, ResponsiveContainer, Tooltip,
  BarChart, CartesianGrid, XAxis, Bar, YAxis,
} from 'recharts';
import moment from 'moment';
import { getDemandsStatistics, getCategories } from '../../Services/Axios/demandsServices';
import {
  Main, Card, ChartsDiv, Container,
} from './Style';
import { getSectors } from '../../Services/Axios/sectorServices';
import { useProfileUser } from '../../Context';

const HomepageCharts = () => {
  const { token, user, startModal } = useProfileUser();
  const [sectors, setSectors] = useState(['Todos']);
  const [loading, setLoading] = useState(true);
  const [categoryStatistics, setCategoryStatistics] = useState([]);
  const [sectorChartData, setSectorChartData] = useState([]);
  const [categories, setCategories] = useState(['Todas']);
  const initialDate = (moment('2000-01-01').format('YYYY-MM-DD'));
  const finalDate = (moment().format('YYYY-MM-DD'));

  const getSectorsApi = async () => {
    await getSectors(startModal)
      .then((response) => {
        setSectors([...sectors, ...response.data]);
        setLoading(false);
      });
  };

  const getCategoriesApi = async () => {
    await getCategories('category', startModal)
      .then((response) => {
        setCategories([...categories, ...response.data]);
      })
      .catch((error) => {
        console.error(`An unexpected error ocourred while getting categories.${error}`);
      });
  };

  const getStatisticsCategories = async (idSector, idCategory) => {
    await getDemandsStatistics(
      `statistic/category?idSector=${idSector}&idCategory=${idCategory}&initialDate=${initialDate}&finalDate=${finalDate}`,
      startModal,
    )
      .then((response) => {
        setCategoryStatistics(response?.data);
      });
  };

  const getStatisticsSectors = async (idCategory) => {
    await getDemandsStatistics(
      `statistic/sector?idCategory=${idCategory}&initialDate=${initialDate}&finalDate=${finalDate}`,
      startModal,
    )
      .then((response) => {
        const sectorChart = [];
        response.data?.map((item) => {
          sectors.map((sector) => {
            if (item._id === sector?._id) {
              const data = {
                _id: sector._id,
                name: sector.name,
                total: item.total,
              };
              sectorChart.push(data);
            }
            return true;
          });
          return true;
        });
        setSectorChartData(sectorChart);
      });
  };

  useEffect(() => {
    if (user && token) {
      getSectorsApi();
      getCategoriesApi();
      getStatisticsCategories(null, null);
      getStatisticsSectors(null);
    }
  }, [token, user]);

  useEffect(() => {
    getStatisticsSectors(null);
  }, [loading]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D088FE', '#D0C49F', '#3FBB28', '#3F8042',
    '#EE88FE', '#EEC49F', '#11BB28', '#118042', '#D0FFFE', '#E08F9F', '#FF2928', '#6FED42'];

  return (
    <Main>
      { user ? (
        <Container>
          <ChartsDiv>
            <Card>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={sectorChartData}
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
                    {sectorChartData?.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
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
            </Card>
          </ChartsDiv>
        </Container>
      ) : <h1>Carregando...</h1> }
    </Main>
  );
};

export default HomepageCharts;
