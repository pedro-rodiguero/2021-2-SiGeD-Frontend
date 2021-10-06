import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Multiselect } from 'multiselect-react-dropdown';
import RegisterInput from '../RegisterInput';
import { Dropdown } from '../UserForms/Style';
import {
  ClientFormsColumnText, Container, Label, styles,
} from './Style';
import colors from '../../Constants/colors';
import { getClients, getCargos } from '../../Services/Axios/clientServices';

const ClientForms = ({
  featuresList,
  clientFeatures,
  clientForm: client,
  onChange,
}) => {
  const onChangeFeatures = (items) => {
    const features = items.map((feature) => feature._id);
    onChange({ ...client, features });
  };

  const [stations, setStations] = useState([]);
  const [cargos, SetCargo] = useState([]);
  useEffect(() => {
    async function loadStations() {
      const stationsResponse = await getClients('/lotacao');
      const rolesResponse = await getCargos('/role');
      SetCargo(rolesResponse.data);
      setStations(stationsResponse.data);
    }

    loadStations();
  }, []);
  return (
    <ClientFormsColumnText>
      <RegisterInput long type="text" title="Nome" setText={(name) => onChange({ ...client, name })} value={client.name} />
      <RegisterInput long type="text" title="Email" setText={(email) => onChange({ ...client, email })} value={client.email} />
      <RegisterInput type="text" title="CPF" setText={(cpf) => onChange({ ...client, cpf })} value={client.cpf} />
      <RegisterInput type="text" title="Endereco" setText={(address) => onChange({ ...client, address })} value={client.address} />
      <RegisterInput type="text" title="Telefone principal" setText={(phone) => onChange({ ...client, phone })} value={client.phone} />
      <RegisterInput type="text" title="Telefone secundario" setText={(secondaryPhone) => onChange({ ...client, secondaryPhone })} value={client.secondaryPhone} />
      <Form.Group style={styles.formGroup}>
        <Form.Label style={styles.formLabel}>Cargo:</Form.Label>
        <div style={styles.roleDiv}>
          <Dropdown
            as="select"
            onChange={(e) => onChange({ ...client, office: e.target.value })}
            style={{ border: '0' }}
          >
            {cargos.map((cargo) => (
              <option value={cargo.name}>{cargo.name}</option>
            ))}
          </Dropdown>
        </div>
      </Form.Group>
      <Form.Group style={styles.formGroup}>
        <Form.Label style={styles.formLabel}>Lotação:</Form.Label>
        <div style={styles.roleDiv}>
          <Dropdown
            as="select"
            onChange={(e) => onChange({ ...client, location: e.target.value })}
            style={{ border: '0' }}
          >
            {stations.map((lot) => (
              <option key={lot._id} value={lot._id}>{lot.name}</option>
            ))}
          </Dropdown>
        </div>
      </Form.Group>
      <Container long>
        <Label>
          Caracteristicas:
        </Label>
        <Multiselect
          options={featuresList}
          selectedValues={clientFeatures}
          onSelect={onChangeFeatures}
          onRemove={onChangeFeatures}
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
              backgroundColor: colors.navHeaders, // colors.primary,
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
