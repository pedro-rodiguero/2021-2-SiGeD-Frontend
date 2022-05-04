import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import ClientProfileData from '../../Components/ClientProfileData';
import GenericListScreen from '../../Components/GenericListScreen';
import {
  TableHeader, P, Bar, TableTitle, Dropdown, styles,
} from './Style';
import {
  customStyles,
} from '../StatisticsScreen/Style';
import { getClients } from '../../Services/Axios/clientServices';
import { getSectors } from '../../Services/Axios/sectorServices';
import { getClientByDemands } from '../../Services/Axios/demandsServices';
import DropdownComponent from '../../Components/DropdownComponent';
import colors from '../../Constants/colors';
import { useProfileUser } from '../../Context';
import activeClient from '../StatisticsScreen/utils/alternateClient';

const ClientListScreen = () => {
  const { token, user, startModal } = useProfileUser();
  const [word, setWord] = useState();
  const [filterClients, setFilterClients] = useState([]);
  const [sectors, setSectors] = useState(['Todos']);
  const [sectorActive, setSectorActive] = useState('Todos');
  const [sectorID, setSectorID] = useState('');
  const [clients, setClients] = useState([]);
  const [active, setActive] = useState('Ativos');
  const [query, setQuery] = useState(true);

  const getClientsFromApi = async () => {
    await getClients(`clients?active=${query}`, startModal)
      .then((response) => setClients(activeClient(response.data)));
  };

  const getSectorsFromApi = async () => {
    await getSectors(startModal)
      .then((response) => {
        setSectors([...sectors, ...response.data]);
      });
  };

  const getClientsStatistics = async () => {
    await getClientByDemands(
      `statistic/client?&idSector=${sectorID}&idCategory=null&initialDate=${moment('2021-01-01').format('YYYY-MM-DD')}&finalDate=${moment().format('YYYY-MM-DD')}&idClients=null`,
      startModal,
    )
      .then((response) => {
        const clientsList = [];
        response.data?.map((item) => {
          clients.map((client) => {
            if (item._id === client?._id) {
              clientsList.push(client);
            }
            return true;
          });
          return true;
        });
        const clearArr = [...new Set(clientsList)];
        setFilterClients(clearArr);
      });
  };

  useEffect(() => {
    if (sectorActive !== 'Todos') {
      const results = sectors.find((element) => element.name === sectorActive);
      setSectorID(results._id);
    } else {
      setSectorID(null);
    }
  }, [sectorActive]);

  useEffect(() => {
    if (user && token) {
      getSectorsFromApi();
    }
  }, [token, user]);

  useEffect(() => {
    if (sectorID) {
      getClientsStatistics();
      return;
    }
    getClientsFromApi();
  }, [sectorID]);

  useEffect(() => {
    getClientsFromApi();
  }, [token, query, active]);

  useEffect(() => {
    setFilterClients(
      clients.filter((client) => client.name.toLowerCase().includes(word?.toLowerCase())),
    );
  }, [word]);

  useEffect(() => {
    if (active === 'Inativos') {
      setQuery(false);
    } else {
      setQuery(true);
    }
  }, [active]);

  useEffect(() => {
    setFilterClients(clients);
  }, [clients]);

  const listClients = () => {
    if (clients?.length === 0) {
      return <h1 style={styles.headerStyle}>Sem resultados</h1>;
    }
    if (filterClients?.length === 0) {
      return <h1 style={styles.headerStyle}>Sem resultados</h1>;
    }
    return filterClients?.map((client) => (
      <ClientProfileData
        client={client}
        key={client.email}
        getClientsFromAPI={getClientsFromApi}
        query={query}
      />
    ));
  };

  if (!localStorage.getItem('@App:token')) {
    return <Redirect to="/login" />;
  }

  return (
    <GenericListScreen
      ButtonTitle="Novo Cliente"
      PageTitle="Clientes"
      SearchWord={word}
      setWord={setWord}
      ListType={listClients()}
      redirectTo="/cliente"
      clientList
    >
      <TableHeader>
        <TableTitle width={25}>
          <P>Nome</P>
        </TableTitle>
        <Bar />
        <TableTitle width={25}>
          <P>Email</P>
        </TableTitle>
        <Bar />
        <TableTitle width={15}>
          <P>CPF</P>
        </TableTitle>
        <Bar />
        <TableTitle width={15}>
          <P>Telefone</P>
        </TableTitle>
        <Bar />
        <TableTitle width={19}>
          <P>Ult. Atualização</P>
        </TableTitle>
      </TableHeader>
      <Dropdown>
        <DropdownComponent
          OnChangeFunction={(Option) => setActive(Option.target.value)}
          style={styles.dropdownComponentStyle}
          optionStyle={{
            backgroundColor: `${colors.secondary}`,
          }}
          optionList={['Ativos', 'Inativos']}
        />
      </Dropdown>
      <Dropdown>
        <div style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}>
          <Select
            onChange={(e) => setSectorActive(e.value)}
            defaultValue="Todos"
            options={sectors.map((sector) => ({
              value: sector.name || sector,
              label: sector.name || sector,
            }))}
            styles={customStyles}
            placeholder="Nome do setor"
          />
        </div>
      </Dropdown>
    </GenericListScreen>
  );
};

export default ClientListScreen;
