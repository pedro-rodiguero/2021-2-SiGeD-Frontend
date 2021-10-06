import React, { useState, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import GenericRegisterScreen from '../../Components/GenericRegisterScreen';
import { validateFields } from '../../Utils/validations';
import ClientForms from '../../Components/ClientForms';
import { useProfileUser } from '../../Context';
import { postClient, getFeatures, getClientFeatures } from '../../Services/Axios/clientServices';
import ClientForm from '../../Models/clientForm';

const ClientRegisterScreen = () => {
  const history = useHistory();
  const [featuresList, setFeaturesList] = useState([]);
  const [clientFeatures, setClientFeatures] = useState([]);
  const [baseImage, setBaseImage] = useState('');
  const [clientForm, setClientForm] = useState(new ClientForm());
  const { startModal, user } = useProfileUser();

  const getFeaturesFromAPI = () => {
    getFeatures('/features').then((response) => setFeaturesList(response.data));
  };

  const getClientFeaturesList = () => {
    getClientFeatures(clientForm.features, startModal)
      .then((response) => setClientFeatures(response.data));
  };

  useEffect(() => {
    getClientFeaturesList();
  }, [clientForm.features]);

  useEffect(() => {
    getFeaturesFromAPI();
  }, []);

  const submit = async () => {
    const validMessage = validateFields(clientForm);
    if (!validMessage.length) {
      const response = await postClient(clientForm, user._id, startModal);
      console.log(response);
      if (response) {
        return history.push(`/perfil/${response.data?._id}`);
      }
      return undefined;
    }
    startModal(validMessage.join('\n'));
    return undefined;
  };

  const cancel = () => {
    setClientForm(new ClientForm());
  };

  if (!localStorage.getItem('@App:token')) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
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
        buttonTitle="Cadastrar"
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
    </div>
  );
};

export default ClientRegisterScreen;
