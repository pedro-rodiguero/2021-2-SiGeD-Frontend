import React, { useState, useEffect } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import GenericRegisterScreen from '../../Components/GenericRegisterScreen';
import { validateFields } from '../../Utils/validations';
import {
  getClients, updateClient, getFeatures, getClientFeatures,
} from '../../Services/Axios/clientServices';
import ClientForms from '../../Components/ClientForms';
import { useProfileUser } from '../../Context';
import ClientForm from '../../Models/clientForm';

const ClientUpdateScreen = () => {
  const history = useHistory();
  const [updateClientInputName, setupdateClientInputName] = useState('');
  const [updateClientInputEmail, setupdateClientInputEmail] = useState('');
  const [updateClientInputCpf, setupdateClientInputCpf] = useState('');
  const [updateClientInputAddress, setupdateClientInputAddress] = useState('');
  const [updateClientInputPhone, setupdateClientInputPhone] = useState('');
  const [updateClientInputSecondaryPhone, setupdateClientInputSecondaryPhone] = useState('');
  const [inputRegisterClientImage, setRegisterClientInputImage] = useState('');
  const [officeOption, setOfficeOption] = useState('');
  const [updateLocation, setupdateLocation] = useState('');
  const [featuresList, setFeaturesList] = useState([]);
  const [clientFeaturesID, setClientFeaturesID] = useState([]);
  const [clientFeatures, setClientFeatures] = useState([]);
  const [selectedFeaturesID, setSelectedFeaturesID] = useState([]);
  const [baseImage, setBaseImage] = useState('');
  const [clientForm, setClientForm] = useState(new ClientForm());
  const { id } = useParams();
  const { startModal, user, token } = useProfileUser();

  const getClientFromApi = async () => {
    getClients(`clients/${id}`, startModal)
      .then((response) => {
        const { data } = response;
        setClientForm(data);
        setupdateClientInputName(data?.name);
        setupdateClientInputEmail(data?.email);
        setupdateClientInputCpf(data?.cpf);
        setupdateClientInputPhone(data?.phone);
        setupdateClientInputSecondaryPhone(data?.secondaryPhone);
        setupdateClientInputAddress(data?.address);
        setOfficeOption(data?.office);
        if (data.location == null) {
          data.location = 'location';
        }
        setupdateLocation(data?.location.name);
        setClientFeaturesID(data?.features);
        setRegisterClientInputImage(data?.image);
      });
  };

  const getFeaturesFromAPI = () => {
    getFeatures('/features')
      .then((response) => setFeaturesList(response.data));
  };

  const getClientFeaturesList = () => {
    console.log(clientFeatures);
    getClientFeatures(clientFeaturesID, startModal)
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
    setSelectedFeaturesID(clientFeaturesID);
  }, [clientFeaturesID]);

  const submit = async () => {
    const validMessage = validateFields(clientForm);
    if (!validMessage.length) {
      const data = await updateClient(
        updateClientInputName, updateClientInputEmail,
        updateClientInputCpf, updateClientInputPhone,
        updateClientInputSecondaryPhone, updateClientInputAddress,
        officeOption, updateLocation, selectedFeaturesID, id, startModal, user._id,
        baseImage,
      ).then((response) => response.data);
      return history.push(`/perfil/${data._id}`);
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
      { user && token ? (
        <GenericRegisterScreen
          sidebarList={[updateClientInputName, updateClientInputCpf,
            updateClientInputAddress, officeOption, updateLocation]}
          sidebarFooter={[updateClientInputEmail, updateClientInputPhone]}
          cancel={cancel}
          submit={submit}
          buttonTitle="Editar"
          inputImage={inputRegisterClientImage}
          setInputImage={setRegisterClientInputImage}
          baseImage={baseImage}
          setBaseImage={setBaseImage}
        >
          <ClientForms
            featuresList={featuresList}
            onChangeSelectedFeatures={setClientFeatures}
            clientForm={clientForm}
            onChange={setClientForm}
          />
        </GenericRegisterScreen>
      ) : null}
    </div>
  );
};

export default ClientUpdateScreen;
