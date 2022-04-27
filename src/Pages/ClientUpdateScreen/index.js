import React, { useState, useEffect } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import moment from 'moment';
import GenericRegisterScreen from '../../Components/GenericRegisterScreen';
import { validateFields } from '../../Utils/validations';
import {
  getClients, updateClient, getFeatures, getClientFeatures,
} from '../../Services/Axios/clientServices';
import ClientForms from '../../Components/ClientForms';
import { useProfileUser } from '../../Context';

const ClientUpdateScreen = () => {
  const history = useHistory();
  const [updateClientInputName, setupdateClientInputName] = useState('');
  const [updateClientInputEmail, setupdateClientInputEmail] = useState('');
  const [updateClientInputCpf, setupdateClientInputCpf] = useState('');
  const [updateClientInputAddress, setupdateClientInputAddress] = useState('');
  const [updateClientInputPhone, setupdateClientInputPhone] = useState('');
  const [updateClientInputSecondaryPhone, setupdateClientInputSecondaryPhone] = useState('');
  const [updateClientInputGender, setupdateClientInputGender] = useState('');
  const [updateClientInputBirthdate, setupdateClientInputBirthdate] = useState(moment().format('DD/MM/YYYY'));
  const [updateClientInputHealthRestrictions, setupdateClientInputHealthRestrictions] = useState('');
  const [updateClientInputAdministrativeRestrictions, setupdateClientInputAdministrativeRestrictions] = useState('');
  const [inputRegisterClientImage, setRegisterClientInputImage] = useState('');
  const [officeOption, setOfficeOption] = useState('');
  const [updateLocation, setupdateLocation] = useState('');
  const [featuresList, setFeaturesList] = useState([]);
  const [clientFeaturesID, setClientFeaturesID] = useState([]);
  const [clientFeatures, setClientFeatures] = useState([]);
  const [selectedFeaturesID, setSelectedFeaturesID] = useState([]);
  const [baseImage, setBaseImage] = useState('');
  const { id } = useParams();
  const { startModal, user, token } = useProfileUser();

  const setExistingData = (response) => {
    const { data } = response;
    setupdateClientInputName(data?.name);
    setupdateClientInputEmail(data?.email);
    setupdateClientInputCpf(data?.cpf);
    setupdateClientInputPhone(data?.phone);
    setupdateClientInputSecondaryPhone(data?.secondaryPhone);
    setupdateClientInputGender(data?.gender);
    setupdateClientInputBirthdate(moment(data?.birthdate).format('YYYY-MM-DD'));
    setupdateClientInputAdministrativeRestrictions(data?.administrativeRestrictions);
    setupdateClientInputHealthRestrictions(data?.healthRestrictions);
    setupdateClientInputAddress(data?.address);
    setOfficeOption(data?.office);
    if (data.location == null) {
      data.location = 'location';
    }
    setupdateLocation(data?.location._id);
    setClientFeaturesID(data?.features);
    setRegisterClientInputImage(data?.image);
  };

  const getClientFromApi = async () => {
    getClients(`clients/${id}`, startModal)
      .then((response) => setExistingData(response));
  };

  const getFeaturesFromAPI = () => {
    getFeatures('/features')
      .then((response) => setFeaturesList(response.data));
  };

  const getClientFeaturesList = () => {
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
    const phoneNoMask = updateClientInputPhone.replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '').replaceAll('-', '');
    const secondaryPhoneNoMask = updateClientInputSecondaryPhone.replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '').replaceAll('-', '');
    const validMessage = validateFields(updateClientInputName,
      updateClientInputEmail, updateClientInputCpf,
      phoneNoMask, secondaryPhoneNoMask);
    if (!validMessage.length) {
      await updateClient(
        updateClientInputName, updateClientInputEmail,
        updateClientInputCpf, phoneNoMask,
        secondaryPhoneNoMask, updateClientInputAddress,
        updateClientInputGender, updateClientInputBirthdate,
        updateClientInputAdministrativeRestrictions, updateClientInputHealthRestrictions,
        officeOption, updateLocation, selectedFeaturesID, id, startModal, user._id,
        baseImage,
      ).then((response) => response.data);
      return history.push('/');
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
            moment(updateClientInputBirthdate).format('DD/MM/YYYY'), updateClientInputGender,
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
            setInputName={setupdateClientInputName}
            inputName={updateClientInputName}
            setInputEmail={setupdateClientInputEmail}
            inputEmail={updateClientInputEmail}
            setInputCpf={setupdateClientInputCpf}
            inputCpf={updateClientInputCpf}
            setInputPhone={setupdateClientInputPhone}
            inputPhone={updateClientInputPhone}
            setInputSecondaryPhone={setupdateClientInputSecondaryPhone}
            secondaryPhone={updateClientInputSecondaryPhone}
            setInputGender={setupdateClientInputGender}
            inputGender={updateClientInputGender}
            setInputBirthdate={setupdateClientInputBirthdate}
            inputBirthdate={moment(updateClientInputBirthdate).format('YYYY-MM-DD')}
            setInputAdministrativeRestriction={setupdateClientInputAdministrativeRestrictions}
            inputAdministrativeRestriction={updateClientInputAdministrativeRestrictions}
            setInputHealthRestrictions={setupdateClientInputHealthRestrictions}
            inputHealthRestrictions={updateClientInputHealthRestrictions}
            setInputAddress={setupdateClientInputAddress}
            inputAddress={updateClientInputAddress}
            setOfficeOption={setOfficeOption}
            setLocationOption={setupdateLocation}
            locationOption={updateLocation}
            featuresList={featuresList}
            setSelectedFeatures={setClientFeatures}
            selectedFeatures={clientFeatures}
            setSelectedFeaturesID={setSelectedFeaturesID}
          />
        </GenericRegisterScreen>
      ) : null}
    </div>
  );
};

export default ClientUpdateScreen;
