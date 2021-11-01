import { APIChat } from './baseService/index';

export async function getConversations(id, startModal) {
  try {
    const response = await APIChat.get(`my-rooms/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    if (error.response?.status === 500) {
      startModal('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error.response?.status !== 401) {
      startModal('Não foi possível obter a lista mensagens, tente novamente mais tarde.');
    }
    console.error(`An unexpected error ocourred while retrieving the clients list.${error}`);
  }
  return false;
}

export async function CreateConversation(myId, idTarget, startModal) {
  try {
    const response = await APIChat.get('/my-rooms/', myId);
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
