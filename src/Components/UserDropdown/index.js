import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getUser } from '../../Services/Axios/userServices';
import { useProfileUser } from '../../Context';
import { UserSearchDiv, Label } from './Style';
import './input.css';
import customStyles from '../SectorDropdown/dropdownStyle';

const UserDropdown = ({
  externalFilters = {},
  waitForFilter = false,
  labelStyles = {},
  dropdownStyles = {},
  externalStyles = {},
  setUsername = () => {},
  initialValue,
  placeholder = 'Usuário',
  label = 'Usuário:',
}) => {
  const [currentOption, setCurrentOption] = useState({});
  const [users, setUsers] = useState([]);
  const [wasInicialized, setWasInicialized] = useState(false);

  // const [userId, setUserId] = useState('');

  const { startModal } = useProfileUser();

  if (dropdownStyles) {
    const selectStyles = { ...customStyles.control(), ...dropdownStyles };
    customStyles.control = () => (selectStyles);
  }

  const getUsers = async (filters) => {
    let url = 'users';
    if (filters) {
      url += '?';
      Object.keys(filters).forEach((key, index) => { url += `${index === 0 ? '' : '&'}${key}=${filters[key]}`; });
    }
    await getUser(url, startModal)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error(`An unexpected error ocourred while getting users. ${error}`));
  };

  useEffect(() => {
    let usersPromise;
    setUsers([]);
    if (externalFilters && Object.keys(externalFilters).length) {
      usersPromise = getUsers({ ...externalFilters });
    } else if (!waitForFilter) {
      usersPromise = getUsers();
    }
    usersPromise?.finally(() => setCurrentOption(''));
  }, [JSON.stringify(externalFilters)]);

  useEffect(() => {
    setUsername(currentOption.label);
  }, [JSON.stringify(currentOption)]);

  const getValue = () => {
    if (!currentOption && !wasInicialized && initialValue && users?.length) {
      const initialUser = users.find((u) => u.name === initialValue);
      setCurrentOption({ label: initialUser.name, value: initialUser._id });
      setWasInicialized(true);
      return '';
    }
    return currentOption || '';
  };

  return (
    <UserSearchDiv style={externalStyles}>
      <Label style={labelStyles}>
        {label}
      </Label>
      <Select
        placeholder={placeholder}
        styles={customStyles}
        options={users?.map((user) => ({ label: user.name, value: user._id }))}
        key={currentOption.name}
        value={getValue()}
        onChange={(op) => setCurrentOption(op)} />
    </UserSearchDiv>
  );
};

export default UserDropdown;
