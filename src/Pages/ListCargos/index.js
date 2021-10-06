import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import GenericListScreen from '../../Components/GenericListScreen';
import {
  TableHeader, TableTitle, P, Bar,
} from './Style';
import {
  getCargos, createCargo, updateCargo, deleteCargo,
} from '../../Services/Axios/clientServices';
import { useProfileUser } from '../../Context';
import DataList from '../../Components/DataList';
import ModalComp from '../../Components/ModalComp';

const WorkspaceListScreen = () => {
  const { token, startModal } = useProfileUser();
  const [word, setWord] = useState();
  const [filterWorkspaces, setFilterWorkspaces] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [statusModal, setStatusModal] = useState(false);

  const toggleModal = () => setStatusModal(!statusModal);

  const getWorkspacesFromApi = async () => {
    await getCargos('role', startModal)
      .then((response) => setWorkspaces(response.data));
  };

  useEffect(() => {
    getWorkspacesFromApi();
  }, [token]);

  useEffect(() => {
    setFilterWorkspaces(workspaces);
  }, [workspaces]);

  useEffect(() => {
    setFilterWorkspaces(
      workspaces.filter((workspace) => workspace.name.toLowerCase().includes(word?.toLowerCase())),
    );
  }, [word]);

  const listWorkspaces = () => {
    if (workspaces?.length === 0) {
      return <h1>Sem resultados</h1>;
    }
    if (filterWorkspaces?.length === 0) {
      return <h1>Sem resultados</h1>;
    }
    return filterWorkspaces?.map((workspace) => (
      <DataList
        content={workspace}
        getContent={getWorkspacesFromApi}
        color="black"
        axiosDelete={deleteCargo}
        updateContent={updateCargo}
        type="Cargos"
      />
    ));
  };

  if (!localStorage.getItem('@App:token')) {
    return <Redirect to="/login" />;
  }

  return (
    <GenericListScreen
      ButtonTitle="Novo Cargo"
      ButtonFunction={toggleModal}
      PageTitle="Cargos"
      SearchWord={word}
      setWord={setWord}
      ListType={listWorkspaces()}
      redirectTo="/cargos"
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
      { statusModal ? <ModalComp show={statusModal} type="Cargos" operation="Nova " idName="" idDescription="" idColor="#000000" getContent={getWorkspacesFromApi} handleClose={toggleModal} createContent={createCargo} /> : null}
    </GenericListScreen>
  );
};

export default WorkspaceListScreen;
