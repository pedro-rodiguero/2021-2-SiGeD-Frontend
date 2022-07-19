import { APIClients, APICargos } from './baseService/index';

export async function getClients(url, startModal) {
  try {
    const response = await APIClients.get(url);
    return response;
  } catch (error) {
    if (error.response?.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response?.status !== 401) {
      startModal('Não foi possível obter a lista de clientes, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while retrieving the clients list.${error}`);
  }
  return false;
}

export async function getClientData(id, startModal) {
  try {
    const response = await APIClients.get(`clients/${id}`);
    return response;
  } catch (error) {
    if (error.response?.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response?.status !== 401) {
      startModal('Não foi possível obter dados sobre o cliente, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while retrieving the client data.${error}`);
  }
  return false;
}

export async function getFourClients(startModal) {
  try {
    const response = await APIClients.get('/clients/newest-four');
    return response;
  } catch (error) {
    if (error.response?.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response?.status !== 401) {
      startModal('Não foi possível listar os últimos quatro clientes, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while retrieving newest four clients list.${error}`);
  }
  return false;
}

export async function postClient(
  inputName, inputEmail, inputCpf, inputPhone, inputSecondaryPhone,
  inputAddress,
  inputGender, inputBirthdate, inputHealthRestrictions,
  inputAdministrativeRestrictions,
  officeOption, locationOption,
  selectedFeatures, startModal, userContext, baseImage,
) {
  try {
    const response = await APIClients.post('clients/create', {
      name: inputName,
      email: inputEmail,
      cpf: inputCpf,
      phone: inputPhone,
      secondaryPhone: inputSecondaryPhone,
      address: inputAddress,
      gender: inputGender,
      birthdate: inputBirthdate,
      healthRestrictions: inputHealthRestrictions,
      administrativeRestrictions: inputAdministrativeRestrictions,
      office: officeOption,
      location: locationOption,
      features: selectedFeatures,
      userID: userContext,
      image: baseImage,
    });
    return response;
  } catch (error) {
    if (error.response.status === 400 && error.response.data.message.email) {
      startModal('Email já cadastrado');
    } else if (error.response.status === 400 && error.response.data.message.cpf) {
      startModal('CPF já cadastrado');
    } else if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal('Não foi possivel criar o cliente. Tente novamente mais tarde');
    }

    if (error.response.status === 400 && error.response.data.message[0] === 'invalid cpf') {
      startModal('CPF Invalido');
    }

    console.error(`An unexpected error ocourred while creating a new client.${error}`);
  }
  return false;
}

export async function updateClient(
  inputName, inputEmail, inputCpf, inputPhone, inputSecondaryPhone,
  inputAddress, inputGender, inputBirthdate, inputHealthRestrictions,
  inputAdministrativeRestrictions, officeOption, locationOption,
  features, id, startModal, userContext, baseImage,
) {
  try {
    const response = await APIClients.put(`/clients/update/${id}`, {
      name: inputName,
      email: inputEmail,
      cpf: inputCpf,
      phone: inputPhone,
      secondaryPhone: inputSecondaryPhone,
      address: inputAddress,
      gender: inputGender,
      birthdate: inputBirthdate,
      healthRestrictions: inputHealthRestrictions,
      administrativeRestrictions: inputAdministrativeRestrictions,
      office: officeOption,
      location: locationOption,
      userID: userContext,
      features,
      image: baseImage,
    });
    return response;
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal('Não foi possivel atualizar o cliente. Tente novamente mais tarde');
    }
    console.error(`An unexpected error ocourred while updating the client data.${error}`);
  }
  return false;
}

export const toggleStatus = async (id, startModal) => {
  try {
    await APIClients.put(`/clients/toggleStatus/${id}`);
  } catch (error) {
    console.error(error);
    startModal('O cliente selecionado está vinculado a uma demanda aberta.\nConclua a demanda antes de desativar o cliente.');
  }
};

export const getFeatures = async (url, startModal) => {
  try {
    const res = await APIClients.get(url);
    return res;
  } catch (error) {
    if (error.response?.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response?.status !== 401) {
      startModal('Não foi possível obter a lista de caracteristicas, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while retrieving the features list.${error}`);
  }
  return false;
};

export const getClientFeatures = async (featuresList, startModal) => {
  try {
    const res = await APIClients.post('/featuresbyid', {
      featuresList,
    });
    return res;
  } catch (error) {
    if (error.response?.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response?.status !== 401) {
      startModal('Não foi possível obter a lista de categorias do cliente, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while retrieving the client features list.${error}`);
  }
  return false;
};

export const createFeature = async (
  name, description, color, startModal,
) => {
  try {
    const res = await APIClients.post('feature/create', {
      name,
      description,
      color,
    });
    if (res.data.status) {
      startModal('Preencha todos os campos para poder criar uma nova caracteristica');
    }
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal('Não foi possível criar a nova caracteristica, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while creating a new feature.${error}`);
  }
  return false;
};

export const updateFeature = async (
  name, description, color, id, startModal,
) => {
  try {
    const res = await APIClients.put(`feature/update/${id}`, {
      name,
      description,
      color,
    });
    if (res.data.status) {
      startModal('Preencha todos os campos para poder editar uma categoria');
    }
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal('Não foi possível atualizar a demanda, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while updating an already created demand.${error}`);
  }
};

export const deleteFeature = async (id, startModal) => {
  try {
    const res = await APIClients.delete(`/feature/delete/${id}`);
    return res;
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal(`Não foi possivel deletar a categoria.\n${error}`);
    }
    console.error(error);
  }
  return false;
};

export async function createWorkspace(name, description, startModal) {
  try {
    const response = await APIClients.post('lotacao/create', {
      name,
      description,
    });
    if (response.data.status) {
      startModal('Preencha todos os campos para poder criar uma nova lotação');
    }
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal('Não foi possível criar a nova lotação, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while creating a new workspace.${error}`);
  }
}

export const updateWorkspace = async (
  name, description, id, startModal,
) => {
  try {
    const res = await APIClients.put(`lotacao/update/${id}`, {
      name,
      description,
    });
    if (res.data.status) {
      startModal('Preencha todos os campos para poder editar uma lotação');
    }
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal('Não foi possível atualizar a lotação, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while updating an already created workspace.${error}`);
  }
};

export const deleteWorkspace = async (id, startModal) => {
  try {
    const res = await APIClients.delete(`/lotacao/delete/${id}`);
    return res;
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal(`Não foi possivel deletar a lotação.\n${error}`);
    }
    console.error(error);
  }
  return false;
};

export async function getCargos(url, startModal) {
  try {
    const response = await APICargos.get(url);
    return response;
  } catch (error) {
    if (error.response?.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response?.status !== 401) {
      startModal('Não foi possível obter a lista de clientes, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while retrieving the clients list.${error}`);
  }
  return false;
}

export async function createCargo(name, description, startModal) {
  try {
    const response = await APICargos.post('role', {
      name,
      description,
    });
    if (response.data.status) {
      startModal('Preencha todos os campos para poder criar um novo cargo');
    }
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal('Não foi possível criar a nova lotação, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while creating a new workspace.${error}`);
  }
}

export const updateCargo = async (
  name, description, id, startModal,
) => {
  try {
    const res = await APICargos.patch(`role/${id}`, {
      name,
      description,
    });
    if (res.data.status) {
      startModal('Preencha todos os campos para poder editar um cargo');
    }
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal('Não foi possível atualizar a lotação, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while updating an already created workspace.${error}`);
  }
};

export const deleteCargo = async (id, startModal) => {
  try {
    const res = await APICargos.delete(`/role/${id}`);
    return res;
  } catch (error) {
    if (error.response.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response.status !== 401) {
      startModal(`Não foi possivel deletar a lotação.\n${error}`);
    }
    console.error(error);
  }
  return false;
};
