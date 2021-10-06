import React, { useState, useEffect } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import GenericRegisterScreen from '../../Components/GenericRegisterScreen';
import { validateFields } from '../../Utils/validations';
import {
  getClients,
  updateClient,
  getFeatures,
  getClientFeatures,
} from '../../Services/Axios/clientServices';
import ClientForms from '../../Components/ClientForms';
import { useProfileUser } from '../../Context';
import ClientForm from '../../Models/clientForm';

const ClientUpdateScreen = () => {
  const history = useHistory();
  const [featuresList, setFeaturesList] = useState([]);
  const [clientFeatures, setClientFeatures] = useState([]);
  const [baseImage, setBaseImage] = useState('');
  const [clientForm, setClientForm] = useState(new ClientForm());
  const { id } = useParams();
  const { startModal, user, token } = useProfileUser();

  const getClientFromApi = async () => {
    getClients(`clients/${id}`, startModal).then(({ data }) => {
      setClientForm(new ClientForm(data));
    });
  };

  const getFeaturesFromAPI = () => {
    getFeatures('/features').then((response) => setFeaturesList(response.data));
  };

  const getClientFeaturesList = () => {
    getClientFeatures(clientForm.features, startModal)
      .then((response) => setClientFeatures(response.data));
  };

  useEffect(() => {
    if (token && user) {
      getClientFromApi();
      getFeaturesFromAPI();
    }
  }, [token, user]);

  useEffect(() => {
    getClientFeaturesList();
  }, [clientForm.features]);

  const submit = async () => {
    const validMessage = validateFields(clientForm);
    if (!validMessage.length) {
      const response = await updateClient(id, clientForm, user._id, startModal);
      return history.push(`/perfil/${response.data?._id}`);
    }
    startModal(validMessage.join('\n'));
    return undefined;
  };

  const cancel = () => {
    history.push(`/perfil/${id}`);
  };

  if (!localStorage.getItem('@App:token')) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      {user && token ? (
        <GenericRegisterScreen
          sidebarList={[
            clientForm.name,
            clientForm.cpf,
            clientForm.address,
            clientForm.office,
            clientForm.location,
          ]}
          sidebarFooter={[clientForm.email, clientForm.phone]}
          cancel={cancel}
          submit={submit}
          buttonTitle="Editar"
          inputImage={clientForm.image}
          setInputImage={(image) => setClientForm({ ...clientForm, image })}
          baseImage={baseImage}
          setBaseImage={setBaseImage}
        >
          <ClientForms
            featuresList={featuresList}
            clientFeatures={clientFeatures}
            clientForm={clientForm}
            onChange={setClientForm}
          />
        </GenericRegisterScreen>
      ) : null}
    </div>
  );
};

export default ClientUpdateScreen;
