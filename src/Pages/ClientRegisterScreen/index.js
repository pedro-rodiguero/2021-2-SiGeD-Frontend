import React, { useState, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import GenericRegisterScreen from '../../Components/GenericRegisterScreen';
import { validateFields } from '../../Utils/validations';
import ClientForms from '../../Components/ClientForms';
import { useProfileUser } from '../../Context';
import { postClient, getFeatures } from '../../Services/Axios/clientServices';
import ClientForm from '../../Models/clientForm';

const ClientRegisterScreen = () => {
  const history = useHistory();
  const [registerClientInputName, setRegisterClientInputName] = useState('');
  const [registerClientInputEmail, setRegisterClientInputEmail] = useState('');
  const [registerClientInputCpf, setRegisterClientInputCpf] = useState('');
  const [registerClientInputAddress, setRegisterClientInputAddress] = useState('');
  const [registerClientInputPhone, setRegisterClientInputPhone] = useState('');
  const [inputRegisterClientImage, setRegisterClientInputImage] = useState('');
  const [officeOption, setOfficeOption] = useState('Cargo');
  const [registerLocation, setRegisterLocation] = useState('Lotação');
  const [featuresList, setFeaturesList] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [baseImage, setBaseImage] = useState('');
  const [clientForm, setClientForm] = useState(new ClientForm());
  const { startModal, user } = useProfileUser();

  const getFeaturesFromAPI = () => {
    getFeatures('/features').then((response) => setFeaturesList(response.data));
  };

  useEffect(() => {
    getFeaturesFromAPI();
  }, []);

  const submit = async () => {
    const validMessage = validateFields(clientForm);
    if (!validMessage.length) {
      const data = await postClient(clientForm, user._id, startModal);
      if (data) {
        return history.push(`/perfil/${data._id}`);
      }
      return undefined;
    }
    startModal(validMessage.join('\n'));
    return undefined;
  };

  const cancel = () => {
    setRegisterClientInputName('');
    setRegisterClientInputCpf('');
    setRegisterClientInputEmail('');
    setRegisterClientInputPhone('');
    setRegisterClientInputAddress('');
    setOfficeOption('');
    setRegisterLocation('');
    setClientForm(new ClientForm());
  };

  if (!localStorage.getItem('@App:token')) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <GenericRegisterScreen
        sidebarList={[
          registerClientInputName,
          registerClientInputCpf,
          registerClientInputAddress,
          officeOption,
          registerLocation,
        ]}
        sidebarFooter={[registerClientInputEmail, registerClientInputPhone]}
        cancel={cancel}
        submit={submit}
        buttonTitle="Cadastrar"
        inputImage={inputRegisterClientImage}
        setInputImage={setRegisterClientInputImage}
        baseImage={baseImage}
        setBaseImage={setBaseImage}
      >
        <ClientForms
          featuresList={featuresList}
          onChangeSelectedFeatures={setSelectedFeatures}
          selectedFeatures={selectedFeatures}
          clientForm={clientForm}
          onChange={setClientForm}
        />
      </GenericRegisterScreen>
    </div>
  );
};

export default ClientRegisterScreen;
