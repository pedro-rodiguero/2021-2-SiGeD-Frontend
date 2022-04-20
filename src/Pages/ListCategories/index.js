import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import ModalComp from '../../Components/ModalComp';
import {
  TableHeader, TableTitle, P, Bar, Dropdown, styles,
} from './Style';
import GenericListScreen from '../../Components/GenericListScreen';
import DropdownComponent from '../../Components/DropdownComponent';
import {
  getCategories, createCategory, updateCategory, toggleCategory, getDemands,
} from '../../Services/Axios/demandsServices';
import DataList from '../../Components/DataList';
import colors from '../../Constants/colors';
import { useProfileUser } from '../../Context';

const ListCategories = () => {
  const { token, startModal } = useProfileUser();
  const [filterCategories, setFilterCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [word, setWord] = useState();
  const [statusModal, setStatusModal] = useState(false);
  const [demands, setDemands] = useState([]);
  const [active, setActive] = useState('Ativos');
  const [setQuery] = useState(true);

  const getDemandFromApi = async () => {
    await getDemands('demand', startModal)
      .then((response) => setDemands(response?.data));
  };

  const toggleModal = () => setStatusModal(!statusModal);

  const listCategories = async () => {
    await getCategories('category', startModal)
      .then((response) => setCategories(response.data))
      .catch((error) => {
        console.error(`An unexpected error ocourred while getting categories.${error}`);
      });
  };

  useEffect(() => {
    listCategories();
    getDemandFromApi();
  }, [token]);

  useEffect(() => {
    setFilterCategories(
      categories.filter((category) => category.name.toLowerCase().includes(word?.toLowerCase())),
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
    setFilterCategories(categories);
  }, [categories]);

  const renderCategories = () => {
    if (categories?.length === 0) {
      return <h1>Sem resultados</h1>;
    }
    if (filterCategories?.length === 0) {
      return <h1>Sem resultados</h1>;
    }
    return filterCategories?.map((category) => (
      <DataList
        content={category}
        getContent={listCategories}
        backgroundColor={category.color}
        color={colors.secondary}
        axiosDelete={toggleCategory}
        updateContent={updateCategory}
        type="Categoria"
        demands={demands}
      />
    ));
  };

  if (!localStorage.getItem('@App:token')) {
    return <Redirect to="/login" />;
  }

  return (
    <GenericListScreen
      ButtonTitle="Nova Categoria"
      ButtonFunction={toggleModal}
      PageTitle="Categorias"
      SearchWord={word}
      setWord={setWord}
      ListType={renderCategories()}
      redirectTo="/categorias"
    >
      <TableHeader>
        <TableTitle width={24}>
          <P>Nome</P>
        </TableTitle>
        <Bar />
        <TableTitle width={50}>
          <P>Descrição</P>
        </TableTitle>
        <Bar />
        <TableTitle width={24}>
          <P>Ult. Atualização</P>
        </TableTitle>
        <TableTitle width={2} />
      </TableHeader>
      { statusModal ? <ModalComp show={statusModal} type="Categoria" operation="Nova " idName="" idDescription="" idColor="#000000" getContent={listCategories} handleClose={toggleModal} createContent={createCategory} /> : null}
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
    </GenericListScreen>
  );
};

export default ListCategories;
