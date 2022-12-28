import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import RightBoxInputs from './Style';
import { Label } from '../ClientDropdown/Style';
import customStyles from './dropdownStyle';
import { getActivesSectors } from '../../Services/Axios/sectorServices';
import { useProfileUser } from '../../Context';

const SectorDropdown = ({ setSector, sectorName, externalStyles = {} }) => {
  const [id, setId] = useState('');
  const [placeholder, setPlaceholder] = useState('Setor');
  const [listOfSectors, setListOfSectors] = useState([]);
  const { startModal } = useProfileUser();

  const listSectors = async () => {
    await getActivesSectors(startModal)
      .then((response) => setListOfSectors(response.data))
      .catch((error) => console.error(`An unexpected error ocourred while getting sectors. ${error}`));
  };

  useEffect(() => listSectors(), []);

  useEffect(() => {
    if (sectorName) {
      setPlaceholder(sectorName);
    }
  }, [sectorName]);

  const options = listOfSectors?.map((sector) => ({
    label: sector.name,
    value: sector._id,
  }));

  useEffect(() => setSector(id.value), [id]);

  return (
    <RightBoxInputs style={externalStyles}>
      <Label>
        Setor:
      </Label>
      <Select
        placeholder={placeholder}
        styles={customStyles}
        options={options}
        onChange={(value) => setId(value)}
      />
    </RightBoxInputs>
  );
};

export default SectorDropdown;
