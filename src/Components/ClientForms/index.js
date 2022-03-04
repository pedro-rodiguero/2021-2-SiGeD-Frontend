import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Multiselect } from 'multiselect-react-dropdown';
import RegisterInput from '../RegisterInput';
import { Dropdown } from '../UserForms/Style';
import {
  ClientFormsColumnText, Container, Label, styles,
} from './Style';
import colors from '../../Constants/colors';
import { useProfileUser } from '../../Context';
import { getClients, getCargos } from '../../Services/Axios/clientServices';

const ClientForms = ({
  setInputName,
  inputName,
  setInputEmail,
  inputEmail,
  setInputCpf,
  inputCpf,
  setInputPhone,
  inputPhone,
  setInputSecondaryPhone,
  secondaryPhone,
  setInputAddress,
  inputAddress,
  setOfficeOption,
  setLocationOption,
  featuresList,
  setSelectedFeatures,
  selectedFeatures,
  setSelectedFeaturesID,
  register,
}) => {
  const controlarCaracteristicas = (item) => {
    const featuresID = [];
    setSelectedFeatures(item);
    item.map((feat) => featuresID.push(feat._id));
    setSelectedFeaturesID(featuresID);
  };

  const [lotacao, setLotacao] = useState([]);
  const [cargos, SetCargo] = useState([]);
  const [cargoInicial, setCargoinicial] = useState('');
  const [idLot, setIdLot] = useState('');
  const [nomeLotacaoinicial, setnomeLotacaoInicial] = useState('');
  const { startModal } = useProfileUser();
  const { id } = useParams();
  useEffect(() => {
    async function loadLotacao() {
      const response = await getClients('/lotacao', startModal);
      const roleResponse = await getCargos('/role', startModal);
      if (id) {
        const lotacaoinforesponse = await getClients(`clients/${id}`, startModal);
        setIdLot(lotacaoinforesponse.data.location._id);
        setnomeLotacaoInicial(lotacaoinforesponse.data.location.name);
        setCargoinicial(lotacaoinforesponse.data.office);
      }
      SetCargo(roleResponse.data);
      setLotacao(response.data);
    }
    loadLotacao();
  }, []);
  return (
    <ClientFormsColumnText>
      <RegisterInput long type="text" title="Nome" setText={setInputName} value={inputName} />
      <RegisterInput long type="text" title="Email" setText={setInputEmail} value={inputEmail} />
      <RegisterInput type="text" title="CPF" setText={setInputCpf} value={inputCpf} />
      <RegisterInput type="text" title="Endereco" setText={setInputAddress} value={inputAddress} />
      <RegisterInput type="text" title="Telefone principal" setText={setInputPhone} value={inputPhone} />
      <RegisterInput type="text" title="Telefone secundario" setText={setInputSecondaryPhone} value={secondaryPhone} />
      <Form.Group style={styles.formGroup}>
        <Form.Label style={styles.formLabel}>Cargo:</Form.Label>
        <div style={styles.roleDiv}>
          <Dropdown
            as="select"
            onChange={(Option) => setOfficeOption(Option.target.value)}
            style={styles.borderStyle}
          >
            {!register
              ? <option selected disabled hidden value={cargoInicial}>{cargoInicial}</option>
              : <option hidden disabled selected value> </option>}
            { cargos ? cargos.map((cargo) => (
              <option value={cargo.name}>{cargo.name}</option>
            )) : null }
          </Dropdown>
        </div>
      </Form.Group>
      <Form.Group style={styles.formGroup}>
        <Form.Label style={styles.formLabel}>Lotacao:</Form.Label>
        <div style={styles.roleDiv}>
          <Dropdown
            as="select"
            onChange={(Option) => setLocationOption(Option.target.value)}
            style={styles.borderStyle}
          >
            {!register
              ? <option selected disabled hidden value={idLot}>{nomeLotacaoinicial}</option>
              : <option hidden disabled selected value> </option>}
            {lotacao ? lotacao.map((lot) => (
              <option value={lot._id}>{lot.name}</option>
            )) : null}
          </Dropdown>
        </div>
      </Form.Group>
      <Container long>
        <Label>
          Caracteristicas:
        </Label>
        <Multiselect
          options={featuresList}
          selectedValues={selectedFeatures}
          onSelect={controlarCaracteristicas}
          onRemove={controlarCaracteristicas}
          displayValue="name"
          placeholder=""
          emptyRecordMsg="Não há nenhuma característica disponível"
          style={{
            searchBox: {
              border: '2px solid black',
              borderRadius: '12px',
              height: 'max-content',
            },
            chips: {
              backgroundColor: colors.navHeaders,
            },
          }}
          avoidHighlightFirstOption="true"
          showArrow="true"
          closeOnSelect="false"
        />
      </Container>
    </ClientFormsColumnText>
  );
};

export default ClientForms;
